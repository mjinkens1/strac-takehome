"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface UploadFormProps {
  uploading: boolean;
  onSuccess: () => void;
  allowMultiple?: boolean;
  onUploading: (uploading: boolean) => void;
}

export function UploadForm({
  uploading,
  onSuccess,
  allowMultiple,
  onUploading,
}: UploadFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setError(null);
  }, []);

  const uploadFiles = async () => {
    if (!files.length) return;

    onUploading(true);
    setError(null);

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/drive/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
      } catch (err) {
        console.error(err);
        setError("Failed to upload file(s)");
      }
    }

    onUploading(false);
    setFiles([]);
    onSuccess();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: allowMultiple,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        uploadFiles();
      }}
      className="flex flex-col gap-4"
    >
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md px-6 py-10 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-[var(--accent)] bg-[var(--muted)]"
            : "border-[var(--color-card-border)] bg-[var(--card-bg)] hover:bg-[var(--muted)]"
        }`}
      >
        <input {...getInputProps()} />
        <ArrowUpTrayIcon className="mx-auto mb-2 size-6 text-[var(--accent)]" />
        {isDragActive ? (
          <p className="text-sm">Drop your files here...</p>
        ) : (
          <p className="text-sm">
            Drag & drop files here, or{" "}
            <span className="underline">choose files</span>
          </p>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-2 overflow-y-auto max-h-[200px]">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between rounded border border-[var(--color-card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm"
            >
              <div className="truncate w-full">{file.name}</div>
              <button
                type="button"
                className="ml-4 text-red-500 hover:text-red-700"
                onClick={() =>
                  setFiles((prev) => prev.filter((f) => f.name !== file.name))
                }
              >
                <XMarkIcon className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={uploading || !files.length}
        className="gradient-background inline-flex justify-center items-center rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
