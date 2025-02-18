import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface TagItemProps {
  tag: {
    id: number;
    name: string;
    postsCount: number;
  };
  index: number;
  folderId: number;
}

const TagItem = ({ tag, folderId }: TagItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${folderId}-${tag?.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors duration-300 group cursor-move"
    >
      <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">
        {tag?.name}
      </span>
      <span className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-full group-hover:bg-blue-100">
        {tag?.postsCount}
      </span>
    </div>
  );
};

export default memo(TagItem);
