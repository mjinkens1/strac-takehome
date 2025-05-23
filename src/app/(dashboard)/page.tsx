'use client';

import { BeakerIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useToast } from '../components/Toast';
import { TopProgressBar } from '../components/TopProgress';
import { FileTable } from './components/FileTable/FileTable';
import { NavBar } from './components/Navbar/Navbar';
import { TableSkeleton } from './components/TableSkeleton';
import { UploadModal } from './components/UploadModal/UploadModal';
import type { DriveFile } from './types';

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string>();
  const addToast = useToast();

  const hasFetched = useRef(false);

  const fetchFiles = async (pageToken?: string, showLoading = true) => {
    setLoading(showLoading);
    try {
      const res = await fetch(`/api/drive/list?pageToken=${pageToken || ''}`);
      const data = await res.json();

      if (res.ok) {
        setFiles((prevFiles) => [...prevFiles, ...data.files]);
        setNextPageToken(data.nextPageToken);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to load files');
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

    try {
      const res = await fetch(`/api/drive/delete?id=${fileId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');

      const file = files.find((f) => f.id === fileId);
      addToast({ message: 'Deleted ' + file?.name || 'file', type: 'success' });
    } catch (error) {
      console.error('Rollback due to failed delete:', error);
      addToast({ message: 'Failed to delete file', type: 'error' });
      setFiles(prevFiles); // Rollback
    }
  };

  const handleUploadSuccess = (file: DriveFile) => {
    setFiles((prevFiles) => [file, ...prevFiles]);
    addToast({ message: 'Uploaded ' + file.name || 'file', type: 'success' });
  };

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && !hasFetched.current) {
      hasFetched.current = true;
      fetchFiles();
    }
  }, [status]);

  if (status !== 'authenticated') {
    return <TopProgressBar loading={status === 'loading'} />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <NavBar />
      <TopProgressBar loading={loading} data-testid="top-progress" />

      <main className="mx-auto h-[calc(100vh-120px)] max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Your Files</h1>
          <UploadModal onUploadSuccess={handleUploadSuccess} />
        </div>

        <div className="h-[calc(100vh-200px)]">
          {loading && <TableSkeleton />}

          {error && (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
          {!loading && files.length === 0 && (
            <div className="text-muted-foreground flex h-full items-center justify-center py-12 text-center">
              <div className="flex flex-col items-center">
                <BeakerIcon className="mx-auto mb-2 size-8 text-gray-500" />
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
