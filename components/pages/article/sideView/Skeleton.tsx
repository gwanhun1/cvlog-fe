const SideViewSkeleton = () => {
  return (
    <div className="space-y-6 p-2 sticky top-24 w-full max-w-[200px] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {[1].map(i => (
        <div key={i} className="animate-pulse">
          <div className="h-12  bg-gradient-to-r from-gray-200 to-gray-50 rounded-xl mb-3"></div>
          <div className="space-y-3 pl-4">
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-[90%]"></div>
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-[85%]"></div>
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-[85%]"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default SideViewSkeleton;
