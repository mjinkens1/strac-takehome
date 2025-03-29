"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UploadForm } from "./components/UploadForm";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
}

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/drive/list");
      const data = await res.json();
      setFiles(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      const res = await fetch(`/api/drive/delete?id=${fileId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchFiles();
      } else {
        console.error("Delete failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = (fileId: string, fileName: string) => {
    const url = `/api/drive/download?id=${fileId}&name=${encodeURIComponent(
      fileName
    )}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchFiles();
    }
  }, [status]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Google Drive Files</h1>

      <UploadForm onSuccess={fetchFiles} />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-md border bg-muted px-4 py-2 text-sm"
            >
              <div className="truncate">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-muted-foreground text-xs">
                  {file.mimeType} •{" "}
                  {new Date(file.modifiedTime).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(file.id, file.name)}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
