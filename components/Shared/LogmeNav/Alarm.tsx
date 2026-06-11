import React from 'react';
import { AiFillHeart } from 'react-icons/ai';

export interface AlarmItem {
  id: number;
  actorName: string;
  postTitle: string;
  createdAt: string;
}

interface LikeActivityRowProps {
  item: AlarmItem;
  onClick?: (item: AlarmItem) => void;
}

export const LikeActivityRow = ({ item, onClick }: LikeActivityRowProps) => {
  return (
    <button
      type="button"
      onClick={() => onClick?.(item)}
      className="w-full text-left px-4 py-3 hover:bg-slate-50/80 transition-colors flex items-start gap-3"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 bg-red-50 text-red-400">
        <AiFillHeart className="text-sm" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-ftBlack leading-snug line-clamp-2 mb-1">
          <span className="font-semibold">{item.actorName}</span>
          님이{' '}
          <span className="font-semibold">{item.postTitle}</span>
          을 좋아합니다.
        </p>
        <p className="text-[11px] text-gray-400">{item.createdAt}</p>
      </div>
    </button>
  );
};

const Alarm = () => {
  return null;
};

export default Alarm;
