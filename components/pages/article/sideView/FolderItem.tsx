import React, { memo } from 'react';
import { Folder } from 'service/api/tag/type';

export interface FolderItemProps {
  folder: Folder;
  isOpened: boolean;
  onClickAccordion: (
    id: number
  ) => (e: React.MouseEvent<HTMLDivElement>) => void;
}

const FolderItem = ({
  folder,
  isOpened,
  onClickAccordion,
}: FolderItemProps) => {
  console.log(isOpened);

  return (
    <div
      className="flex items-center justify-between p-2.5 cursor-pointer bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-300"
      onClick={onClickAccordion(folder.id)}
    >
      <span className="text-sm font-semibold text-gray-900 select-none">
        {folder.name}
      </span>
      <svg
        className={`w-4 h-4 text-gray-400 transform transition-transform duration-300 ${
          !isOpened ? '' : 'rotate-180'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        style={{ pointerEvents: 'none' }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  );
};

export default memo(FolderItem, (prev, next) => {
  return (
    prev.folder.id === next.folder.id &&
    prev.isOpened === next.isOpened &&
    prev.folder.name === next.folder.name
  );
});
