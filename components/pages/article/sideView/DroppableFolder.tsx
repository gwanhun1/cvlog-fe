import { useDroppable } from '@dnd-kit/core';
import { useMemo } from 'react';
import { Folder } from 'service/api/tag/type';

interface DroppableFolderProps {
  folder: Folder;
  children: React.ReactNode;
  draggedTagName: string;
  includeHeader?: boolean;
}

const DroppableFolder = ({
  folder,
  children,
  draggedTagName,
  includeHeader = false,
}: DroppableFolderProps) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id: folder.id,
    data: {
      folder,
      type: 'folder',
    },
  });

  const isDragging = !!active;

  const containerClassName = useMemo(() => {
    const base = 'w-full h-full transition-colors duration-150';
    const header = includeHeader ? 'overflow-hidden' : 'mb-2';
    const hover =
      isOver && draggedTagName
        ? 'bg-blue-50 shadow-[inset_0_0_0_1px_rgba(38,87,166,0.35)]'
        : 'shadow-none';
    const cursor = isDragging ? 'cursor-grabbing' : '';

    return `${base} ${header} ${hover} ${cursor}`;
  }, [isOver, draggedTagName, isDragging, includeHeader]);

  return (
    // touch-action:none은 드래그 대상(TagItem)에만 건다. 폴더 컨테이너에까지 걸면
    // 태그 목록 위에서 손가락 스크롤이 막혀 모바일 드로어를 스크롤할 수 없다.
    <div
      ref={setNodeRef}
      className={containerClassName}
      style={{ minHeight: '40px' }}
    >
      {children}

    </div>
  );
};

export default DroppableFolder;
