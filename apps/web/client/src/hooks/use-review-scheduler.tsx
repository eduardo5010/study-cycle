import React, { useEffect, useRef, useState } from "react";
import { useReview } from "./use-review";
import forgetting from "@/lib/forgetting";

// Component that runs in the main layout and periodically checks for due reviews.
// Strategy:
// - Periodically (configurable) GET /api/ml/events and filter by current user
// - For each item seen in events, call recommendNextInterval (via useReview.getNextInterval)
// - If elapsed since last review >= recommended interval -> queue as due
// - When a due item is found, open a modal showing a variant (getVariantFor)
// - On outcome, reportOutcome will log and update lambda (handled by recordReviewOutcome)

interface DueItem {
  itemId: string;
  lastReviewAt: string | null;
  recommendedIntervalSec: number;
}

export function ReviewScheduler({
  pollIntervalMs = 60000,
}: {
  pollIntervalMs?: number;
}) {
  const { getVariantFor, reportOutcome, getNextInterval } = useReview();
  const [open, setOpen] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<any | null>(null);
  const [currentItem, setCurrentItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const runningRef = useRef(false);

  // fetch user id from auth header via /api/auth/me
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return;
        const json = await res.json();
        if (mounted && json && json.id) setUserId(json.id);
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function checkDueOnce() {
    if (!userId) return;
    if (runningRef.current) return;
    runningRef.current = true;
    try {
      const res = await fetch(`/api/ml/events`);
      if (!res.ok) return;
      const allEvents = (await res.json()) as any[];
      const userEvents = allEvents.filter((e) => e.userId === userId);
      // group by item
      const byItem = new Map<string, any[]>();
      for (const e of userEvents) {
        const arr = byItem.get(e.itemId) || [];
        arr.push(e);
        byItem.set(e.itemId, arr);
      }

      const now = Date.now();
      for (const entry of Array.from(byItem.entries())) {
        const itemId = entry[0];
        const evs = entry[1];
        // get last event timestamp
        const last = evs
          .slice()
          .sort(
            (a: any, b: any) =>
              Date.parse(b.createdAt || b.timestamp) -
              Date.parse(a.createdAt || a.timestamp)
          )[0];
        const lastTs = last ? Date.parse(last.createdAt || last.timestamp) : 0;
        const elapsedSec = (now - lastTs) / 1000;
        // ask backend for recommendedInterval
        const rec = await getNextInterval({ userId, itemId });
        if (!rec) continue;
        const recommended = rec.recommendedIntervalSec || 0;
        if (elapsedSec >= recommended && !open) {
          // due: load a variant and show
          setLoading(true);
          const v = await getVariantFor(itemId, userId);
          setCurrentVariant(v);
          setCurrentItem(itemId);
          setOpen(true);
          setLoading(false);
          break; // show one at a time
        }
      }
    } catch (e) {
      // ignore
    } finally {
      runningRef.current = false;
    }
  }

  useEffect(() => {
    const id = setInterval(() => {
      checkDueOnce();
    }, pollIntervalMs);
    // run immediately once
    checkDueOnce();
    return () => clearInterval(id);
  }, [userId]);

  // UI modal to show currentVariant
  if (!open) return null;

  return (
    <div>
      {/* simple portal modal using native dialog UI components */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setOpen(false)}
        />
        <div className="relative bg-white rounded-none p-6 max-w-full w-11/12 h-[85vh] overflow-auto z-10 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Revisão</h3>
          {loading && <div>Carregando...</div>}
          {!loading && currentVariant && (
            <div>
              <div className="font-semibold">
                {currentVariant.content?.question ||
                  currentVariant.content?.prompt}
              </div>
              {currentVariant.content?.choices && (
                <ul className="list-disc list-inside ml-4">
                  {currentVariant.content.choices.map(
                    (c: string, i: number) => (
                      <li key={i}>{c}</li>
                    )
                  )}
                </ul>
              )}
            </div>
          )}

          <div className="mt-4 flex gap-2 justify-end">
            <button className="btn btn-ghost" onClick={() => setOpen(false)}>
              Fechar
            </button>
            <button
              className="btn btn-outline"
              onClick={async () => {
                if (!currentItem) return;
                await reportOutcome({
                  userId: userId!,
                  itemId: currentItem,
                  correctness: 0,
                });
                setOpen(false);
                setCurrentVariant(null);
                setCurrentItem(null);
              }}
            >
              Não lembro
            </button>
            <button
              className="btn btn-primary"
              onClick={async () => {
                if (!currentItem) return;
                await reportOutcome({
                  userId: userId!,
                  itemId: currentItem,
                  correctness: 1,
                });
                setOpen(false);
                setCurrentVariant(null);
                setCurrentItem(null);
              }}
            >
              Lembrei
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewScheduler;
