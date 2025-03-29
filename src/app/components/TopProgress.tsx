"use client";

import clsx from "clsx";

export function TopProgressBar({
  loading,
  className,
}: {
  loading: boolean;
  className?: string;
}) {
  return (
    <div className={clsx("relative h-1", className)}>
      <div
        className={clsx(
          "absolute left-0 top-0 h-1 w-full transition-opacity duration-300 bg-[linear-gradient(90deg,_#ff3868,_#714dff)] animate-progress",
          loading ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
