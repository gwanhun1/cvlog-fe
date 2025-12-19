import { CopyBlock, dracula } from 'react-code-blocks';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import styles from '../../../../styles/markdown.module.scss';

export interface DocType {
  title: string;
  content: string;
  tags: string[];
}

interface EditorPreviewProps {
  isVisiblePreview: boolean;
  containerTopRef: React.RefObject<HTMLDivElement>;
  doc: DocType;
}

interface CodeBlockProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const EditorPreview = ({
  isVisiblePreview,
  containerTopRef,
  doc,
}: EditorPreviewProps) => {
  return (
    <>
      {isVisiblePreview && (
        <div className="flex-1 tablet:min-w-[50vw] tablet:w-[50vw] overflow-hidden h-[80vh]">
          <div
            ref={containerTopRef}
            className="w-full px-4 overflow-y-auto tablet:px-8"
            style={{ height: 'calc(100vh - 190px)' }}
          >
            <div className={styles.contentMarkdown}>
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
                components={{
                  code: ({
                    node,
                    inline,
                    className,
                    children,
                    ...props
                  }: CodeBlockProps) => {
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
                      <code {...props}>{children}</code>
                    );
                  },
                  ul: ({ node, ...props }: any) => {
                    return (
                      <ul
                        style={{
                          listStyleType: 'disc',
                          marginLeft: '1rem',
                          marginTop: '0.5rem',
                          marginBottom: '0.5rem',
                        }}
                        {...props}
                      />
                    );
                  },
                  ol: ({ node, ...props }: any) => {
                    return (
                      <ol
                        style={{
                          listStyleType: 'decimal',
                          marginLeft: '1rem',
                          marginTop: '0.5rem',
                          marginBottom: '0.5rem',
                        }}
                        {...props}
                      />
                    );
                  },
                  li: ({ node, ...props }: any) => {
                    return <li style={{ margin: '0.25rem 0' }} {...props} />;
                  },
                }}
              >
                {doc.content || ''}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditorPreview;
