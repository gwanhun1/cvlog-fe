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

  return (
    <>
      <div
        className={cn(
          css.mde,
          `${isVisiblePreview ? 'tablet:w-1/2' : 'tablet:w-full'}`,
          'w-full'
        )}
      >
        <SimpleMDE
          style={{ color: '#fff' }}
          options={isMobile ? MDE_OPTIONMOBILE : MDE_OPTION}
          value={doc.content}
          onChange={handleContentChange}
          onDrop={e => {
            e.preventDefault();
            handleImageUpload(e);
          }}
        />
      </div>
      {isVisiblePreview && (
        <div className="flex-1 tablet:min-w-[50vw] tablet:w-[50vw]">
          <div
            ref={containerTopRef}
            className="w-full h-full px-4 overflow-y-auto tablet:px-8"
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
    </>
  );
};

export default ModifyContents;
