"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UploadModal } from "./components/UploadModal/UploadModal";
import { TopProgressBar } from "../components/TopProgress";
import { NavBar } from "./components/Navbar/Navbar";
import { FileTable } from "./components/FileTable/FileTable";
import type { DriveFile } from "./types";
import { BeakerIcon } from "@heroicons/react/24/outline";
import { useToast } from "../components/Toast";

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string>();
  const addToast = useToast();

  const fetchFiles = async (pageToken?: string, showLoading = true) => {
    setLoading(showLoading);
    try {
      const res = await fetch(`/api/drive/list?pageToken=${pageToken || ""}`);
      const data = await res.json();
      console.log({ data });
      if (res.ok) {
        setFiles((prevFiles) => [...prevFiles, ...data.files]);
        setNextPageToken(data.nextPageToken);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async (pageToken: string) => {
    setLoadingMore(true);
    await fetchFiles(pageToken, false);
    setLoadingMore(false);
  };

  const handleDelete = async (fileId: string) => {
    // Optimistically remove from UI
    const prevFiles = [...files];
    setFiles((f) => f.filter((file) => file.id !== fileId));

    const file = files.find((f) => f.id === fileId);

    try {
      const res = await fetch(`/api/drive/delete?id=${fileId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      addToast({ message: "Deleted " + file?.name || "file", type: "success" });
    } catch (err) {
      console.error("Rollback due to failed delete:", err);
      addToast({ message: "Failed to delete file", type: "error" });
      setFiles(prevFiles); // Rollback
    }
  };

  const handleUploadSuccess = (file: DriveFile) => {
    setFiles((prevFiles) => [...prevFiles, file]);
    addToast({ message: "Uploaded " + file.name || "file", type: "success" });
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
          <UploadModal onUploadSuccess={handleUploadSuccess} />
        </div>
        <div className="h-[calc(100vh-200px)]">
          {loading && (
            <table className="min-w-full text-sm">
              <tbody>
                {Array.from({ length: 14 }).map((_, i) => (
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
            <FileTable
              files={files}
              onDelete={handleDelete}
              nextPageToken={nextPageToken}
              onLoadMore={handleLoadMore}
              loadingMore={loadingMore}
            />
          )}
        </div>
      </main>
    </div>
  );
}
