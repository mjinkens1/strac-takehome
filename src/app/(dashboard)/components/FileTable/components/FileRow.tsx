import { memo } from "react";

import { DriveFile } from "@/app/(dashboard)/types";
import { Tooltip } from "@/app/components/Tooltip";

import { FileActions } from "./FileActions";
import { mimeTypeMap } from "../mime-type-map";

interface FileRowProps {
  file: DriveFile;
  onDelete: (id: string) => void;
}

export const FileRow = ({ file, onDelete }: FileRowProps) => {
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
      <FileActions file={file} onDelete={onDelete} />
    </tr>
  );
};

export const MemoizedFileRow = memo(FileRow);
MemoizedFileRow.displayName = "FileRow";
