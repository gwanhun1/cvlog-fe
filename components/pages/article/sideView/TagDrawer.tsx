import { useCallback, useEffect, useRef } from 'react';
import { IoCloseOutline, IoPricetagsOutline } from 'react-icons/io5';
import { useGetFolders } from 'service/hooks/List';
import SideView from './SideView';

interface TagDrawerProps {
  open: boolean;
  onClose: () => void;
}

const FOCUSABLE_ELEMENTS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const TagDrawer = ({ open, onClose }: TagDrawerProps) => {
  const { data: folders } = useGetFolders();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const totalTags =
    folders?.reduce((sum, folder) => sum + (folder.tags?.length ?? 0), 0) ?? 0;

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const panel = panelRef.current;
      const focusableElements = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS),
      ).filter(element => element.offsetParent !== null);

      if (focusableElements.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (
        event.shiftKey &&
        (activeElement === firstElement || !panel.contains(activeElement))
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (!open) {
      panel.setAttribute('inert', '');
      return;
    }

    panel.removeAttribute('inert');
    openerRef.current = document.activeElement as HTMLElement | null;
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(
      () => closeButtonRef.current?.focus(),
      0,
    );

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      openerRef.current?.focus();
    };
  }, [handleKey, open]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/30 transition-opacity duration-300 ${
          open
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden
      />

      <div
        id="article-tag-drawer"
        ref={panelRef}
        className={`fixed bottom-0 left-0 top-[var(--header-height,64px)] z-50 flex w-[86vw] max-w-[320px] flex-col border-r border-slate-200 bg-white shadow-[18px_0_50px_rgba(15,23,42,0.16)] transition-[transform,opacity] duration-300 ease-out ${
          open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="내 태그 정리"
        aria-describedby="article-tag-drawer-help"
        aria-hidden={!open}
        tabIndex={-1}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <IoPricetagsOutline
              aria-hidden
              className="h-4 w-4 shrink-0 text-ftBlue"
            />
            <span className="text-sm font-bold text-slate-900">태그 정리</span>
            {totalTags > 0 && (
              <span className="text-[11px] font-medium text-slate-400">
                {totalTags}개
              </span>
            )}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-ftBlue"
            aria-label="태그 정리 닫기"
          >
            <IoCloseOutline aria-hidden className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <SideView className="flex w-full flex-col bg-white" />
        </div>

        <div className="shrink-0 border-t border-slate-200 px-4 py-3">
          <p
            id="article-tag-drawer-help"
            className="m-0 text-center text-[11px] leading-relaxed text-slate-400"
          >
            태그를 끌어 다른 폴더로 이동할 수 있습니다.
          </p>
        </div>
      </div>
    </>
  );
};

export default TagDrawer;
