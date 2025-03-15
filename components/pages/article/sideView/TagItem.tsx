import { memo, useMemo, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tag } from 'service/api/tag/type';
import { useRecoilState } from 'recoil';
import { tagAtom } from 'service/atoms/atoms';

export interface TagItemProps {
  tag: Tag;
  folderId: number;
}

const TagItem = ({ tag, folderId }: TagItemProps) => {
  // Memoize the ID to prevent unnecessary re-renders
  const itemId = useMemo(() => {
    return `${folderId === 0 ? 'unassigned' : folderId}-${tag.id}`;
  }, [folderId, tag.id]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: itemId,
    data: {
      tag,
      folderId,
    },
  });

  const [keyword, setKeyword] = useRecoilState(tagAtom);

  // Memoized click handler to prevent unnecessary re-renders
  const handleTagClick = useCallback(() => {
    setKeyword(tag.name);
  }, [tag.name, setKeyword]);

  // Use CSS transform helper for better performance
  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : 'auto',
    position: isDragging ? 'relative' : 'static' as any,
    touchAction: 'none', // Prevent browser touch actions during drag
  }), [transform, transition, isDragging]);

  return (
    <div
      onClick={handleTagClick}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center space-x-2 mx-1 p-2 mb-1 rounded-lg border border-gray-100 cursor-move 
        hover:border-gray-200 hover:bg-blue-100 active:bg-blue-500 active:text-white transition-colors duration-200
        ${keyword === tag.name.toLocaleLowerCase() ? 'bg-blue-400 text-white' : 'bg-white'}`}
    >
      <div className="w-2 h-2 rounded-full bg-gray-300" />
      <span className="text-sm font-medium">{tag.name}</span>
    </div>
  );
};

// Using memo with equality check for better performance
export default memo(TagItem, (prevProps, nextProps) => {
  return prevProps.tag.id === nextProps.tag.id && 
         prevProps.tag.name === nextProps.tag.name &&
         prevProps.folderId === nextProps.folderId;
});
