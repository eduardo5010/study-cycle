# Uploads, OCR and AI generation

## Configuration

- OPENAI_API_KEY: (optional) set to enable OpenAI-based generation.
- To enable OCR using tesseract.js, install the package in the project:

  npm install tesseract.js

  Additionally, for best results install the system tesseract binary (e.g. `apt install tesseract-ocr`).

## Endpoints

- POST /api/uploads

  - multipart/form-data, field `file`.
  - requires header `user-id` representing the uploader (in production use proper auth tokens).
  - stores file under `server/uploads/<user-id>/` and creates a content entry (private).

- GET /api/uploads/:contentId/file

  - streams the file to the owner only (validates `user-id` header matches the content creator).

- POST /api/content/:id/generate
  - body: { difficulty?: 'easy'|'medium'|'hard', modes?: string[] }
  - requires header `user-id` (owner or teacher)
  - generates review variants using OpenAI (if configured) or a local fallback and stores them as review variants.

## Worker

- server/ocr/worker.ts will attempt to dynamically import `tesseract.js` and run OCR on uploaded files. If the package is not installed it will fallback to trying to read the file as text.

## Notes

- Uploaded files are marked private and not served publicly. If you need thumbnails or previews, implement an authenticated endpoint that returns derived media.
- For production, replace the `user-id` header check with proper JWT/session validation.
