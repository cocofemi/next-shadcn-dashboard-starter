export function EmptyAnalyticsScreen() {
  return (
    <div className="flex h-64 flex-col items-center justify-center text-center text-gray-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mb-2 h-10 w-10 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h11M9 21V3m12 9a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-sm font-medium">No data available yet</p>
      <p className="text-xs text-gray-400">
        Once you start receiving orders or fulfillments, your analytics will
        appear here.
      </p>
    </div>
  );
}
