import { CopyBlock, dracula } from 'react-code-blocks';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { useRef } from 'react';
import { cn } from 'styles/utils';
import { useRecoilValue } from 'recoil';
import { userIdAtom } from 'service/atoms/atoms';
import styles from '../../../styles/markdown.module.scss';
import TocItemsContainer from './tocItems';

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface MarkdownContentProps {
  content?: string;
  className?: string;
  writer?: string;
  id?: number;
}

const MarkdownContent = ({
  content = '',
  className = '',
  writer,
  id,
}: MarkdownContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const userInfo = useRecoilValue(userIdAtom);

  return (
    <div
      className={cn(
        'relative flex w-full min-h-[40vh] overflow-x-hidden',
        className || ''
      )}
    >
      {id && writer && writer !== userInfo?.github_id && (
        <nav className="hidden tablet:fixed tablet:top-40 tablet:right-1/2 tablet:translate-x-[-360px] tablet:w-64 tablet:h-fit tablet:ml-8 tablet:p-4">
          {/* <LogmeLikeBtn isOwnPost={false} postId={id} /> */}
        </nav>
      )}

      <div className="flex-1 w-full" ref={contentRef}>
        <div className={styles.contentMarkdown}>
          <ReactMarkdown
            rehypePlugins={[rehypeRaw, rehypeSlug]}
            remarkPlugins={[remarkGfm]}
            components={{
              code: ({ inline, className, children, ...props }: CodeProps) => {
                const match = /language-(\w+)/.exec(className || '');
                const isMultiLine = !inline && match;

                return isMultiLine ? (
                  <div className="w-full tablet:max-w-[880px] overflow-x-auto mb-4">
                    <CopyBlock
                      text={String(children).replace(/\n$/, '')}
                      language={match ? match[1] : 'text'}
                      showLineNumbers={true}
                      theme={dracula}
                      codeBlock
                    />
                  </div>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>

      <TocItemsContainer contentRef={contentRef} content={content} />
    </div>
  );
};

export default MarkdownContent;
