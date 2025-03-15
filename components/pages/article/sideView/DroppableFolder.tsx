import { useDroppable } from '@dnd-kit/core';
import { memo, useEffect, useState, useRef, useMemo } from 'react';
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
  const folderId = useMemo(() => String(folder.id), [folder.id]);
  const [delayedIsOver, setDelayedIsOver] = useState(false);
  const [isDraggableActive, setIsDraggableActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropIndicatorRef = useRef<HTMLDivElement>(null);

  const { setNodeRef, isOver, active } = useDroppable({
    id: folderId,
    data: {
      folder,
      accepts: 'tag',
    },
  });

  useEffect(() => {
    setIsDraggableActive(!!active);
  }, [active]);

  useEffect(() => {
    if (isOver && draggedTagName) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        requestAnimationFrame(() => {
          setDelayedIsOver(true);

          if (dropIndicatorRef.current) {
            dropIndicatorRef.current.style.opacity = '1';
            dropIndicatorRef.current.style.transform = 'translateY(0)';
          }
        });
      }, 200);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setDelayedIsOver(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOver, draggedTagName]);

  const containerClassName = useMemo(() => {
    return `mb-2 transition-all duration-300 ${isOver ? 'bg-blue-50' : ''} ${
      delayedIsOver ? 'ring-2 ring-ftBlue ring-opacity-50 rounded-lg' : ''
    } ${isDraggableActive ? 'cursor-grabbing' : 'cursor-grab'}`;
  }, [isOver, delayedIsOver, isDraggableActive]);

  const indicatorClassName = useMemo(() => {
    return `text-sm text-ftBlue text-center py-2 transition-all duration-300 ${
      delayedIsOver ? 'opacity-100' : 'opacity-0'
    }`;
  }, [delayedIsOver]);

  const indicatorStyle = useMemo(() => {
    return {
      transform: delayedIsOver ? 'translateY(0)' : 'translateY(-10px)',
      transition: 'all 0.2s ease',
    };
  }, [delayedIsOver]);

  return (
    <div
      ref={setNodeRef}
      className={containerClassName}
      onMouseEnter={() => {
        document.body.style.cursor = isDraggableActive ? 'grabbing' : 'grab';
      }}
      onMouseLeave={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {children}

      {isOver && draggedTagName && (
        <div
          ref={dropIndicatorRef}
          className={indicatorClassName}
          style={indicatorStyle}
        >
          <span className="font-medium">{draggedTagName}</span> 태그를 여기로
          이동
        </div>
      )}
    </div>
  );
};

export default memo(DroppableFolder, (prevProps, nextProps) => {
  return (
    prevProps.folder.id === nextProps.folder.id &&
    prevProps.draggedTagName === nextProps.draggedTagName
  );
});
