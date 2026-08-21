interface Props {
  isOpen: boolean;
  draftTitle: string;
  onResume: () => void;
  onFresh: () => void;
  onClose: () => void;
}

const DocumentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const DraftResumeModal = ({ isOpen, draftTitle, onResume, onFresh, onClose }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="relative mb-3 flex flex-col gap-3 rounded-xl border border-ftBlue/20 bg-ftBlue/[0.04] px-4 py-3 mobile:flex-row mobile:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-ftBlue/10 text-ftBlue">
          <DocumentIcon />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ftBlack">작성 중이던 내용이 있어요</p>
          <p className="truncate text-xs text-gray-400">&ldquo;{draftTitle}&rdquo;</p>
        </div>
      </div>
      <div className="flex gap-2 pl-12 mobile:pl-0">
        <button
          type="button"
          onClick={onResume}
          className="rounded-lg bg-ftBlue px-3 py-2 text-xs font-semibold text-white hover:bg-ftBlue/90"
        >
          불러오기
        </button>
        <button
          type="button"
          onClick={onFresh}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-slate-50"
        >
          삭제
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-slate-100 hover:text-gray-600"
          aria-label="닫기"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DraftResumeModal;
