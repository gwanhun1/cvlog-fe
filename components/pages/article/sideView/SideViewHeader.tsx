import React from 'react';

export interface SideViewHeaderProps {
  hasContent: boolean;
  onAddClick: () => void;
  onDeleteClick: () => void;
}

const SideViewHeader = ({
  hasContent,
  onAddClick,
  onDeleteClick,
}: SideViewHeaderProps) => (
  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        태그 관리
      </h2>

      {hasContent && (
        <div className="flex ">
          <button
            onClick={onAddClick}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
            title="태그 추가"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
          <button
            onClick={onDeleteClick}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
            title="태그 삭제"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  </div>
);

export default SideViewHeader;
