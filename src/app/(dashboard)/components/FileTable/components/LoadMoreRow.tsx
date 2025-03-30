interface LoadMoreRowProps {
  nextPageToken: string;
  loadingMore: boolean;
  onLoadMore: (pageToken: string) => void;
}

export function LoadMoreRow({
  nextPageToken,
  loadingMore,
  onLoadMore,
}: LoadMoreRowProps) {
  return (
    <tr>
      <td colSpan={4} className="px-6 py-4">
        <button
          onClick={() => onLoadMore(nextPageToken)}
          className="w-full justify-center flex items-center text-blue-600 hover:text-blue-800"
        >
          {loadingMore ? (
            <div
              data-testid="loading-spinner"
              className="size-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
            />
          ) : (
            "Load More"
          )}
        </button>
      </td>
    </tr>
  );
}
