export function TableSkeleton() {
  return (
    <table className="min-w-full text-sm">
      <tbody>
        {Array.from({ length: 14 }).map((_, i) => (
          <tr key={i} className="border-t border-[var(--color-card-border)]">
            <td className="px-6 py-4 w-1/3">
              <div className="h-4 w-full rounded skeleton" />
            </td>
            <td className="px-6 py-4 w-1/4">
              <div className="h-4 w-full rounded skeleton" />
            </td>
            <td className="px-6 py-4 w-1/4">
              <div className="h-4 w-full rounded skeleton" />
            </td>
            <td className="px-6 py-4 text-right space-x-2 w-1/6">
              <div className="inline-block h-4 w-5 rounded skeleton" />
              <div className="inline-block h-4 w-5 rounded skeleton" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
