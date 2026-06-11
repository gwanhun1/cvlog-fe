import { useEffect, useCallback } from 'react';
import SideView from './SideView';
import { useGetFolders } from 'service/hooks/List';

interface TagDrawerProps {
  open: boolean;
  onClose: () => void;
}

const TagDrawer = ({ open, onClose }: TagDrawerProps) => {
  const { data: folders } = useGetFolders();

  const totalTags = folders?.reduce((sum, f) => sum + (f.tags?.length ?? 0), 0) ?? 0;

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, handleKey]);

  return (
    <>
      {/* backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden
      />

      {/* drawer panel */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-[85vw] max-w-[300px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="태그 관리"
      >
        {/* header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-ftBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="text-sm font-bold text-ftBlack">태그 관리</span>
            {totalTags > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-ftBlue rounded-full">
                {totalTags}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="닫기"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* scrollable body */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          <SideView className="w-full flex flex-col bg-white/90 backdrop-blur rounded-xl border border-ftBlue/20 transition-opacity duration-200" />
        </div>

        {/* footer hint */}
        <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
          <p className="text-[11px] text-gray-400 text-center">
            태그를 드래그해서 폴더로 이동할 수 있어요
          </p>
        </div>
      </div>
    </>
  );
};

export default TagDrawer;
