import { CopyBlock, dracula } from 'react-code-blocks';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { cn } from 'styles/utils';
import css from './new.module.scss';
import { useCallback } from 'react';
import { DocType } from 'pages/article/new';
import { MDE_OPTION, MDE_OPTIONMOBILE } from 'src/constants/markdownOpts';
import { useImageUpload } from 'hooks/useImageUpload';
import dynamic from 'next/dynamic';

interface NewContentsProps {
  doc: DocType;
  setDoc: React.Dispatch<React.SetStateAction<DocType>>;
  setImageArr: React.Dispatch<React.SetStateAction<string[]>>;
  isVisiblePreview: boolean;
  containerTopRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
}

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});

const NewContents = ({
  doc,
  setDoc,
  setImageArr,
  isVisiblePreview,
  containerTopRef,
  isMobile,
}: NewContentsProps) => {
  const { uploadImage } = useImageUpload();

  const handleContentChange = useCallback(
    (value: string) => {
      if (value.startsWith('![') && value.endsWith(')')) {
        const pastValue = doc.content;
        const newValue = pastValue + '\n\n' + value;
        setDoc(prev => ({ ...prev, content: newValue }));
      } else {
        setDoc(prev => ({ ...prev, content: value }));
      }
    },
    [doc.content, setDoc]
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
          style={{ color: '#2657A6' }}
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
                ul: ({ node, ...props }) => (
                  <ul className="list-disc ml-4 my-2" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal ml-4 my-2" {...props} />
                ),
                li: ({ node, ...props }) => <li className="my-1" {...props} />,
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

export default NewContents;
