import { TrashIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "../../../../components/Tooltip";
import { DownloadIcon } from "./DownloadIcon";

interface FileActionsProps {
  fileId: string;
  fileName: string;
  onDelete: (id: string) => void;
  onDownload: (e: React.MouseEvent<HTMLAnchorElement>) => Promise<void>;
  downloading: boolean;
  downloaded: boolean;
  progress: number;
}

export function FileActions({
  fileId,
  fileName,
  onDelete,
  onDownload,
  downloading,
  downloaded,
  progress,
}: FileActionsProps) {
  return (
    <td className="w-[10%] px-6 py-4 text-right space-x-4 whitespace-nowrap">
      <a
        href={`/api/drive/download?id=${fileId}&name=${encodeURIComponent(
          fileName
        )}`}
        download={fileName}
        onClick={onDownload}
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
          onClick={() => onDelete(fileId)}
          className="text-red-500 hover:text-red-700"
        >
          <TrashIcon className="size-5" />
        </button>
      </Tooltip>
    </td>
  );
}
