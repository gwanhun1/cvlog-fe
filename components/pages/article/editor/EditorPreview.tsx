import { CopyBlock, dracula } from 'react-code-blocks';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import styles from '../../../../styles/markdown.module.scss';

export interface DocType {
  title: string;
  content: string;
  tags: string[];
  series?: string;
  series_order?: number | null;
}

interface EditorPreviewProps {
  isVisiblePreview: boolean;
  containerTopRef: React.RefObject<HTMLDivElement>;
  doc: DocType;
  isMobile?: boolean;
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
  isMobile,
}: EditorPreviewProps) => {
  return (
    <>
      {isVisiblePreview && (
        <div className="flex-1 w-full tablet:min-w-[50vw] tablet:w-[50vw] tablet:overflow-hidden border-t tablet:border-t-0 tablet:border-l border-slate-200">
          <div
            ref={containerTopRef}
            className="w-full px-4 tablet:overflow-y-auto tablet:px-8"
            style={isMobile ? undefined : { height: 'calc(100vh - 100px)' }}
          >
            <div className={styles.contentMarkdown}>
              <ReactMarkdown
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
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
                    const text = String(children).replace(/\n$/, '');
                    const isBlock = !inline && (match || text.includes('\n'));
                    return isBlock ? (
                      <div className="w-full overflow-x-auto mb-4">
                        <CopyBlock
                          text={text}
                          language={match ? match[1] : 'text'}
                          showLineNumbers={true}
                          theme={dracula}
                          codeBlock
                        />
                      </div>
                    ) : (
                      <code {...props}>{children}</code>
                    );
                  },
                  table: ({ node, ...props }: any) => (
                    <div className={styles.tableWrapper}>
                      <table {...props} />
                    </div>
                  ),
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
