import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { Tag } from 'service/api/tag/type';
import { useRecoilState } from 'recoil';
import { tagAtom } from 'service/atoms/atoms';

export interface TagItemProps {
  tag: Tag;
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
    id: `${folderId === 0 ? 'unassigned' : folderId}-${tag.id}`,
  });

  const [keyword, setKeyword] = useRecoilState(tagAtom);

  const handleTagClick = (tag: string) => {
    setKeyword(tag);
  };

  return (
    <div
      onClick={() => handleTagClick(tag.name)}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`flex items-center space-x-2 mx-1 p-2 mb-1 rounded-lg border border-gray-100 cursor-move 
        hover:border-gray-200 hover:bg-blue-100 active:bg-blue-500 active:text-white transition-colors duration-200
        ${
          keyword === tag.name.toLocaleLowerCase() ? 'bg-blue-400' : 'bg-white'
        } ${isDragging ? 'opacity-50' : 'opacity-100'} 
        ${transition ? 'transition' : ''} ${
        transform ? 'translate-x-0 translate-y-0' : ''
      }`}
    >
      <div className="w-2 h-2 rounded-full bg-gray-300" />
      <span className="text-sm text-gray-700">{tag.name}</span>
    </div>
  );
};

export default memo(TagItem);
