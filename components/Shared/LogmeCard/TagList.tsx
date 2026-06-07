import { TagItem } from '.';

const HighlightTag = ({ name, keyword }: { name: string; keyword: string }) => {
  if (!keyword.trim()) return <>{name}</>;

  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = name.split(new RegExp(`(${escaped})`, 'gi'));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 text-blue-900 rounded-sm not-italic">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

const TagList = ({ tags, keyword = '' }: { tags: TagItem[]; keyword?: string }) => {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map(tag => (
        <span
          key={tag.id}
          className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-medium"
        >
          <HighlightTag name={tag.name} keyword={keyword} />
        </span>
      ))}
    </div>
  );
};

export default TagList;
