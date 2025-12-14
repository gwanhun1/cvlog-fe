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
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 이벤트 버블링 중지 - 드래그와 충돌하는 것 방지
    e.stopPropagation();
    e.preventDefault();
    // 아코디언 클릭 핸들러 호출
    onClickAccordion(folder.id)(e);
  };

  return (
    <div
      className="flex items-center justify-between p-3.5 cursor-pointer bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-300 border-b border-gray-100 select-none w-full z-30 relative"
      onClick={handleClick}
      onMouseDown={e => e.stopPropagation()}
      role="button"
      tabIndex={0}
      aria-expanded={!isOpened}
      data-folder-id={folder.id}
      data-accordion-header="true"
    >
      <span className="text-sm font-semibold text-gray-900 select-none w-full overflow-hidden text-ellipsis">
        {folder.name}
      </span>
      <svg
        className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${
          !isOpened ? '' : 'rotate-180'
        } flex-shrink-0 ml-2`}
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
};

export default memo(FolderItem, (prev, next) => {
  return (
    prev.folder.id === next.folder.id &&
    prev.isOpened === next.isOpened &&
    prev.folder.name === next.folder.name
  );
});
