import { JSX, useState } from "react";
import { DriveFile } from "../types";
import { Tooltip } from "./Tooltip";
import {
  ArrowDownTrayIcon,
  DocumentIcon,
  DocumentTextIcon,
  FolderIcon,
  PresentationChartBarIcon,
  TableCellsIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface FileTableProps {
  files: DriveFile[];
  onDelete: (fileId: string) => void;
}

const mimeTypeMap: Record<string, { label: string; icon: JSX.Element }> = {
  "application/pdf": {
    label: "PDF Document",
    icon: (
      <DocumentTextIcon className="size-4 inline-block mr-1 text-red-500" />
    ),
  },
  "application/msword": {
    label: "Word Document",
    icon: <DocumentIcon className="size-4 inline-block mr-1 text-blue-600" />,
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    label: "Word Document",
    icon: <DocumentIcon className="size-4 inline-block mr-1 text-blue-600" />,
  },
  "application/vnd.ms-excel": {
    label: "Excel Spreadsheet",
    icon: (
      <TableCellsIcon className="size-4 inline-block mr-1 text-green-600" />
    ),
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    label: "Excel Spreadsheet",
    icon: (
      <TableCellsIcon className="size-4 inline-block mr-1 text-green-600" />
    ),
  },
  "application/vnd.ms-powerpoint": {
    label: "PowerPoint Presentation",
    icon: (
      <PresentationChartBarIcon className="size-4 inline-block mr-1 text-orange-500" />
    ),
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    label: "PowerPoint Presentation",
    icon: (
      <PresentationChartBarIcon className="size-4 inline-block mr-1 text-orange-500" />
    ),
  },
  "application/vnd.google-apps.document": {
    label: "Google Docs",
    icon: (
      <DocumentTextIcon className="size-4 inline-block mr-1 text-sky-500" />
    ),
  },
  "application/vnd.google-apps.spreadsheet": {
    label: "Google Sheets",
    icon: <TableCellsIcon className="size-4 inline-block mr-1 text-lime-600" />,
  },
  "application/vnd.google-apps.presentation": {
    label: "Google Slides",
    icon: (
      <PresentationChartBarIcon className="size-4 inline-block mr-1 text-yellow-500" />
    ),
  },
  "application/vnd.google-apps.folder": {
    label: "Google Drive Folder",
    icon: <FolderIcon className="size-4 inline-block mr-1 text-gray-500" />,
  },
  "image/jpeg": {
    label: "JPEG Image",
    icon: <DocumentIcon className="size-4 inline-block mr-1 text-pink-400" />,
  },
  "image/png": {
    label: "PNG Image",
    icon: <DocumentIcon className="size-4 inline-block mr-1 text-cyan-400" />,
  },
  "image/gif": {
    label: "GIF Image",
    icon: <DocumentIcon className="size-4 inline-block mr-1 text-purple-500" />,
  },
  "text/plain": {
    label: "Text File",
    icon: (
      <DocumentTextIcon className="size-4 inline-block mr-1 text-gray-400" />
    ),
  },
  "application/zip": {
    label: "ZIP Archive",
    icon: <DocumentIcon className="size-4 inline-block mr-1 text-yellow-600" />,
  },
  "application/json": {
    label: "JSON File",
    icon: (
      <DocumentTextIcon className="size-4 inline-block mr-1 text-emerald-500" />
    ),
  },
  "text/csv": {
    label: "CSV File",
    icon: <TableCellsIcon className="size-4 inline-block mr-1 text-lime-600" />,
  },
};

export function FileTable({ files, onDelete }: FileTableProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadStart = (fileId: string) => {
    setDownloadingId(fileId);
  };

  const handleDownloadEnd = () => {
    setDownloadingId(null);
  };

  const handleDownload = (
    e: React.MouseEvent<HTMLAnchorElement>,
    fileId: string,
    fileName: string
  ) => {
    e.preventDefault();
    handleDownloadStart(fileId);
    fetch(
      `/api/drive/download?id=${fileId}&name=${encodeURIComponent(fileName)}`
    )
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        handleDownloadEnd();
      });
  };

  return (
    <div className="relative h-full overflow-y-auto rounded border border-[var(--color-card-border)] bg-[var(--color-card-bg)] shadow-xl backdrop-blur-md">
      <table className="min-w-full text-sm">
        <thead className="sticky top-0 z-10 border-b border-[var(--color-card-border)] bg-[var(--color-card-bg)] text-left text-muted-foreground font-bold">
          <tr>
            <th className="px-6 py-4 font-bold">Filename</th>
            <th className="px-6 py-4 font-bold">Type</th>
            <th className="px-6 py-4 font-bold">Modified</th>
            <th className="px-6 py-4 text-right font-bold">Actions</th>
          </tr>
        </thead>
        <tbody className="relative">
          {files.map((file) => (
            <tr
              key={file.id}
              className="border-t border-[var(--color-card-border)] hover:bg-[var(--muted)]"
            >
              <td className="px-6 py-4 truncate font-medium text-[var(--foreground)]">
                {file.name}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {mimeTypeMap[file.mimeType]?.icon}
                  {mimeTypeMap[file.mimeType]?.label || file.mimeType}
                </div>
              </td>
              <td className="px-6 py-4">
                {new Date(file.modifiedTime).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-right space-x-4 whitespace-nowrap">
                <Tooltip label="Download">
                  <a
                    href={`/api/drive/download?id=${
                      file.id
                    }&name=${encodeURIComponent(file.name)}`}
                    download={file.name}
                    className={`text-blue-600 hover:text-blue-800 inline-block ${
                      downloadingId === file.id
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                    onClick={(e) => handleDownload(e, file.id, file.name)}
                  >
                    {downloadingId === file.id ? (
                      <div className="size-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowDownTrayIcon className="size-5" />
                    )}
                  </a>
                </Tooltip>
                <Tooltip label="Delete">
                  <button
                    onClick={() => onDelete(file.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="size-5" />
                  </button>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
