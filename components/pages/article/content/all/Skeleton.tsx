const ContentSkeleton = () => (
  <div className="space-y-10">
    <div className="space-y-2 ">
      <div className=" bg-gray-200 rounded w-full h-60"></div>
    </div>

    <div className="space-y-2">
      <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>

    <div className="space-y-2 ">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
);

export default ContentSkeleton;
