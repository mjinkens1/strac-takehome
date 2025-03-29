"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UploadModal } from "./components/UploadModal";
import { TopProgressBar } from "../components/TopProgress";
import { NavBar } from "./components/NavBar";
import { FileTable } from "./components/FileTable";
import type { DriveFile } from "./types";
import { BeakerIcon } from "@heroicons/react/24/outline";
import { Toast } from "../components/Toast";

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/drive/list");
      const data = await res.json();
      if (res.ok) {
        setFiles(data);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    // Optimistically remove from UI
    const prevFiles = [...files];
    setFiles((f) => f.filter((file) => file.id !== fileId));

    try {
      const res = await fetch(`/api/drive/delete?id=${fileId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setToast({ message: "File deleted", type: "success" });
    } catch (err) {
      console.error("Rollback due to failed delete:", err);
      setToast({ message: "Failed to delete file", type: "error" });
      setFiles(prevFiles); // Rollback
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") fetchFiles();
  }, [status]);

  if (status !== "authenticated") {
    return <TopProgressBar loading={status === "loading"} />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <NavBar />
      <TopProgressBar loading={loading} />

      <main className="mx-auto max-w-7xl px-4 py-12 h-[calc(100vh-120px)]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Your Files</h1>
          <UploadModal onUploadSuccess={fetchFiles} />
        </div>
        <div className="h-[calc(100vh-200px)]">
          {loading && (
            <table className="min-w-full text-sm">
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr
                    key={i}
                    className="border-t border-[var(--color-card-border)]"
                  >
                    <td className="px-6 py-4 w-1/3">
                      <div className="h-4 w-full rounded skeleton" />
                    </td>
                    <td className="px-6 py-4 w-1/4">
                      <div className="h-4 w-full rounded skeleton" />
                    </td>
                    <td className="px-6 py-4 w-1/4">
                      <div className="h-4 w-full rounded skeleton" />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 w-1/6">
                      <div className="inline-block h-4 w-5 rounded skeleton" />
                      <div className="inline-block h-4 w-5 rounded skeleton" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {error && (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
          {!loading && files.length === 0 && (
            <div className="text-center text-muted-foreground py-12 h-full flex items-center justify-center">
              <div className="flex flex-col items-center">
                <BeakerIcon className="mx-auto size-8 text-gray-500 mb-2" />
                <p className="text-sm">No files uploaded yet.</p>
              </div>
            </div>
          )}
          {!loading && !error && files.length > 0 && (
            <FileTable files={files} onDelete={handleDelete} />
          )}

          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
