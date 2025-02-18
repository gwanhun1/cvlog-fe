import React, { memo } from 'react';
import { Folder } from 'service/api/tag/type';

export interface FolderItemProps {
  folder: Folder;
  isOpened: boolean;
  onClickAccordion: (id: number) => (e: React.MouseEvent<HTMLDivElement>) => void;
}

const FolderItem = ({ folder, isOpened, onClickAccordion }: FolderItemProps) => (
  <div
    className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-300"
    onClick={onClickAccordion(folder.id)}
  >
    <span className="font-semibold text-gray-900">{folder.name}</span>
    <svg
      className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${
        !isOpened ? '' : 'rotate-180'
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
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

export default memo(FolderItem, (prev, next) => {
  return (
    prev.folder.id === next.folder.id &&
    prev.isOpened === next.isOpened &&
    prev.folder.name === next.folder.name
  );
});
