const MypageTaskSkeleton = () => (
  <section className="bg-white rounded-xl p-8 shadow-sm border border-blue-100">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">최근 활동</h2>
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg mb-4"
        >
          <div className=" h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
          <div className="">
            <div className="h-5 w-32 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded-full animate-pulse mt-2" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default MypageTaskSkeleton;
