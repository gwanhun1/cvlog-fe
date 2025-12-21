const ListEmpty = () => {
  return (
    <div className="flex flex-col gap-6 w-full justify-center items-center h-80 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="relative">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            ></path>
          </svg>
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-center text-center">
        <h3 className="text-xl font-semibold text-gray-700">
          아직 작성된 글이 없어요
        </h3>
        <p className="text-sm text-gray-500">
          첫 번째 이야기의 주인공이 되어보세요
        </p>
      </div>
    </div>
  );
};

export default ListEmpty;
