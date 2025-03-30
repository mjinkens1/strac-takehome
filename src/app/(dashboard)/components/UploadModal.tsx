"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { UploadForm } from "./UploadForm";
import { TopProgressBar } from "@/app/components/TopProgress";
import { DriveFile } from "../types";
interface UploadModalProps {
  onUploadSuccess: (newFile: DriveFile) => void;
}

export function UploadModal({ onUploadSuccess }: UploadModalProps) {
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(0);

  const handleUploadSuccess = (newFile: DriveFile) => {
    onUploadSuccess(newFile);
  };

  const handleClose = () => {
    setOpen(false);
    setKey((prev) => prev + 1); // Reset UploadForm state by changing key
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="gradient-background inline-flex items-center gap-2 rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card-bg)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-all"
      >
        <ArrowUpTrayIcon className="size-4" /> Upload Files
      </button>

      <Transition show={open} as={Fragment}>
        <Dialog onClose={handleClose} className="relative z-50">
          <TopProgressBar loading={true} />
          <Transition
            show={open}
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition
              show={open}
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="overflow-hidden w-full max-w-xl rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-6 shadow-xl backdrop-blur-md">
                <TopProgressBar
                  className="absolute -top-6 left-0"
                  loading={uploading}
                />
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">
                    Upload Files
                  </h2>
                  <button
                    onClick={handleClose}
                    className="text-muted-foreground hover:text-[var(--foreground)]"
                  >
                    <XMarkIcon className="size-5" />
                  </button>
                </div>
                <UploadForm
                  key={key}
                  onSuccess={handleUploadSuccess}
                  onAllSuccess={handleClose}
                  allowMultiple
                  uploading={uploading}
                  onUploading={setUploading}
                />
              </div>
            </Transition>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
