"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

export type TooltipPropsT = {
  text: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Tooltip({ text, children }: TooltipPropsT) {
  if (!text) return children;

  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="top"
            align="start"
            sideOffset={4}
            className="z-50 max-w-xs rounded-md bg-zinc-900 px-3 py-2 text-xs text-white shadow ring-1 ring-[var(--color-card-border)]"
          >
            {text}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
