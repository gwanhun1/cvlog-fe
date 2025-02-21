import { CopyBlock, dracula } from 'react-code-blocks';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { cn } from 'styles/utils';
import { MDE_OPTION, MDE_OPTIONMOBILE } from 'src/constants/markdownOpts';
import css from './new.module.scss';
import dynamic from 'next/dynamic';
import { DocType } from 'pages/article/modify/[pid]';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useImageUpload } from 'hooks/useImageUpload';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

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

  const handleContentChange = useCallback(
    (value: string) => {
      if (value.startsWith('![') && value.endsWith(')')) {
        setDoc(prev => ({
          ...prev,
          content: prev.content + '\n\n' + value,
        }));
      } else {
        setDoc(prev => ({ ...prev, content: value }));
      }
    },
    [setDoc]
  );

  const handleImageUpload = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      try {
        const file = e.dataTransfer.files[0];
        const { url: imageUrl, name: imageName } = await uploadImage(file);

        const editor = e.target as any;
        const cm = editor.simpleMde?.codemirror;

        if (cm) {
          const pos = cm.getCursor();
          const imageMarkdown = `![${imageName}](${imageUrl})`;
          cm.replaceRange(imageMarkdown, pos);
        } else {
          handleContentChange(`![${imageName}](${imageUrl})`);
        }

        setImageArr(prev => [...prev, imageUrl]);
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
      }
    },
    [handleContentChange, setImageArr, uploadImage]
  );

  const renderCodeBlock = useCallback(
    ({ inline, className, children, ...props }: CodeBlockProps) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <CopyBlock
          text={String(children).replace(/\n$/, '')}
          language={match[1]}
          showLineNumbers={true}
          theme={dracula}
          codeBlock
        />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    []
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

      // 현재 스크롤 위치의 백분율 계산
      const scrollPercentage = source.scrollTop / sourceScrollableHeight;

      // 타겟의 스크롤 위치를 백분율에 맞게 설정
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
      // 프리뷰 스크롤은 에디터에 영향을 주지 않도록 함
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
        style={{ height: 'calc(100vh - 210px)' }}
      >
        <SimpleMDE
          style={{ color: '#2657A6', height: '100%' }}
          options={{
            ...(isMobile ? MDE_OPTIONMOBILE : MDE_OPTION),
            minHeight: '100%',
          }}
          value={doc.content}
          onChange={handleContentChange}
          onDrop={e => {
            e.preventDefault();
            handleImageUpload(e);
          }}
        />
      </div>
      {isVisiblePreview && (
        <div className="flex-1 tablet:min-w-[50vw] tablet:w-[50vw] overflow-hidden h-[75vh]">
          <div
            ref={containerTopRef}
            className="w-full px-4 overflow-y-auto tablet:px-8"
            style={{ height: 'calc(100vh - 200px)' }}
          >
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                code: renderCodeBlock,
              }}
            >
              {doc.content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifyContents;
