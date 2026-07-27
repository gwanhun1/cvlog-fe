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
    const header = includeHeader ? 'rounded-xl overflow-hidden' : 'mb-2';
    const hover =
      isOver && draggedTagName
        ? 'bg-blue-50 shadow-[0_0_0_2px_rgba(59,130,246,0.35)]'
        : 'shadow-none';
    const cursor = isDragging ? 'cursor-grabbing' : '';

    return `${base} ${header} ${hover} ${cursor}`;
  }, [isOver, draggedTagName, isDragging, includeHeader]);

  return (
    // touch-action:none은 드래그 대상(TagItem)에만 건다. 폴더 컨테이너에까지 걸면
    // 태그 목록 위에서 손가락 스크롤이 막혀 모바일 드로어를 스크롤할 수 없다.
    <div ref={setNodeRef} className={containerClassName} style={{ minHeight: '40px' }}>
      {children}

      {isOver && draggedTagName && (
        <div className="px-2 py-2 text-sm text-center text-blue-600 bg-blue-50 border-t border-blue-200">
          <span className="font-medium">{draggedTagName}</span> 태그를 여기로
          이동
        </div>
      )}
    </div>
  );
};

export default DroppableFolder;
