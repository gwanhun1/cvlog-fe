import { IoRefreshOutline } from 'react-icons/io5';

interface SideViewEmptyProps {
  queryGetTagsFolders: any;
}

const SideViewEmpty = ({ queryGetTagsFolders }: SideViewEmptyProps) => (
  <div className="border-b border-slate-200 px-2 py-8 text-center">
    <h3 className="m-0 text-sm font-bold text-slate-800">
      태그를 불러오지 못했습니다
    </h3>
    <p className="mb-0 mt-1 text-xs text-slate-500">
      잠시 후 다시 시도해주세요.
    </p>
    <button
      type="button"
      onClick={() => queryGetTagsFolders.refetch()}
      className="mt-4 inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 transition-colors hover:border-ftBlue hover:text-ftBlue focus-visible:ring-2 focus-visible:ring-ftBlue"
    >
      <IoRefreshOutline aria-hidden className="h-4 w-4" />
      다시 시도
    </button>
  </div>
);

export default SideViewEmpty;
