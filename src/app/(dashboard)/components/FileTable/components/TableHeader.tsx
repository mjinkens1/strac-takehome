export function TableHeader() {
  return (
    <thead className="text-muted-foreground sticky top-0 z-10 border-b border-[var(--color-card-border)] bg-[var(--color-card-bg)] text-left font-bold">
      <tr>
        <th className="w-[40%] px-6 py-4">Filename</th>
        <th className="w-[25%] px-6 py-4">Type</th>
        <th className="w-[25%] px-6 py-4">Modified</th>
        <th className="w-[10%] px-6 py-4 text-right">Actions</th>
      </tr>
    </thead>
  );
}
