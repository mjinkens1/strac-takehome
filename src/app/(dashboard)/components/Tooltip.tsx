export const Tooltip = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => (
  <div className="group relative inline-block">
    {children}
    <div className="absolute bottom-full left-1/2 z-[999] -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap rounded bg-[var(--foreground)] px-2 py-1 text-xs text-[var(--background)] shadow-md">
      {(() => {
        const [action, ...rest] = label.split(" ");
        return (
          <>
            <span className="font-normal">{action} </span>
            <strong>{rest.join(" ")}</strong>
          </>
        );
      })()}
    </div>
  </div>
);
