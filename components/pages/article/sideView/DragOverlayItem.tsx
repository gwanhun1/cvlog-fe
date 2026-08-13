import { Tag } from 'service/api/tag/type';
import { CSSProperties } from 'react';

interface DragOverlayItemProps {
  tag: Tag;
}

const DragOverlayItem = ({ tag }: DragOverlayItemProps) => {
  const style: CSSProperties = {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 28px rgba(38, 87, 166, 0.18)',
    opacity: 0.96,
    cursor: 'grabbing',
    zIndex: 999,
    pointerEvents: 'none',
    transition: 'transform 0.2s ease',
  };

  return (
    <div
      style={style}
      className="rounded-md border border-ftBlue/30 bg-white px-3 py-2"
    >
      <div className="flex items-center">
        <span className="text-xs font-bold text-slate-700">{tag.name}</span>
      </div>
    </div>
  );
};

export default DragOverlayItem;
