import { ArrowDownTrayIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "../../../../components/Tooltip";

interface DownloadIconProps {
  downloaded: boolean;
  downloading: boolean;
  progress: number;
}

export function DownloadIcon({
  downloaded,
  downloading,
  progress,
}: DownloadIconProps) {
  if (downloaded) {
    return (
      <CheckIcon data-testid="check-icon" className="size-5 text-green-500" />
    );
  }

  const strokeDasharray = 2 * Math.PI * 16;
  const strokeDashoffset = 2 * Math.PI * 16 * (1 - progress / 100);

  if (downloading) {
    return (
      <div className="relative size-5">
        <svg
          viewBox="0 0 36 36"
          className="absolute top-0 left-0 size-full"
          data-testid="progress-circle"
        >
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-gray-300 dark:stroke-zinc-700"
            strokeWidth="4"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-blue-600 transition-all duration-400"
            strokeWidth="4"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <Tooltip text="Download">
      <ArrowDownTrayIcon data-testid="download-icon" className="size-5" />
    </Tooltip>
  );
}
