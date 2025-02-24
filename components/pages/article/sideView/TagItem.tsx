import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tag } from 'service/api/tag/type';

export interface TagItemProps {
  tag: Tag;
  index: number;
  folderId: number;
}

const TagItem = ({ tag, index, folderId }: TagItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${folderId === 0 ? 'unassigned' : folderId}-${tag.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className=" flex items-center space-x-2 mx-1 p-2 mb-1 bg-white rounded-lg border border-gray-100 cursor-move hover:border-gray-200 hover:bg-blue-100 active:bg-blue-500 active:text-white transition-colors duration-200"
    >
      <div className="w-2 h-2 rounded-full bg-gray-300" />
      <span className="text-sm text-gray-700">{tag.name}</span>
    </div>
  );
};

export default memo(TagItem);
