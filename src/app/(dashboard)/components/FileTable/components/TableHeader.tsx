export function TableHeader() {
  return (
    <thead className="sticky top-0 z-10 border-b border-[var(--color-card-border)] bg-[var(--color-card-bg)] text-left text-muted-foreground font-bold">
      <tr>
        <th className="px-6 py-4 w-[40%]">Filename</th>
        <th className="px-6 py-4 w-[25%]">Type</th>
        <th className="px-6 py-4 w-[25%]">Modified</th>
        <th className="px-6 py-4 w-[10%] text-right">Actions</th>
      </tr>
    </thead>
  );
}
