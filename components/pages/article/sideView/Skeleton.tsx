const SideViewSkeleton = () => (
  <div className="animate-pulse space-y-3 p-1">
    {[1, 2, 3].map(i => (
      <div key={i} className="space-y-1.5">
        <div className="h-7 bg-gray-100 rounded-lg" />
        <div className="h-5 bg-gray-50 rounded ml-2" />
        <div className="h-5 bg-gray-50 rounded ml-2" />
      </div>
    ))}
  </div>
);

export default SideViewSkeleton;
