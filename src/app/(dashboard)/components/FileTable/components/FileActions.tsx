import { useCallback, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

import { DriveFile } from "@/app/(dashboard)/types";

import { Tooltip } from "@/app/components/Tooltip";
import { DownloadIcon } from "./DownloadIcon";

interface FileActionsProps {
  file: DriveFile;
  onDelete: (id: string) => void;
}

export function FileActions({ file, onDelete }: FileActionsProps) {
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

        const contentLength = +(res.headers.get("Content-Length") || 0);
        const contentDisposition = res.headers.get("Content-Disposition");
        const match = contentDisposition?.match(/filename="(.+?)"/i);
        const filename = match?.[1] || file.name;

        const reader = res.body.getReader();
        const chunks: Uint8Array[] = [];
        let received = 0;

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
        a.download = filename;
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
    <td className="w-[10%] px-6 py-4 text-right space-x-4 whitespace-nowrap">
      <a
        href="#"
        onClick={handleDownload}
        className={`text-blue-600 hover:text-blue-800 inline-block ${
          downloading || downloaded ? "pointer-events-none" : ""
        }`}
      >
        <DownloadIcon
          downloaded={downloaded}
          downloading={downloading}
          progress={progress}
        />
      </a>

      <Tooltip text="Delete">
        <button
          data-testid={`delete-button-${file.id}`}
          onClick={() => onDelete(file.id)}
          className="text-red-500 hover:text-red-700"
        >
          <TrashIcon className="size-5" />
        </button>
      </Tooltip>
    </td>
  );
}
