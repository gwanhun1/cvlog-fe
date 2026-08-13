import { IoAddOutline, IoRemoveOutline } from 'react-icons/io5';

export interface SideViewHeaderProps {
  hasContent?: boolean;
  onAddClick: () => void;
  onDeleteClick: () => void;
}

const SideViewHeader = ({
  hasContent,
  onAddClick,
  onDeleteClick,
}: SideViewHeaderProps) => (
  <div className="flex items-center justify-between gap-2 border-b border-slate-200 py-2.5">
    <div className="min-w-0">
      <h2 className="m-0 text-[13px] font-bold text-slate-900">태그 폴더</h2>
      <p className="mb-0 mt-0.5 whitespace-nowrap text-[10px] leading-4 text-slate-400">
        끌어서 폴더로 이동
      </p>
    </div>

    {hasContent && (
      <div className="flex shrink-0 items-center">
        <button
          type="button"
          onClick={onAddClick}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-ftBlue/8 hover:text-ftBlue focus-visible:ring-2 focus-visible:ring-ftBlue"
          title="태그 폴더 추가"
          aria-label="태그 폴더 추가"
        >
          <IoAddOutline aria-hidden className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onDeleteClick}
          className="flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-500"
          title="태그 폴더 삭제"
          aria-label="태그 폴더 삭제"
        >
          <IoRemoveOutline aria-hidden className="h-4 w-4" />
        </button>
      </div>
    )}
  </div>
);

export default SideViewHeader;
