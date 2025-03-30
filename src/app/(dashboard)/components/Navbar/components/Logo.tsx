import { NewspaperIcon } from "@heroicons/react/24/outline";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <NewspaperIcon className="size-4" color="var(--gradient-start)" />
      <div className="text-lg font-semibold gradient-text">Strac Takehome</div>
    </div>
  );
}
