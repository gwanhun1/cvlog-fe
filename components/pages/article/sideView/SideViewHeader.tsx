import React from 'react';

export interface SideViewHeaderProps {
  hasContent?: boolean;
  onAddClick: () => void;
  onDeleteClick: () => void;
}

const SideViewHeader = ({
  hasContent,
  onAddClick,
  onDeleteClick,
}: SideViewHeaderProps) => (
  <div className="flex justify-between items-center p-2 border-b border-ftBlue/15 bg-white/90">
    <h2 className="mt-2 text-sm font-bold text-ftBlue">태그 관리</h2>

    {hasContent && (
      <div className="flex">
        <button
          onClick={onAddClick}
          className="p-2 rounded-xl transition-all duration-200 text-ftGray hover:text-ftBlue hover:bg-ftBlue/10"
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
          className="p-2 rounded-xl transition-all duration-200 text-ftGray hover:text-red-600 hover:bg-red-50"
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
);

export default SideViewHeader;
