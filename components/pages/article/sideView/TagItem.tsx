import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useCallback, CSSProperties } from 'react';
import { useRecoilState } from 'recoil';
import { tagAtom } from 'service/atoms/atoms';
import { Tag } from 'service/api/tag/type';

export interface TagItemProps {
  tag: Tag;
  folderId: number;
  isMoving?: boolean;
  disabled?: boolean;
}

const TagItem = ({
  tag,
  folderId,
  isMoving = false,
  disabled = false,
}: TagItemProps) => {
  const itemId = useMemo(() => {
    return `${folderId === 999 ? 'unassigned' : folderId}-${tag.id}`;
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
    disabled: disabled || isMoving,
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

  // 이동 중인 태그는 스켈레톤으로 표시
  if (isMoving) {
    return (
      <div className="flex items-center justify-between w-full py-2.5 px-3 mb-2 rounded-lg border border-blue-200 bg-blue-50 animate-pulse">
        <div className="flex items-center space-x-3 w-full">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-300 flex-shrink-0 animate-pulse" />
          <div className="w-3/4 h-4 bg-blue-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const isSelected = keyword === tag.name.toLocaleLowerCase();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        flex items-center justify-between w-full py-2.5 px-3 mb-2 rounded-lg 
        border border-gray-100 cursor-move select-none
        hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm 
        active:bg-blue-500 active:text-white 
        transition-all duration-200 ease-in-out
        ${isSelected ? 'bg-blue-400 text-white shadow-md' : 'bg-white'}
      `}
      onClick={handleTagClick}
      role="option"
      tabIndex={0}
      aria-selected={isSelected}
    >
      <div className="flex items-center space-x-3 w-full">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            isSelected ? 'bg-white' : 'bg-blue-300'
          } flex-shrink-0`}
        />
        <span className="max-w-full text-sm font-medium truncate">
          {tag.name}
        </span>
      </div>
    </div>
  );
};

export default TagItem;
