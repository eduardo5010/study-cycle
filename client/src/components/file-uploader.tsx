import React, { useState } from "react";

type Props = {
  userId: string;
};

export default function FileUploader({ userId }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [uploadedContent, setUploadedContent] = useState<any | null>(null);
  const [generated, setGenerated] = useState<any[] | null>(null);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
  };

  const upload = async () => {
    if (!file) return;
    setStatus("Uploading...");
    const fd = new FormData();
    fd.append("file", file);

    try {
      const resp = await fetch("/api/uploads", {
        method: "POST",
        headers: {
          "user-id": userId,
        } as any,
        body: fd,
      });
      if (!resp.ok) {
        const txt = await resp.text();
        setStatus(`Upload failed: ${resp.status} ${txt}`);
        return;
      }
      const data = await resp.json();
      setUploadedContent(data);
      setStatus("Uploaded");
    } catch (err: any) {
      setStatus(`Upload error: ${err?.message || err}`);
    }
  };

  const generate = async (difficulty = "medium") => {
    if (!uploadedContent) return;
    setStatus("Generating...");
    try {
      const resp = await fetch(`/api/content/${uploadedContent.id}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
        } as any,
        body: JSON.stringify({ difficulty, modes: ["flashcard", "quiz"] }),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        setStatus(`Generation failed: ${resp.status} ${txt}`);
        return;
      }
      const data = await resp.json();
      setGenerated(data.generated || []);
      setStatus("Generated");
    } catch (err: any) {
      setStatus(`Generation error: ${err?.message || err}`);
    }
  };

  const download = () => {
    if (!uploadedContent) return;
    const a = document.createElement("a");
    a.href = `/api/uploads/${uploadedContent.id}/file`;
    a.setAttribute("data-user-id", userId);
    // we rely on browser to send header? cannot set header via anchor. Need fetch.
    // We'll use fetch to get blob then download.
    setStatus("Downloading...");
    fetch(`/api/uploads/${uploadedContent.id}/file`, {
      method: "GET",
      headers: { "user-id": userId } as any,
    })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download =
          uploadedContent.metadata?.originalName ||
          uploadedContent.title ||
          "download";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        setStatus("Downloaded");
      })
      .catch((e) => setStatus(`Download error: ${e?.message || e}`));
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-medium mb-2">Upload de arquivo</h3>
      <input type="file" onChange={onSelect} />
      <div className="mt-2">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded mr-2"
          onClick={upload}
          disabled={!file}
        >
          Upload
        </button>
        <button
          className="px-3 py-1 bg-green-600 text-white rounded mr-2"
          onClick={() => generate("easy")}
          disabled={!uploadedContent}
        >
          Gerar (fácil)
        </button>
        <button
          className="px-3 py-1 bg-yellow-600 text-white rounded mr-2"
          onClick={() => generate("medium")}
          disabled={!uploadedContent}
        >
          Gerar (médio)
        </button>
        <button
          className="px-3 py-1 bg-red-600 text-white rounded"
          onClick={() => generate("hard")}
          disabled={!uploadedContent}
        >
          Gerar (difícil)
        </button>
      </div>

      {uploadedContent && (
        <div className="mt-3">
          <div>Uploaded: {uploadedContent.title || uploadedContent.id}</div>
          <button
            onClick={download}
            className="mt-2 underline text-sm text-blue-600"
          >
            Download arquivo
          </button>
        </div>
      )}

      {status && <div className="mt-2 text-sm">Status: {status}</div>}

      {generated && (
        <div className="mt-3">
          <h4 className="font-medium">Gerados</h4>
          <ul className="list-disc pl-5">
            {generated.map((g, idx) => (
              <li key={idx}>
                <pre className="whitespace-pre-wrap text-sm">
                  {JSON.stringify(g, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
