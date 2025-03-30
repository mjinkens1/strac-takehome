import { useState, useCallback, memo, useMemo } from "react";
import { DriveFile } from "../types";
import { Tooltip } from "./Tooltip";
import {
  ArrowDownTrayIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { mimeTypeMap } from "../mime-type-map";

interface FileTableProps {
  files: DriveFile[];
  onDelete: (fileId: string) => void;
  nextPageToken?: string;
  loadingMore: boolean;
  onLoadMore: (pageToken: string) => void;
}

export function FileTable({
  files,
  onDelete,
  nextPageToken,
  loadingMore,
  onLoadMore,
}: FileTableProps) {
  const sortedFies = useMemo(
    () =>
      [...files].sort(
        (a, b) =>
          new Date(b.modifiedTime).getTime() -
          new Date(a.modifiedTime).getTime()
      ),
    [files]
  );

  return (
    <div className="flex flex-col justify-between h-full rounded border border-[var(--color-card-border)]">
      <div className="relative min-h-0 overflow-y-auto rounded bg-[var(--color-card-bg)] shadow-xl backdrop-blur-md">
        <table className="h-full min-w-full table-auto text-sm">
          <thead className="sticky top-0 z-10 border-b border-[var(--color-card-border)] bg-[var(--color-card-bg)] text-left text-muted-foreground font-bold">
            <tr>
              <th className="px-6 py-4 w-[40%]">Filename</th>
              <th className="px-6 py-4 w-[25%]">Type</th>
              <th className="px-6 py-4 w-[25%]">Modified</th>
              <th className="px-6 py-4 w-[10%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="relative">
            {sortedFies.map((file) => (
              <MemoizedFileRow key={file.id} file={file} onDelete={onDelete} />
            ))}

            {nextPageToken && (
              <tr>
                <td colSpan={4} className="px-6 py-4">
                  <button
                    onClick={() => onLoadMore(nextPageToken)}
                    className="w-full justify-center flex items-center text-blue-600 hover:text-blue-800"
                  >
                    {loadingMore ? (
                      <div className="size-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Load More"
                    )}
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const FileRow = ({
  file,
  onDelete,
}: {
  file: DriveFile;
  onDelete: (id: string) => void;
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setProgress(0);
      setDownloading(true);

      try {
        const res = await fetch(
          `/api/drive/download?id=${file.id}&name=${encodeURIComponent(
            file.name
          )}`
        );
        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const contentLength = +(res.headers.get("Content-Length") || 0);

        let received = 0;
        const chunks = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            received += value.length;
            if (contentLength) {
              const pct = Math.round((received / contentLength) * 100);
              setProgress(pct);
            }
          }
        }

        const blob = new Blob(chunks);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setDownloaded(true);
      } catch (err) {
        console.error("Download error", err);
      } finally {
        setDownloading(false);
      }
    },
    [file]
  );

  return (
    <tr className="border-t border-[var(--color-card-border)] hover:bg-[var(--muted)]">
      <td className="w-[40%] font-medium text-[var(--foreground)]">
        <Tooltip text={file.name}>
          <div className="px-6 py-4 max-w-80 truncate">{file.name}</div>
        </Tooltip>
      </td>
      <td className="w-[25%] px-6 py-4">
        <div className="flex items-center gap-2">
          {mimeTypeMap[file.mimeType]?.icon}
          {mimeTypeMap[file.mimeType]?.label || file.mimeType}
        </div>
      </td>
      <td className="w-[25%] px-6 py-4">
        {new Date(file.modifiedTime).toLocaleString()}
      </td>
      <td className="w-[10%] px-6 py-4 text-right space-x-4 whitespace-nowrap">
        <a
          href={`/api/drive/download?id=${file.id}&name=${encodeURIComponent(
            file.name
          )}`}
          download={file.name}
          onClick={handleDownload}
          className={`text-blue-600 hover:text-blue-800 inline-block ${
            downloading || downloaded ? "pointer-events-none" : ""
          }`}
        >
          {downloaded ? (
            <CheckIcon className="size-5 text-green-500" />
          ) : downloading ? (
            <div className="relative size-5">
              <svg
                viewBox="0 0 36 36"
                className="absolute top-0 left-0 size-full"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-gray-300 dark:stroke-zinc-700"
                  strokeWidth="4"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-blue-600 transition-all duration-400"
                  strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 16}
                  strokeDashoffset={2 * Math.PI * 16 * (1 - progress / 100)}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          ) : (
            <Tooltip text="Download">
              <ArrowDownTrayIcon className="size-5" />
            </Tooltip>
          )}
        </a>

        <Tooltip text="Delete">
          <button
            onClick={() => onDelete(file.id)}
            className="text-red-500 hover:text-red-700"
          >
            <TrashIcon className="size-5" />
          </button>
        </Tooltip>
      </td>
    </tr>
  );
};

const MemoizedFileRow = memo(FileRow);
MemoizedFileRow.displayName = "FileRow";
