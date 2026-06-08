import { useEffect } from 'react';

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
  // ESC 키 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      {/* 모달 카드 */}
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-5 notification-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-slate-100 transition-colors"
          aria-label="닫기"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 아이콘 + 제목 */}
        <div className="flex flex-col items-center gap-3 pt-1">
          <div className="w-12 h-12 rounded-full bg-ftBlue/10 text-ftBlue flex items-center justify-center">
            <DocumentIcon />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-ftBlack">임시 저장된 글이 있어요</p>
            <p className="mt-1 text-xs text-gray-400 line-clamp-1 px-4">
              &ldquo;{draftTitle}&rdquo;
            </p>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onResume}
            className="w-full h-11 rounded-xl bg-ftBlue text-white text-sm font-semibold hover:bg-ftBlue/90 transition-colors"
          >
            이어서 작성하기
          </button>
          <button
            type="button"
            onClick={onFresh}
            className="w-full h-11 rounded-xl border border-slate-200 text-sm text-gray-500 hover:bg-slate-50 transition-colors"
          >
            새로 작성하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftResumeModal;
