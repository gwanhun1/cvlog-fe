const SideViewSkeleton = () => {
  return (
    <div className="mt-3 border  space-y-6 p-2 sticky top-24 w-full max-w-[200px] border-b rounded-lg border-gray-200 bg-gradient-to-r from-gray-50 to-white overflow-hidden">
      <h2 className=" text-sm font-bold bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent mt-2">
        태그 관리
      </h2>

      {[1].map(i => (
        <div key={i} className="animate-pulse">
          <div className="h-12  bg-gradient-to-r from-gray-200 to-gray-50 rounded-xl mb-3"></div>
          <div className="h-12  bg-gradient-to-r from-gray-200 to-gray-50 rounded-xl mb-3"></div>
          <div className="h-40  bg-gradient-to-r from-gray-200 to-gray-50 rounded-xl mb-3"></div>
        </div>
      ))}
    </div>
  );
};
export default SideViewSkeleton;
