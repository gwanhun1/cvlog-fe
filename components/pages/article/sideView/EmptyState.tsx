import { memo } from 'react';
import { IoAddOutline } from 'react-icons/io5';

interface EmptyStateProps {
  onAddClick: () => void;
}

const EmptyState = ({ onAddClick }: EmptyStateProps) => (
  <div className="border-b border-slate-200 px-2 py-8 text-center">
    <h3 className="m-0 text-sm font-bold text-slate-800">
      태그 폴더가 없습니다
    </h3>
    <p className="mb-0 mt-1 text-xs leading-relaxed text-slate-500">
      폴더를 만들어 태그를 정리해보세요.
    </p>
    <button
      type="button"
      onClick={onAddClick}
      className="mt-4 inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 transition-colors hover:border-ftBlue hover:text-ftBlue focus-visible:ring-2 focus-visible:ring-ftBlue"
    >
      <IoAddOutline aria-hidden className="h-4 w-4" />
      폴더 추가
    </button>
  </div>
);

export default memo(EmptyState);
