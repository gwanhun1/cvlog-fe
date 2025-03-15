import { Tag } from 'service/api/tag/type';
import { CSSProperties } from 'react';

interface DragOverlayItemProps {
  tag: Tag;
}

const DragOverlayItem = ({ tag }: DragOverlayItemProps) => {
  const style: CSSProperties = {
    transform: 'scale(1.05)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    opacity: 0.9,
    cursor: 'grabbing',
    zIndex: 999,
    pointerEvents: 'none',
    transition: 'transform 0.2s ease',
  };

  return (
    <div
      style={style}
      className="bg-white rounded-lg border border-blue-300 p-2 animate-pulse"
    >
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-blue-400" />
        <span className="text-sm font-medium text-gray-800">{tag.name}</span>
      </div>
    </div>
  );
};

export default DragOverlayItem;
