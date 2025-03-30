import { DriveFile } from "@/app/(dashboard)/types";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

type PartialDriveFile = Omit<DriveFile, "id" | "modifiedTime" | "mimeType">;

interface UploadFileProps {
  file: PartialDriveFile;
  isCompleted: boolean;
  isUploading: boolean;
  onRemoveFile: (file: PartialDriveFile) => void;
}

export function UploadFile({
  file,
  isCompleted,
  isUploading,
  onRemoveFile,
}: UploadFileProps) {
  return (
    <div className="flex items-center justify-between rounded border border-[var(--color-card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm">
      <div className="truncate w-full pr-2">{file.name}</div>
      {isCompleted ? (
        <CheckIcon data-testid="check-icon" className="size-4 text-green-500" />
      ) : isUploading ? (
        <div
          role="status"
          className="size-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
        />
      ) : (
        <button
          type="button"
          className="text-red-500 hover:text-red-700"
          onClick={() => onRemoveFile(file)}
        >
          <XMarkIcon className="size-4" />
        </button>
      )}
    </div>
  );
}
