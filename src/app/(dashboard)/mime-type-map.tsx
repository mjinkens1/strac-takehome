import {
  DocumentTextIcon,
  DocumentIcon,
  TableCellsIcon,
  PresentationChartBarIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import { JSX } from "react";

export const mimeTypeMap: Record<string, { label: string; icon: JSX.Element }> =
  {
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
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      {
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
      icon: (
        <TableCellsIcon className="size-4 inline-block mr-1 text-lime-600" />
      ),
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
      icon: (
        <DocumentIcon className="size-4 inline-block mr-1 text-purple-500" />
      ),
    },
    "text/plain": {
      label: "Text File",
      icon: (
        <DocumentTextIcon className="size-4 inline-block mr-1 text-gray-400" />
      ),
    },
    "application/zip": {
      label: "ZIP Archive",
      icon: (
        <DocumentIcon className="size-4 inline-block mr-1 text-yellow-600" />
      ),
    },
    "application/json": {
      label: "JSON File",
      icon: (
        <DocumentTextIcon className="size-4 inline-block mr-1 text-emerald-500" />
      ),
    },
    "text/csv": {
      label: "CSV File",
      icon: (
        <TableCellsIcon className="size-4 inline-block mr-1 text-lime-600" />
      ),
    },
  };
