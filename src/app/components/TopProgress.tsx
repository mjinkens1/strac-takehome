'use client';

import clsx from 'clsx';

export function TopProgressBar({ loading, className }: { loading: boolean; className?: string }) {
  return (
    <div className={clsx('relative h-1', className)} data-testid="progress-container">
      <div
        role="progressbar"
        className={clsx(
          'animate-progress absolute top-0 left-0 h-1 w-full bg-[linear-gradient(90deg,_#ff3868,_#714dff)] transition-opacity duration-300',
          loading ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  );
}
