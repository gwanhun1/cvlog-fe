import { cn } from 'styles/utils';
import { MDE_OPTION, MDE_OPTIONMOBILE } from 'service/constants/markdownOpts';
import css from './new.module.scss';
import dynamic from 'next/dynamic';
import { DocType } from 'pages/article/modify/[pid]';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useImageUpload } from 'hooks/useImageUpload';
import ModifyPreview from './ModifyPreview';

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

  const editorOptions = useMemo(() => {
    return {
      ...(isMobile ? MDE_OPTIONMOBILE : MDE_OPTION),
      minHeight: '100%',
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

  const getEditorInstance = useCallback((editor: any) => {
    editorInstanceRef.current = editor;
  }, []);

  const handleImageUpload = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      try {
        const file = e.dataTransfer.files[0];
        const { url: imageUrl, name: imageName } = await uploadImage(file);

        const editor = editorInstanceRef.current;
        const cm = editor?.simpleMde?.codemirror;

        if (cm) {
          const pos = cm.getCursor();
          const imageMarkdown = `![${imageName}](${imageUrl})`;
          cm.replaceRange(imageMarkdown, pos);
        } else {
          // 이미지 업로드 시 현재 내용에 추가
          const newValue =
            (doc.content || '') + '\n\n' + `![${imageName}](${imageUrl})`;
          setDoc(prev => ({ ...prev, content: newValue }));
        }

        setImageArr(prev => [...prev, imageUrl]);
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
      }
    },
    [doc.content, setDoc, setImageArr, uploadImage]
  );

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
      <div
        ref={editorRef}
        className={cn(
          css.mde,
          `${isVisiblePreview ? 'tablet:w-1/2' : 'tablet:w-full'}`,
          'w-full overflow-hidden'
        )}
        style={{ height: 'calc(100vh - 180px)' }}
      >
        <SimpleMDE
          style={{ color: '#2657A6', height: '100%' }}
          options={editorOptions}
          value={doc.content || ''}
          onChange={handleContentChange}
          getCodemirrorInstance={getEditorInstance}
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
