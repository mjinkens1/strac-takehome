import { NewspaperIcon } from '@heroicons/react/24/outline';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <NewspaperIcon className="size-4" color="var(--gradient-start)" />
      <div className="gradient-text text-lg font-semibold">Strac Takehome</div>
    </div>
  );
}
