import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useImageUpload } from 'hooks/useImageUpload';
import EditorPreview, { DocType } from './EditorPreview';
import type { ICommand } from '@uiw/react-md-editor';
import {
  bold, italic, strikethrough, hr,
  title1, title2, title3,
  quote, unorderedListCommand, orderedListCommand, checkedListCommand,
  link, code, codeBlock, table, divider,
} from '@uiw/react-md-editor';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface EditorContentsProps {
  doc: DocType;
  setDoc: React.Dispatch<React.SetStateAction<DocType>>;
  setImageArr: React.Dispatch<React.SetStateAction<string[]>>;
  isVisiblePreview: boolean;
  containerTopRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
}

interface CaretPos {
  top: number;
  left: number;
  height: number;
}

const getEditorTextarea = () =>
  document.querySelector<HTMLTextAreaElement>('.w-md-editor-text-input');

const EditorContents = ({
  doc,
  setDoc,
  setImageArr,
  isVisiblePreview,
  containerTopRef,
  isMobile,
}: EditorContentsProps) => {
  const { uploadImage } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const savedCursorRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const isSyncingRef = useRef(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [caretPos, setCaretPos] = useState<CaretPos | null>(null);

  // H1/H2/H3 커맨드 — SSR 안전하게 컴포넌트 안에서 생성
  const headingCommands = useMemo<ICommand[]>(() => [
    { ...title1, icon: <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '-0.02em' }}>H1</span> },
    { ...title2, icon: <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '-0.02em' }}>H2</span> },
    { ...title3, icon: <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '-0.02em' }}>H3</span> },
  ], []);

  const handleContentChange = useCallback(
    (value?: string) => {
      setDoc(prev => ({ ...prev, content: value ?? '' }));
    },
    [setDoc],
  );

  const getCursorPos = useCallback((): number | null => {
    const textarea = getEditorTextarea();
    return textarea ? textarea.selectionStart : null;
  }, []);

  const processFileAndUpload = useCallback(
    async (file: File, cursorPos?: number | null) => {
      if (!file || !file.type.startsWith('image/')) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setIsUploadingImage(true);

      try {
        const { url: imageUrl, name: imageName } = await uploadImage(file, controller.signal);
        const imageMarkdown = `\n![${imageName}](${imageUrl})\n`;
        setDoc(prev => {
          const content = prev.content || '';
          const pos = cursorPos ?? content.length;
          return {
            ...prev,
            content: content.slice(0, pos) + imageMarkdown + content.slice(pos),
          };
        });
        setImageArr(prev => [...prev, imageUrl]);
      } catch (error) {
        if (error instanceof Error && error.message === 'IMAGE_UPLOAD_CANCELED') return;
        console.error('이미지 업로드 실패:', error);
      } finally {
        setIsUploadingImage(false);
        abortRef.current = null;
      }
    },
    [uploadImage, setDoc, setImageArr],
  );

  const handleFileSelectUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const cursorPos = savedCursorRef.current;
        savedCursorRef.current = null;
        await processFileAndUpload(file, cursorPos);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [processFileAndUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.types.includes('Files')) return;
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);

    const outer = outerRef.current;
    const textarea = getEditorTextarea();
    if (!outer || !textarea) return;

    const outerRect = outer.getBoundingClientRect();
    const taRect = textarea.getBoundingClientRect();
    const cs = getComputedStyle(textarea);
    const lh = parseFloat(cs.lineHeight) || 20;
    const pt = parseFloat(cs.paddingTop);
    const pl = parseFloat(cs.paddingLeft);
    const pr = parseFloat(cs.paddingRight);
    const pb = parseFloat(cs.paddingBottom);

    const mx = e.clientX - outerRect.left;
    const my = e.clientY - outerRect.top;

    const taContentTop    = taRect.top    - outerRect.top  + pt;
    const taContentLeft   = taRect.left   - outerRect.left + pl;
    const taContentRight  = taRect.right  - outerRect.left - pr;
    const taContentBottom = taRect.bottom - outerRect.top  - pb;

    const relY = my - taContentTop;
    const lineIdx = Math.max(0, Math.floor(relY / lh));
    const snappedY = taContentTop + lineIdx * lh;

    setCaretPos({
      top:  Math.max(taContentTop,  Math.min(taContentBottom - lh, snappedY)),
      left: Math.max(taContentLeft, Math.min(taContentRight - 2,   mx)),
      height: lh,
    });
  }, [isDragOver]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setCaretPos(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      setIsDragOver(false);
      setCaretPos(null);
      const file = e.dataTransfer?.files?.[0];
      if (!file?.type.startsWith('image/')) return;
      e.preventDefault();

      const textarea = getEditorTextarea();
      if (!textarea) { processFileAndUpload(file, null); return; }

      const taRect = textarea.getBoundingClientRect();
      const cs = getComputedStyle(textarea);
      const lh = parseFloat(cs.lineHeight) || 20;
      const pt = parseFloat(cs.paddingTop);

      const relY = e.clientY - taRect.top - pt + textarea.scrollTop;
      const lineIdx = Math.max(0, Math.floor(relY / lh));

      const lines = textarea.value.split('\n');
      let charPos = 0;
      for (let i = 0; i < Math.min(lineIdx, lines.length - 1); i++) {
        charPos += lines[i].length + 1;
      }

      processFileAndUpload(file, charPos);
    },
    [processFileAndUpload],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          e.preventDefault();
          const cursorPos = getCursorPos();
          const file = items[i].getAsFile();
          if (file) processFileAndUpload(file, cursorPos);
          break;
        }
      }
    },
    [processFileAndUpload, getCursorPos],
  );

  // 양방향 스크롤 싱크
  // scroll 이벤트는 버블링 안 함 → outerRef에 capture 리스너 부착
  // e.target이 실제 스크롤 요소이므로 클래스명 하드코딩 불필요
  useEffect(() => {
    if (!isVisiblePreview) return;

    const wrapperEl = outerRef.current;
    const previewEl = containerTopRef.current;
    if (!wrapperEl || !previewEl) return;

    // 초기값: MDEditor가 마운트되면 .w-md-editor-area를 탐색
    // dynamic import 비동기 마운트를 고려해 없으면 300ms 후 재탐색
    let editorScrollEl: HTMLElement | null =
      wrapperEl.querySelector<HTMLElement>('.w-md-editor-area') ??
      wrapperEl.querySelector<HTMLElement>('.w-md-editor-content');

    const findTimer = editorScrollEl ? null : setTimeout(() => {
      if (!editorScrollEl) {
        editorScrollEl =
          wrapperEl.querySelector<HTMLElement>('.w-md-editor-area') ??
          wrapperEl.querySelector<HTMLElement>('.w-md-editor-content');
      }
    }, 300);

    const onCapture = (e: Event) => {
      const target = e.target as HTMLElement;
      if (isSyncingRef.current) return;

      const fromPreview = target === previewEl || previewEl.contains(target);

      if (fromPreview) {
        // 프리뷰 → 에디터
        if (!editorScrollEl) return;
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        const snap = editorScrollEl;
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          isSyncingRef.current = true;
          const r = previewEl.scrollTop / Math.max(1, previewEl.scrollHeight - previewEl.clientHeight);
          snap.scrollTop = r * (snap.scrollHeight - snap.clientHeight);
          isSyncingRef.current = false;
        });
      } else {
        // 에디터 → 프리뷰 (실제로 스크롤한 요소를 기억)
        if (target.scrollHeight > target.clientHeight) editorScrollEl = target;
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        const snap = target;
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          isSyncingRef.current = true;
          const r = snap.scrollTop / Math.max(1, snap.scrollHeight - snap.clientHeight);
          previewEl.scrollTop = r * (previewEl.scrollHeight - previewEl.clientHeight);
          isSyncingRef.current = false;
        });
      }
    };

    // capture: true — 버블링 없는 scroll 이벤트를 캡처 단계에서 감지
    wrapperEl.addEventListener('scroll', onCapture, { capture: true, passive: true });

    return () => {
      if (findTimer) clearTimeout(findTimer);
      wrapperEl.removeEventListener('scroll', onCapture, { capture: true });
    };
  }, [isVisiblePreview, containerTopRef]);

  const imageUploadCommand: ICommand = {
    name: 'image-upload',
    keyCommand: 'image-upload',
    buttonProps: { 'aria-label': '이미지 업로드', title: '이미지 업로드' },
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    ),
    execute: () => {
      savedCursorRef.current = getCursorPos();
      fileInputRef.current?.click();
    },
  };

  const editorHeight = isMobile ? 300 : `calc(100vh - 100px)`;

  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    if (!isMobile) return;
    const onScroll = () => setShowScrollTop(window.scrollY > 200);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  return (
    <div
      ref={outerRef}
      className="relative flex flex-col tablet:flex-row w-full tablet:h-full"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onPaste={handlePaste}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelectUpload}
      />

      {/* 드래그 오버: 에디터 링 + 깜빡이는 커서 + 하단 배너 */}
      {isDragOver && (
        <>
          <div className="absolute inset-0 z-10 rounded-xl ring-2 ring-ftBlue ring-inset pointer-events-none" />
          {caretPos && (
            <div
              className="absolute z-20 pointer-events-none"
              style={{ top: Math.max(0, caretPos.top), left: Math.max(0, caretPos.left) }}
            >
              <div
                className="drag-caret rounded-full bg-ftBlue"
                style={{ width: 2, height: caretPos.height, boxShadow: '0 0 6px rgba(38,87,166,0.7)' }}
              />
            </div>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-1.5 bg-ftBlue text-white text-xs font-semibold rounded-full shadow-lg whitespace-nowrap pointer-events-none select-none">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l-4 4m0 0l-4-4m4 4V3" />
            </svg>
            커서 위치에 삽입됩니다
          </div>
        </>
      )}

      <div
        className={`relative ${isVisiblePreview ? 'w-full tablet:w-1/2' : 'w-full'}`}
        data-color-mode="light"
      >
        {/* 이미지 업로드 중 — thin 인디케이터 바 */}
        {isUploadingImage && (
          <>
            <div className="absolute top-0 inset-x-0 z-20 h-0.5 overflow-hidden bg-slate-100">
              <div className="indeterminate-bar absolute inset-y-0 w-2/5 bg-ftBlue" />
            </div>
            <button
              type="button"
              onClick={() => { abortRef.current?.abort(); setIsUploadingImage(false); }}
              className="absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              업로드 취소
            </button>
          </>
        )}

        <MDEditor
          value={doc.content || ''}
          onChange={handleContentChange}
          height={editorHeight as number}
          preview="edit"
          hideToolbar={false}
          commands={[
            bold, italic, strikethrough,
            divider,
            ...headingCommands,
            divider,
            hr, quote,
            unorderedListCommand, orderedListCommand, checkedListCommand,
            divider,
            link, imageUploadCommand,
            code, codeBlock, table,
          ]}
          extraCommands={[]}
          style={{ borderRadius: 0, overflow: 'hidden' }}
        />
      </div>

      <EditorPreview
        isVisiblePreview={isVisiblePreview}
        containerTopRef={containerTopRef}
        doc={doc}
        isMobile={isMobile}
      />

      {/* 모바일 위로가기 플로팅 버튼 */}
      {isMobile && showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-4 z-[100] w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-slate-200 text-gray-500 hover:text-ftBlue hover:border-ftBlue/40 transition-all active:scale-95"
          aria-label="맨 위로"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default EditorContents;
