"use client";

import { createContext, useContext, useState } from "react";
import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface Toast {
  id: number;
  message: string;
  type?: "success" | "error";
}

const ToastContext = createContext<{
  addToast: ({
    message,
    type,
  }: {
    message: string;
    type?: "success" | "error";
  }) => void;
} | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastManager>");
  return ctx.addToast;
};

export function ToastManager({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = ({
    message,
    type = "success",
  }: {
    message: string;
    type?: "success" | "error";
  }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-150 space-y-2">
        {toasts.map((toast) => {
          const Icon =
            toast.type === "error" ? ExclamationCircleIcon : CheckIcon;
          const bg =
            toast.type === "error"
              ? "bg-gradient-to-r from-red-500 to-rose-600"
              : "bg-gradient-to-r from-green-500 to-emerald-600";

          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 rounded-lg shadow-lg px-5 py-3 text-white ${bg} animate-fadeInUp`}
            >
              <Icon className="size-5 shrink-0" />
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
