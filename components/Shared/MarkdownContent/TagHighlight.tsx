import { Badge } from 'flowbite-react';
import { useStore } from 'service/store/useStore';
import { TagType } from 'service/api/detail/type';

const TagHighlight = () => {
  const tagList = useStore((state) => state.tagListAtom);
  const selectTagList = useStore((state) => state.selectedTagListAtom);
  const setSelectTagList = useStore((state) => state.setSelectedTagListAtom);

  // 태그 선택 처리 함수
  const handleTagSelect = (tag: TagType) => {
    const exists = selectTagList.some(item => item.id === tag.id);
    const newList = exists
      ? selectTagList.filter(item => item.id !== tag.id)
      : [...selectTagList, tag];
    setSelectTagList(newList);
  };

  return (
    <>
      <div className="flex flex-wrap gap-1 my-4">
        {tagList.map(tag => (
          <Badge
            className={`duration-300 hover:scale-105 hover:cursor-pointer relative flex items-center px-3 py-1 rounded-full border-2 ${
              selectTagList.some(item => item.id === tag.id)
                ? 'bg-blue-500 text-white border-blue-600'
                : 'bg-blue-100 text-blue-800 border-blue-300'
            } hover:bg-blue-200 hover:border-blue-400 transition-all`}
            color="default"
            size="sm"
            key={tag.id}
            onClick={() => handleTagSelect(tag)}
          >
            {tag.name}
          </Badge>
        ))}
      </div>
    </>
  );
};

export default TagHighlight;
