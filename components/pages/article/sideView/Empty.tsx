interface SideViewEmptyProps {
  queryGetTagsFolders: any;
}

const SideViewEmpty = ({ queryGetTagsFolders }: SideViewEmptyProps) => {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-2">
        데이터를 불러올 수 없습니다
      </h3>
      <p className="text-gray-500 mb-6 text-sm">잠시 후 다시 시도해주세요</p>
      <button
        onClick={() => queryGetTagsFolders.refetch()}
        className="inline-flex items-center px-4 py-2 bg-white border border-red-200 rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-300"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        다시 시도
      </button>
    </div>
  );
};
export default SideViewEmpty;
