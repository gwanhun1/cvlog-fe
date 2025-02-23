const SkeletonCard = () => {
  return (
    <div className="w-full p-6 bg-white/5 rounded-lg shadow-md animate-pulse">
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="h-40 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};
export default SkeletonCard;
