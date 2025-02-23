import { Badge } from 'flowbite-react';
import { TagItem } from '.';

const TagList = ({ tags }: { tags: TagItem[] }) => {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <Badge
          key={tag.id}
          className="relative flex items-center px-3 mx-2 mt-1 rounded-full border-2 border-blue-300 bg-blue-200 text-blue-800 hover:bg-blue-200 hover:border-blue-400 transition-all duration-300"
          color="default"
          size="sm"
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  );
};

export default TagList;
