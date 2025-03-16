import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { memo, useMemo, useCallback, CSSProperties } from 'react';
import { useRecoilState } from 'recoil';
import { tagAtom } from 'service/atoms/atoms';
import { Tag } from 'service/api/tag/type';

export interface TagItemProps {
  tag: Tag;
  folderId: number;
}

const TagItem = ({ tag, folderId }: TagItemProps) => {
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
      type: 'tag',
    },
  });

  const [keyword, setKeyword] = useRecoilState(tagAtom);

  const handleTagClick = useCallback(() => {
    setKeyword(tag.name);
  }, [tag.name, setKeyword]);

  // Use CSSProperties type to avoid TypeScript errors
  const style = useMemo(
    (): CSSProperties => ({
      transform: CSS.Transform.toString(transform),
      transition: transition || undefined,
      opacity: isDragging ? 0.4 : 1,
      zIndex: isDragging ? 999 : 'auto',
      position: isDragging ? 'relative' : 'static',
      touchAction: 'none',
      userSelect: 'none' as 'none',
    }),
    [transform, transition, isDragging]
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center space-x-2 mx-1 p-2 mb-1 rounded-lg border border-gray-100 cursor-move 
        hover:border-gray-200 hover:bg-blue-100 active:bg-blue-500 active:text-white transition-colors duration-200
        ${
          keyword === tag.name.toLocaleLowerCase()
            ? 'bg-blue-400 text-white'
            : 'bg-white'
        }`}
      onClick={handleTagClick}
    >
      <div className="w-2 h-2 rounded-full bg-gray-300" />
      <span className="text-sm font-medium select-none">{tag.name}</span>
    </div>
  );
};

export default memo(TagItem, (prevProps, nextProps) => {
  return (
    prevProps.tag.id === nextProps.tag.id &&
    prevProps.tag.name === nextProps.tag.name &&
    prevProps.folderId === nextProps.folderId
  );
});
