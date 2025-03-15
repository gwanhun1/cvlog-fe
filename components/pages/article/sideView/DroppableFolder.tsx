import { useDroppable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { Folder } from 'service/api/tag/type';

interface DroppableFolderProps {
  folder: Folder;
  children: React.ReactNode;
  draggedTagName: string;
}

const DroppableFolder = ({
  folder,
  children,
  draggedTagName,
}: DroppableFolderProps) => {
  const folderId = String(folder.id);
  const { setNodeRef, isOver } = useDroppable({ id: folderId });

  const [delayedIsOver, setDelayedIsOver] = useState(false);
  let timeoutId: NodeJS.Timeout | null = null;

  useEffect(() => {
    if (isOver) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timeoutId = setTimeout(() => setDelayedIsOver(true), 500); // 1초 후 적용
    } else {
      setDelayedIsOver(false);
      if (timeoutId) clearTimeout(timeoutId);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOver]);

  return (
    <div
      ref={setNodeRef}
      className={`mb-2 transition-all duration-200 ${
        delayedIsOver ? 'ring-2 ring-ftBlue ring-opacity-50 rounded-lg' : ''
      }`}
    >
      {children}
      {delayedIsOver && draggedTagName && (
        <div className="text-sm text-ftBlue text-center py-2">
          <span className="font-medium">{draggedTagName}</span> 태그를 여기로
          이동
        </div>
      )}
    </div>
  );
};

export default DroppableFolder;
