const ListEmpty = () => {
    return (
        <div className="flex flex-col gap-6 w-full justify-center items-center h-20 tablet:h-[23.5rem] bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-lg p-8">
            <div className="relative">
              <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center">
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
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
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
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gray-700">
                새로운 이야기를 시작해보세요
              </h3>
              <p className="text-sm text-gray-500">
                당신만의 특별한 순간을 기록해보세요
              </p>
            </div>
          </div>
    );
};

export default ListEmpty;