import { useDroppable } from '@dnd-kit/core';
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
  const { setNodeRef, isOver } = useDroppable({
    id: String(folder.id),
  });

  return (
    <div
      ref={setNodeRef}
      className={`mb-2  transition-all duration-200 ${
        isOver ? 'ring-2 ring-ftBlue ring-opacity-50 rounded-lg' : ''
      }`}
    >
      {children}
      {isOver && draggedTagName && (
        <div className="text-sm text-ftBlue text-center py-2 ">
          <span className="font-medium">{draggedTagName}</span> 태그를 여기로
          이동
        </div>
      )}
    </div>
  );
};

export default DroppableFolder;
