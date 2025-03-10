import { Badge } from 'flowbite-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { selectedTagListAtom, tagListAtom } from 'service/atoms/atoms';
import { TagType } from 'service/api/detail/type';

const TagHighlight = () => {
  const tagList = useRecoilValue(tagListAtom);
  const [selectTagList, setSelectTagList] = useRecoilState(selectedTagListAtom);

  // 태그 선택 처리 함수
  const handleTagSelect = (tag: TagType) => {
    if (selectTagList.includes(tag)) {
      setSelectTagList(selectTagList.filter(item => item !== tag));
    } else {
      setSelectTagList([...selectTagList, tag]);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-1 my-4">
        {tagList.map(tag => (
          <Badge
            className={`duration-300 hover:scale-105 hover:cursor-pointer relative flex items-center px-3 py-1 rounded-full border-2 ${
              selectTagList.includes(tag)
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
