import { useStore } from 'service/store/useStore';
import { TagType } from 'service/api/detail/type';

const TagHighlight = () => {
  const tagList = useStore(state => state.tagListAtom);
  const selectTagList = useStore(state => state.selectedTagListAtom);
  const setSelectTagList = useStore(state => state.setSelectedTagListAtom);

  const handleTagSelect = (tag: TagType) => {
    const exists = selectTagList.some(item => item.id === tag.id);
    setSelectTagList(
      exists ? selectTagList.filter(item => item.id !== tag.id) : [...selectTagList, tag],
    );
  };

  return (
    <div className="flex flex-wrap gap-1 my-4">
      {tagList.map(tag => (
        <button
          key={tag.id}
          type="button"
          onClick={() => handleTagSelect(tag)}
          className={`px-3 py-1 text-sm rounded-full border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
            selectTagList.some(item => item.id === tag.id)
              ? 'bg-blue-500 text-white border-blue-600'
              : 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200 hover:border-blue-400'
          }`}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
};

export default TagHighlight;
