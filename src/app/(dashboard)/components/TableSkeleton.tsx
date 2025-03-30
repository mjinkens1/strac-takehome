export function TableSkeleton() {
  return (
    <table className="min-w-full text-sm">
      <tbody>
        {Array.from({ length: 14 }).map((_, i) => (
          <tr key={i} className="border-t border-[var(--color-card-border)]">
            <td className="w-1/3 px-6 py-4">
              <div className="skeleton h-4 w-full rounded" />
            </td>
            <td className="w-1/4 px-6 py-4">
              <div className="skeleton h-4 w-full rounded" />
            </td>
            <td className="w-1/4 px-6 py-4">
              <div className="skeleton h-4 w-full rounded" />
            </td>
            <td className="w-1/6 space-x-2 px-6 py-4 text-right">
              <div className="skeleton inline-block h-4 w-5 rounded" />
              <div className="skeleton inline-block h-4 w-5 rounded" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
