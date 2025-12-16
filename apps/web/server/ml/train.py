"""Simple training script to consume review events and train a lightweight recall model.

Usage: python3 server/ml/train.py

This script expects the dev server to be running and exposes review events at /api/ml/events
It will train a small scikit-learn model and save it to server/models/recall_model.pkl

Notes:
- This is a minimal worker for local experimentation. In production you should
  run a scheduled worker, authenticate requests, and persist artifacts to a
  proper model registry.
"""
import os
import sys
import json
from collections import defaultdict
from datetime import datetime

import requests
import pandas as pd
from dateutil import parser as dateparser
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score
import joblib
import numpy as np

SERVER_URL = os.environ.get("STUDY_CYCLE_SERVER", "http://localhost:5000")
EVENTS_EP = f"{SERVER_URL}/api/ml/events"
MODEL_OUT = os.path.join(os.path.dirname(__file__), "..", "models", "recall_model.pkl")


def fetch_events():
    print(f"Fetching events from {EVENTS_EP}")
    r = requests.get(EVENTS_EP, timeout=15)
    r.raise_for_status()
    return r.json()


def prepare_dataset(events):
    # events: list of dicts. We'll attempt to construct per-event features based on history
    # Build timeline per (user, item)
    groups = defaultdict(list)
    for e in events:
        user = e.get("userId") or e.get("user") or "anon"
        item = e.get("itemId") or e.get("item") or e.get("item_id") or "unknown"
        created = e.get("createdAt") or e.get("timestamp") or e.get("ts")
        if created:
            try:
                ts = dateparser.parse(created)
            except Exception:
                try:
                    ts = datetime.utcfromtimestamp(int(created))
                except Exception:
                    ts = None
        else:
            ts = None
        # optional: interval or delta
        interval = e.get("intervalSec") or e.get("deltaSec") or e.get("interval_seconds")
        groups[(user, item)].append({"event": e, "ts": ts, "interval": interval})

    rows = []
    for (user, item), evs in groups.items():
        # sort by ts if available
        evs.sort(key=lambda x: x["ts"] or datetime.min)
        prev_intervals = []
        # compute S running sum (sum of t_i / n_i) for this user-item
        S_running = 0.0
        for i, entry in enumerate(evs):
            evt = entry["event"]
            outcome = evt.get("outcome")
            if outcome is None:
                # if not explicit, try to infer from correctness
                outcome = evt.get("correct")
            if outcome is None:
                # skip if no label
                continue
            # features based on previous history (exclude this event's interval)
            n_prev = i
            avg_prev_interval = float(sum(prev_intervals) / len(prev_intervals)) if prev_intervals else 0.0
            last_interval = float(prev_intervals[-1]) if prev_intervals else 0.0
            # time since first review
            first_ts = evs[0]["ts"]
            last_ts = evs[i - 1]["ts"] if i > 0 else None
            time_since_prev = (entry["ts"] - last_ts).total_seconds() if last_ts and entry["ts"] else 0.0
            # compute delta t/n for this event if available
            t_i = time_since_prev if time_since_prev and time_since_prev > 0 else (entry.get("interval") or 0.0)
            n_i = evt.get("nReps") or evt.get("n_reps") or 1
            try:
                S_running_val = float(S_running)
            except Exception:
                S_running_val = 0.0
            rows.append({
                "user": user,
                "item": item,
                "n_prev": n_prev,
                "avg_prev_interval": avg_prev_interval,
                "last_interval": last_interval,
                "time_since_prev": time_since_prev,
                "S": S_running_val,
                "label": int(bool(outcome))
            })
            # update prev_intervals using this event's interval if present
            if entry["interval"]:
                try:
                    prev_intervals.append(float(entry["interval"]))
                except Exception:
                    pass
            # update running S using t_i / n_i
            try:
                S_running += float(t_i) / max(1.0, float(n_i))
            except Exception:
                pass
    if not rows:
        return None
    df = pd.DataFrame(rows)
    return df


def train_and_save(df):
    X = df[["n_prev", "avg_prev_interval", "last_interval", "time_since_prev"]].fillna(0.0)
    y = df["label"]
    if len(y.unique()) < 2:
        print("Not enough class variety to train (need both 0 and 1). Aborting.")
        return False
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    clf = LogisticRegression(max_iter=1000)
    clf.fit(X_train, y_train)
    preds = clf.predict(X_test)
    probs = clf.predict_proba(X_test)[:, 1]
    acc = accuracy_score(y_test, preds)
    auc = roc_auc_score(y_test, probs)
    print(f"Trained model: acc={acc:.3f}, auc={auc:.3f}")
    joblib.dump(clf, MODEL_OUT)
    print(f"Saved model to {MODEL_OUT}")
    return True


def estimate_lambdas(df):
    # df expected to have columns: user, item, S, label
    users = df["user"].unique()
    user_lambdas = {}
    for u in users:
        sub = df[df["user"] == u]
        Ss = sub["S"].values
        ys = sub["label"].values
        if len(Ss) == 0:
            continue
        # grid search for lambda minimizing negative log-likelihood
        lambdas = list(np.linspace(1e-6, 1.0, 300))
        best = None
        best_val = float("inf")
        eps = 1e-6
        for lam in lambdas:
            ps = np.exp(-lam * Ss)
            # clamp
            ps = np.clip(ps, eps, 1 - eps)
            nll = -np.sum(ys * np.log(ps) + (1 - ys) * np.log(1 - ps))
            if nll < best_val:
                best_val = nll
                best = lam
        if best is not None:
            user_lambdas[u] = float(best)
    return user_lambdas


def main():
    try:
        events = fetch_events()
    except Exception as e:
        print("Failed to fetch events:", e)
        sys.exit(1)

    df = prepare_dataset(events)
    if df is None:
        print("No labelled events found to train on. Exiting.")
        sys.exit(0)
    print(f"Prepared dataset with {len(df)} rows")
    success = train_and_save(df)
    if not success:
        sys.exit(1)
    # estimate per-user lambda and post to backend
    try:
        user_lambdas = estimate_lambdas(df)
        for user_id, lam in user_lambdas.items():
            try:
                post_url = f"{SERVER_URL}/api/ml/lambda/{user_id}"
                resp = requests.post(post_url, json={"lambda": lam, "source": "worker"}, timeout=10)
                if resp.ok:
                    print(f"Posted lambda {lam:.6f} for user {user_id}")
                else:
                    print(f"Failed to post lambda for {user_id}: {resp.status_code}")
            except Exception as e:
                print(f"Error posting lambda for {user_id}", e)
    except Exception as e:
        print("Failed estimating/posting user lambdas", e)

if __name__ == "__main__":
    main()
