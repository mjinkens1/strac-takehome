import { useMemo } from 'react';

import { DriveFile } from '../../types';
import { MemoizedFileRow } from './components/FileRow';
import { LoadMoreRow } from './components/LoadMoreRow';
import { TableHeader } from './components/TableHeader';

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
  const sortedFiles = useMemo(
    () =>
      [...files].sort(
        (a, b) => new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime(),
      ),
    [files],
  );

  return (
    <div className="flex h-full flex-col justify-between rounded border border-[var(--color-card-border)]">
      <div className="relative min-h-0 overflow-y-auto rounded bg-[var(--color-card-bg)] shadow-xl backdrop-blur-md">
        <table className="h-full min-w-full table-auto text-sm">
          <TableHeader />
          <tbody className="relative">
            {sortedFiles.map((file) => (
              <MemoizedFileRow key={file.id} file={file} onDelete={onDelete} />
            ))}

            {nextPageToken && (
              <LoadMoreRow
                nextPageToken={nextPageToken}
                loadingMore={loadingMore}
                onLoadMore={onLoadMore}
              />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
