import { storage } from "../storage";
import { readFile } from "fs/promises";

// Best-effort OCR worker helper. Attempts to use 'node-tesseract-ocr' if installed.
// If not present, it will extract no text but will still update content metadata.

export async function processFile(
  filePath: string,
  contentId: string,
  userId?: string
) {
  console.log("OCR worker started for", filePath);

  let extractedText = "";
  try {
    // try dynamic import of tesseract.js (preferred) or node-tesseract-ocr
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker({
        // logger: (m) => console.log(m),
      });
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const { data } = await worker.recognize(filePath);
      extractedText = data?.text || "";
      await worker.terminate();
      console.log("OCR extracted length (tesseract.js)", extractedText.length);
    } catch (tjsErr) {
      try {
        const tesseract = await import("node-tesseract-ocr");
        extractedText = await tesseract.recognize(filePath, {});
        console.log(
          "OCR extracted length (node-tesseract-ocr)",
          extractedText.length
        );
      } catch (err) {
        console.warn("Tesseract OCR attempt failed:", tjsErr, err);
      }
    }
  } catch (e) {
    console.warn(
      "node-tesseract-ocr not available; skipping OCR. If you want OCR, install node-tesseract-ocr and the tesseract binary."
    );
    // fallback: if the file is a text file, try to read it
    try {
      const buf = await readFile(filePath);
      const str = buf.toString("utf8");
      // Heuristic: if the text is short, we assume it's text content
      if (str && str.length < 200000) extractedText = str;
    } catch (readErr) {
      // ignore
    }
  }

  // Update content metadata with extracted text (best-effort)
  try {
    // merge with existing metadata if present
    const all = await storage.getAllContent();
    const existing = all.find((c) => c.id === contentId);
    const prevMeta = (existing && (existing.metadata as any)) || {};
    const newMeta = {
      ...prevMeta,
      ocrText: extractedText || null,
      ocrProcessedAt: new Date(),
    };
    await storage.updateContent(contentId, { metadata: newMeta } as any);
    console.log("Updated content metadata for", contentId);
  } catch (err) {
    console.warn("Failed to update content with OCR results:", err);
  }

  // Optionally, we could auto-trigger generation here using AI; but keep it decoupled
}

export default { processFile };
