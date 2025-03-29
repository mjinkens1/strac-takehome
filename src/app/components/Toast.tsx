"use client";

import { useEffect } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export function Toast({
  message,
  type = "success",
  onClose,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    const timeout = setTimeout(onClose, duration);
    return () => clearTimeout(timeout);
  }, [duration, onClose]);

  const Icon = type === "success" ? CheckCircleIcon : ExclamationCircleIcon;
  const bg =
    type === "success"
      ? "bg-gradient-to-r from-green-500 to-emerald-600"
      : "bg-gradient-to-r from-red-500 to-rose-600";

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeInUp">
      <div
        className={`flex items-center gap-3 rounded-lg shadow-lg px-5 py-3 text-white ${bg}`}
      >
        <Icon className="size-5 shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
