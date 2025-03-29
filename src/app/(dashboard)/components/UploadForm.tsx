"use client";

import { useState } from "react";

export function UploadForm({ onSuccess }: { onSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/drive/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      setError("Upload failed");
    } else {
      setFile(null);
      onSuccess?.();
    }
    setLoading(false);
  };

  return (
    <div className="mb-6 flex flex-col gap-2">
      <input
        data-testid="file-input"
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        accept="application/pdf"
      />
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Uploading…" : "Upload File"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
