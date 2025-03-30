import { useState, useCallback, memo } from "react";
import { DriveFile } from "../../../types";
import { Tooltip } from "../../../../components/Tooltip";
import { FileActions } from "./FileActions";
import { mimeTypeMap } from "../mime-type-map";

interface FileRowProps {
  file: DriveFile;
  onDelete: (id: string) => void;
}

export const FileRow = ({ file, onDelete }: FileRowProps) => {
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
        // Handle progress updates
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
      <FileActions
        fileId={file.id}
        fileName={file.name}
        onDelete={onDelete}
        onDownload={handleDownload}
        downloading={downloading}
        downloaded={downloaded}
        progress={progress}
      />
    </tr>
  );
};

export const MemoizedFileRow = memo(FileRow);
MemoizedFileRow.displayName = "FileRow";
