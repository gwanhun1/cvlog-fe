import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useCallback, CSSProperties } from 'react';
import { IoReorderThreeOutline } from 'react-icons/io5';
import { useStore } from 'service/store/useStore';
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

  const keyword = useStore(state => state.tagAtom);
  const setKeyword = useStore(state => state.setTagAtom);

  const handleTagClick = useCallback(() => {
    setKeyword(tag.name);
  }, [tag.name, setKeyword]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleTagClick();
        return;
      }

      listeners?.onKeyDown?.(event);
    },
    [handleTagClick, listeners],
  );

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
    [transform, transition, isDragging],
  );

  // 이동 중인 태그는 스켈레톤으로 표시
  if (isMoving) {
    return (
      <div className="mb-1 flex w-full items-center justify-between rounded-md border border-blue-200 bg-blue-50 px-2 py-2 animate-pulse">
        <div className="flex w-full items-center gap-2">
          <div className="h-3 w-3/4 rounded bg-blue-200 animate-pulse" />
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
        mb-1 flex w-full cursor-grab select-none items-center justify-between rounded-md border px-2 py-2
        transition-[background-color,border-color,color,transform] duration-200 ease-out active:cursor-grabbing
        ${
          isSelected
            ? 'border-ftBlue bg-ftBlue text-white'
            : 'border-transparent bg-white text-slate-600 hover:border-ftBlue/20 hover:bg-ftBlue/5 hover:text-ftBlue'
        }
      `}
      onClick={handleTagClick}
      onKeyDown={handleKeyDown}
      role="option"
      tabIndex={0}
      aria-selected={isSelected}
      aria-label={`${tag.name} 태그. Enter로 필터링, Space로 폴더 이동`}
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <IoReorderThreeOutline
          aria-hidden
          className={`h-4 w-4 shrink-0 ${
            isSelected ? 'text-white/70' : 'text-slate-300'
          }`}
        />
        <span className="max-w-full truncate text-xs font-semibold">
          {tag.name}
        </span>
      </div>
      {Number.isFinite(tag.postsCount) && (
        <span
          className={`ml-2 shrink-0 text-[10px] ${
            isSelected ? 'text-white/70' : 'text-slate-400'
          }`}
        >
          {tag.postsCount}
        </span>
      )}
    </div>
  );
};

export default TagItem;
