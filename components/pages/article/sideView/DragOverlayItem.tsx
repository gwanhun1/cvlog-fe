import { Tag } from 'service/api/tag/type';

interface DragOverlayItemProps {
  tag: Tag;
}

const DragOverlayItem = ({ tag }: DragOverlayItemProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-2">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-gray-300" />
        <span className="text-sm text-gray-700">{tag.name}</span>
      </div>
    </div>
  );
};

export default DragOverlayItem;
