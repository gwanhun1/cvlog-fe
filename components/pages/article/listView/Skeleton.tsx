const CardSkeleton = () => (
  <div className="w-full p-6 bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse">
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>

      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

      <div className="flex gap-2 pt-2">
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-14 bg-gray-200 rounded-full"></div>
      </div>

      <div className="flex justify-end">
        <div className="h-5 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

export default CardSkeleton;
