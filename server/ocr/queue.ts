// Simple in-process OCR queue. Processes jobs sequentially to avoid concurrent tesseract runs.
const queue: Array<{ path: string; contentId: string; userId?: string }> = [];
let running = false;

async function runNext() {
  if (running) return;
  const job = queue.shift();
  if (!job) return;
  running = true;
  try {
    const worker = await import("./worker");
    await worker.processFile(job.path, job.contentId, job.userId);
  } catch (err) {
    console.warn("OCR job failed", err);
  } finally {
    running = false;
    // schedule next
    setImmediate(runNext);
  }
}

export function enqueue(path: string, contentId: string, userId?: string) {
  queue.push({ path, contentId, userId });
  setImmediate(runNext);
}

export default { enqueue };
