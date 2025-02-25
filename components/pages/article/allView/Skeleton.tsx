const CardSkeleton = () => (
  <div>
    <div className="rounded-lg h-[320px] w-full bg-white shadow-md border border-gray-100 overflow-hidden">
      <div className="h-32 w-full bg-gray-200 animate-pulse" />

      <div className="p-4 flex flex-col h-[calc(320px-128px)]">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />

        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        </div>

        <div className="mt-auto">
          <div className="flex gap-1.5 mb-2">
            <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

export default CardSkeleton;
