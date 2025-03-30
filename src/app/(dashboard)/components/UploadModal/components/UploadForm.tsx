"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  ArrowUpTrayIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
}

interface UploadFormProps {
  uploading: boolean;
  onSuccess: (newFile: DriveFile) => void;
  allowMultiple?: boolean;
  onUploading: (uploading: boolean) => void;
  onAllSuccess: () => void;
}

export function UploadForm({
  uploading,
  onSuccess,
  allowMultiple,
  onUploading,
  onAllSuccess,
}: UploadFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [uploadedFiles, setUploadedFiles] = useState<Set<string>>(new Set());

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setError(null);
  }, []);

  const uploadFile = (file: File) => {
    return new Promise<DriveFile>((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/drive/upload");

      setUploadingFiles((prev) => new Set(prev).add(file.name));

      const cleanup = () => {
        setUploadingFiles((prev) => {
          const next = new Set(prev);
          next.delete(file.name);
          return next;
        });
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const json = JSON.parse(xhr.responseText);
          setUploadedFiles((prev) => new Set(prev).add(file.name));
          onSuccess(json.results[0] as DriveFile);
          resolve(json.results[0]);
        } else {
          cleanup();
          reject(new Error("Upload failed"));
        }
      };

      xhr.onerror = () => {
        cleanup();
        reject(new Error("Upload failed"));
      };

      xhr.send(formData);
    });
  };

  const uploadFiles = async () => {
    if (!files.length) return;

    onUploading(true);
    setError(null);

    const results = await Promise.allSettled(files.map(uploadFile));

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      setError(`${failed.length} file(s) failed to upload`);
    }

    onUploading(false);
    setFiles([]);
    setUploadedFiles(new Set());
    onAllSuccess();
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
      {!uploading && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md px-6 py-10 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-[var(--accent)] bg-[var(--muted)]"
              : "border-[var(--color-card-border)] bg-[var(--card-bg)] hover:bg-[var(--muted)]"
          }`}
        >
          <input data-testid="file-input" {...getInputProps()} />
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
      )}

      {files.length > 0 && (
        <div className="space-y-2 overflow-y-auto max-h-[200px]">
          {files.map((file) => {
            const isUploading = uploadingFiles.has(file.name);
            const isCompleted = uploadedFiles.has(file.name);
            return (
              <div
                key={file.name}
                className="flex items-center justify-between rounded border border-[var(--color-card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm"
              >
                <div className="truncate w-full pr-2">{file.name}</div>
                {isCompleted ? (
                  <CheckIcon className="size-4 text-green-500" />
                ) : isUploading ? (
                  <div className="size-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() =>
                      setFiles((prev) =>
                        prev.filter((f) => f.name !== file.name)
                      )
                    }
                  >
                    <XMarkIcon className="size-4" />
                  </button>
                )}
              </div>
            );
          })}
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
