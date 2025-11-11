// Small abstraction to persist per-user lambda values and related metadata
const STORAGE_KEY_PREFIX = "studycycle:lambda:";

export type LambdaRecord = {
  lambda: number;
  updatedAt: string; // ISO
  source?: "online" | "tfjs" | "backend";
};

export function getLambdaKey(userId: string) {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

export function loadLambda(userId: string): LambdaRecord | null {
  try {
    const raw = localStorage.getItem(getLambdaKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed as LambdaRecord;
  } catch (e) {
    console.warn("Failed to load lambda for", userId, e);
    return null;
  }
}

export function saveLambda(
  userId: string,
  lambda: number,
  source: LambdaRecord["source"] = "online"
) {
  const rec: LambdaRecord = {
    lambda,
    updatedAt: new Date().toISOString(),
    source,
  };
  try {
    localStorage.setItem(getLambdaKey(userId), JSON.stringify(rec));
  } catch (e) {
    console.warn("Failed to save lambda for", userId, e);
  }
}

export function clearLambda(userId: string) {
  try {
    localStorage.removeItem(getLambdaKey(userId));
  } catch (e) {
    console.warn("Failed to clear lambda for", userId, e);
  }
}
