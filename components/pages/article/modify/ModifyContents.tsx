import { cn } from 'styles/utils';
import { MDE_OPTION, MDE_OPTIONMOBILE } from 'service/constants/markdownOpts';
import css from './new.module.scss';
import dynamic from 'next/dynamic';
import { DocType } from 'pages/article/modify/[pid]';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useImageUpload } from 'hooks/useImageUpload';
import ModifyPreview from './ModifyPreview';
import type { Options } from 'easymde';

type ToolbarItem = Exclude<NonNullable<Options['toolbar']>, boolean>[number];

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});

interface ModifyContentsProps {
  doc: DocType;
  setDoc: React.Dispatch<React.SetStateAction<DocType>>;
  setImageArr: React.Dispatch<React.SetStateAction<string[]>>;
  isVisiblePreview: boolean;
  containerTopRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
}

const ModifyContents = ({
  doc,
  setDoc,
  setImageArr,
  isVisiblePreview,
  isMobile,
  containerTopRef,
}: ModifyContentsProps) => {
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
    [setDoc]
  );

  const getMdeInstance = useCallback((instance: any) => {
    editorInstanceRef.current = instance;

    const cm = instance?.codemirror;
    if (!cm) return;

    cm.off('cursorActivity');
    cm.on('cursorActivity', () => {
      lastCursorRef.current = cm.getCursor();
    });
  }, []);

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
    [setDoc]
  );

  const handleImageUpload = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      try {
        const mde = editorInstanceRef.current;
        const cm = mde?.codemirror;
        const dropPos = cm
          ? cm.coordsChar({ left: e.clientX, top: e.clientY }, 'window')
          : null;

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        setIsUploadingImage(true);

        const file = e.dataTransfer.files[0];
        const { url: imageUrl, name: imageName } = await uploadImage(
          file,
          controller.signal
        );

        const imageMarkdown = `![${imageName}](${imageUrl})`;
        insertImageAtCursor(imageMarkdown, dropPos || undefined);

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
    [insertImageAtCursor, setImageArr, uploadImage]
  );

  const handleFileSelectUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const file = e.target.files?.[0];
        if (!file) return;

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        setIsUploadingImage(true);

        const { url: imageUrl, name: imageName } = await uploadImage(
          file,
          controller.signal
        );
        const imageMarkdown = `![${imageName}](${imageUrl})`;
        insertImageAtCursor(imageMarkdown);
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
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [insertImageAtCursor, setImageArr, uploadImage]
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
      setSourceScrolling: (value: boolean) => void
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
        value => (isEditorScrolling = value)
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
          'w-full overflow-hidden relative'
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
          onDrop={e => {
            e.preventDefault();
            handleImageUpload(e);
          }}
        />
      </div>

      <ModifyPreview
        isVisiblePreview={isVisiblePreview}
        containerTopRef={containerTopRef}
        doc={doc}
      />
    </div>
  );
};

export default ModifyContents;
