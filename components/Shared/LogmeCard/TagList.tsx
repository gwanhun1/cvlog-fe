import { TagItem } from '.';

const TagList = ({ tags }: { tags: TagItem[] }) => {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map(tag => (
        <span
          key={tag.id}
          className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100 shadow-[0_4px_12px_-8px_rgba(37,99,235,0.6)]"
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
};

export default TagList;
