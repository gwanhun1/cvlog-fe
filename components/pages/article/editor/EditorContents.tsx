import { cn } from 'styles/utils';
import css from './editor.module.scss';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MDE_OPTION, MDE_OPTIONMOBILE } from 'service/constants/markdownOpts';
import { useImageUpload } from 'hooks/useImageUpload';
import dynamic from 'next/dynamic';
import EditorPreview, { DocType } from './EditorPreview';
import type { Options } from 'easymde';

type ToolbarItem = Exclude<NonNullable<Options['toolbar']>, boolean>[number];

interface EditorContentsProps {
  doc: DocType;
  setDoc: React.Dispatch<React.SetStateAction<DocType>>;
  setImageArr: React.Dispatch<React.SetStateAction<string[]>>;
  isVisiblePreview: boolean;
  containerTopRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
}

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});

const EditorContents = ({
  doc,
  setDoc,
  setImageArr,
  isVisiblePreview,
  containerTopRef,
  isMobile,
}: EditorContentsProps) => {
  const { uploadImage } = useImageUpload();
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);
  const lastCursorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const editorOptions = useMemo(() => {
    const base = isMobile ? MDE_OPTIONMOBILE : MDE_OPTION;
    const baseToolbar = Array.isArray(base.toolbar) ? base.toolbar : [];

    return {
      ...base,
      minHeight: '100%',
      toolbar: baseToolbar.map((item: ToolbarItem) => {
        if (item !== 'image') return item;
        return {
          name: 'image-upload',
          action: () => {
            fileInputRef.current?.click();
          },
          className: 'fa fa-picture-o',
          title: '이미지 업로드',
        };
      }),
    };
  }, [isMobile]);

  useEffect(() => {
    setDoc(prev => {
      if (prev.content !== undefined && prev.content !== '') {
        return prev;
      }
      return { ...prev, content: '' };
    });
  }, [setDoc]);

  const handleContentChange = useCallback(
    (value: string) => {
      setDoc(prev => {
        if (prev.content !== value) {
          return { ...prev, content: value };
        }
        return prev;
      });
    },
    [setDoc],
  );

  const insertImageAtCursor = useCallback(
    (imageMarkdown: string, targetPos?: any) => {
      const mde = editorInstanceRef.current;
      const cm = mde?.codemirror;
      if (!cm) {
        setDoc(prev => ({
          ...prev,
          content: (prev.content || '') + '\n\n' + imageMarkdown,
        }));
        return;
      }

      const pos = targetPos || lastCursorRef.current || cm.getCursor();
      cm.focus();
      cm.setCursor(pos);
      cm.replaceRange(imageMarkdown, pos);
      lastCursorRef.current = cm.getCursor();
    },
    [setDoc],
  );

  const processFileAndUpload = useCallback(
    async (file: File, dropPos?: any) => {
      if (!file || !file.type.startsWith('image/')) return;

      try {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        setIsUploadingImage(true);

        const { url: imageUrl, name: imageName } = await uploadImage(
          file,
          controller.signal,
        );

        const imageMarkdown = `![${imageName}](${imageUrl})`;
        insertImageAtCursor(imageMarkdown, dropPos);

        setImageArr(prev => [...prev, imageUrl]);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === 'IMAGE_UPLOAD_CANCELED'
        ) {
          return;
        }
        console.error('이미지 업로드 실패:', error);
      } finally {
        setIsUploadingImage(false);
        abortRef.current = null;
      }
    },
    [insertImageAtCursor, setImageArr, uploadImage],
  );

  const handlePaste = useCallback(
    async (cm: any, e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) {
            processFileAndUpload(file);
          }
          break;
        }
      }
    },
    [processFileAndUpload],
  );

  const handleDrop = useCallback(
    async (cm: any, e: DragEvent) => {
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        e.preventDefault();
        e.stopPropagation();

        const dropPos = cm.coordsChar(
          { left: e.clientX, top: e.clientY },
          'window',
        );
        processFileAndUpload(files[0], dropPos);
      }
    },
    [processFileAndUpload],
  );

  const getMdeInstance = useCallback(
    (instance: any) => {
      editorInstanceRef.current = instance;

      const cm = instance?.codemirror;
      if (!cm) return;

      cm.off('cursorActivity');
      cm.on('cursorActivity', () => {
        lastCursorRef.current = cm.getCursor();
      });

      // 핵심 로직: 에디터 엔진(CodeMirror)에 직접 이벤트 바인딩
      cm.off('paste');
      cm.on('paste', (cmInstance: any, e: ClipboardEvent) => {
        handlePaste(cmInstance, e);
      });

      cm.off('drop');
      cm.on('drop', (cmInstance: any, e: DragEvent) => {
        handleDrop(cmInstance, e);
      });
    },
    [handlePaste, handleDrop],
  );

  const handleFileSelectUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await processFileAndUpload(file);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [processFileAndUpload],
  );

  const handleCancelUpload = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsUploadingImage(false);
  }, []);

  useEffect(() => {
    if (!isVisiblePreview || !editorRef.current || !containerTopRef.current)
      return;

    let editor: HTMLElement | null = null;
    let isEditorScrolling = false;
    let isPreviewScrolling = false;
    let scrollTimeout: number;

    const timer = setTimeout(() => {
      const editorElement =
        editorRef.current?.querySelector('.CodeMirror-scroll');
      if (editorElement instanceof HTMLElement) {
        editor = editorElement;
      }
    }, 100);

    const preview = containerTopRef.current;

    const syncScroll = (
      source: HTMLElement,
      target: HTMLElement,
      isSourceScrolling: boolean,
      setSourceScrolling: (value: boolean) => void,
    ) => {
      if (isSourceScrolling) return;

      const sourceScrollableHeight = source.scrollHeight - source.clientHeight;
      const targetScrollableHeight = target.scrollHeight - target.clientHeight;

      if (sourceScrollableHeight <= 0 || targetScrollableHeight <= 0) return;

      const scrollPercentage = source.scrollTop / sourceScrollableHeight;

      setSourceScrolling(true);
      target.scrollTop = scrollPercentage * targetScrollableHeight;

      cancelAnimationFrame(scrollTimeout);
      scrollTimeout = requestAnimationFrame(() => {
        setSourceScrolling(false);
      });
    };

    const handleEditorScroll = () => {
      if (!editor || isPreviewScrolling) return;
      syncScroll(
        editor,
        preview,
        isEditorScrolling,
        value => (isEditorScrolling = value),
      );
    };

    const handlePreviewScroll = () => {
      return;
    };

    const attachListeners = () => {
      if (!editor) return;

      editor.addEventListener('scroll', handleEditorScroll, { passive: true });
      preview.addEventListener('scroll', handlePreviewScroll, {
        passive: true,
      });
    };

    const timer2 = setTimeout(attachListeners, 200);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      cancelAnimationFrame(scrollTimeout);
      editor?.removeEventListener('scroll', handleEditorScroll);
      preview.removeEventListener('scroll', handlePreviewScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisiblePreview]);

  return (
    <div className="flex w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelectUpload}
      />
      <div
        ref={editorRef}
        className={cn(
          css.mde,
          `${isVisiblePreview ? 'tablet:w-1/2' : 'tablet:w-full'}`,
          'w-full overflow-hidden relative',
        )}
        style={{ height: 'calc(100vh - 180px)' }}
      >
        {isUploadingImage && (
          <div className="flex absolute inset-0 z-20 justify-center items-center backdrop-blur-sm bg-white/60">
            <div className="flex flex-col gap-3 items-center px-5 py-4 rounded-2xl border border-gray-200 shadow-sm bg-white/80">
              <div className="w-8 h-8 rounded-full border-2 border-gray-300 animate-spin border-t-ftBlue" />
              <div className="text-sm font-medium text-gray-700">
                이미지 업로드 중...
              </div>
              <button
                type="button"
                onClick={handleCancelUpload}
                className="px-3 py-1.5 text-sm font-semibold rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
              >
                취소
              </button>
            </div>
          </div>
        )}
        <SimpleMDE
          style={{ color: '#2657A6', height: '100%' }}
          options={editorOptions}
          value={doc.content || ''}
          onChange={handleContentChange}
          getMdeInstance={getMdeInstance}
        />
      </div>

      <EditorPreview
        isVisiblePreview={isVisiblePreview}
        containerTopRef={containerTopRef}
        doc={doc}
      />
    </div>
  );
};

export default EditorContents;
