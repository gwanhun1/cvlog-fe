import { CopyBlock, dracula } from 'react-code-blocks';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { cn } from 'styles/utils';
import { MDE_OPTION, MDE_OPTIONMOBILE } from 'src/constants/markdownOpts';
import css from './new.module.scss';
import dynamic from 'next/dynamic';
import { DocType } from 'pages/article/modify/[pid]';
import { useCallback } from 'react';
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

        handleContentChange(`![${imageName}](${imageUrl})`);
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

  return (
    <div>
      <div
        className={cn(
          css.mde,
          `${isVisiblePreview ? 'tablet:w-1/2' : 'tablet:w-full'}`,
          'w-full'
        )}
      >
        <SimpleMDE
          options={isMobile ? MDE_OPTIONMOBILE : MDE_OPTION}
          value={doc.content}
          onChange={handleContentChange}
          onDrop={handleImageUpload}
        />
      </div>
      {isVisiblePreview && (
        <div className="flex justify-center tablet:min-w-[50vw] tablet:w-[50vw]">
          <div
            ref={containerTopRef}
            className="w-[70vw] tablet:w-full desktop:pl-8 tablet:pl-5 max-h-[30vh] tablet:max-h-[35vh] desktop:max-h-[75vh] overflow-y-auto"
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
