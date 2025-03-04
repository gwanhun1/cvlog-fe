import { CopyBlock, dracula } from 'react-code-blocks';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef, useState } from 'react';
import { cn } from 'styles/utils';
import LogmeLikeBtn from '../LogmeLikeBtn';
import { useRecoilValue } from 'recoil';
import { userIdAtom } from 'service/atoms/atoms';
import styles from '../../../styles/markdown.module.scss';

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
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
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);

  const userInfo = useRecoilValue(userIdAtom);

  useEffect(() => {
    if (!content) return;

    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches = Array.from(content.matchAll(headingRegex));
    // In your useEffect where you extract headings:
    const items = matches.map((match, index) => {
      // Create an ID that's based on the heading text (more reliable)
      const headingText = match[2];
      const idText = headingText.toLowerCase().replace(/\s+/g, '-');
      return {
        id: `heading-${idText}`,
        text: match[2],
        level: match[1].length,
      };
    });

    setHeadings(items);
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const headingElements = contentRef.current.querySelectorAll(
        'h1, h2, h3, h4, h5, h6'
      );
      const headingPositions = Array.from(headingElements).map(element => ({
        id: element.id,
        top: element.getBoundingClientRect().top,
      }));

      const currentHeading = headingPositions.find(
        heading => heading.top > 0
      ) || { id: '', top: 0 };

      if (currentHeading) {
        setActiveId(currentHeading.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // 헤더 높이(예: 80px)만큼 오프셋 추가
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };
  console.log(headings);

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
        <ReactMarkdown
          className={styles.contentMarkdown}
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children, ...props }) => {
              const headingText = String(children)
                .toLowerCase()
                .replace(/\s+/g, '-');
              return (
                <h1 id={`heading-${headingText}`} {...props}>
                  {children}
                </h1>
              );
            },

            h2: ({ children, ...props }) => {
              const headingText = String(children)
                .toLowerCase()
                .replace(/\s+/g, '-');
              return (
                <h2 id={`heading-${headingText}`} {...props}>
                  {children}
                </h2>
              );
            },
            h3: ({ children, ...props }) => {
              const headingText = String(children)
                .toLowerCase()
                .replace(/\s+/g, '-');
              return (
                <h3 id={`heading-${headingText}`} {...props}>
                  {children}
                </h3>
              );
            },
            h4: ({ children, ...props }) => {
              const headingText = String(children)
                .toLowerCase()
                .replace(/\s+/g, '-');
              return (
                <h4 id={`heading-${headingText}`} {...props}>
                  {children}
                </h4>
              );
            },
            h5: ({ children, ...props }) => {
              const headingText = String(children)
                .toLowerCase()
                .replace(/\s+/g, '-');
              return (
                <h5 id={`heading-${headingText}`} {...props}>
                  {children}
                </h5>
              );
            },
            h6: ({ children, ...props }) => {
              const headingText = String(children)
                .toLowerCase()
                .replace(/\s+/g, '-');
              return (
                <h6 id={`heading-${headingText}`} {...props}>
                  {children}
                </h6>
              );
            },
            code: ({ inline, className, children, ...props }: CodeProps) => {
              const match = /language-(\w+)/.exec(className || '');
              const isMultiLine = !inline && match;

              return isMultiLine ? (
                <div className="w-full tablet:max-w-[880px] overflow-x-auto">
                  <CopyBlock
                    text={String(children).replace(/\n$/, '')}
                    language={match[1]}
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

      {headings && headings.length > 0 && (
        <nav className="hidden tablet:fixed tablet:top-40 tablet:left-1/2 tablet:translate-x-[440px] tablet:w-64 tablet:h-fit tablet:ml-8 tablet:p-4 tablet:border-l tablet:border-gray-200">
          <ul className="space-y-2">
            {headings.map(heading => (
              <li
                key={heading.id}
                style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
                className={cn(
                  'cursor-pointer  hover:text-blue-500 transition-colors',
                  activeId === heading.id
                    ? 'text-blue-700 font-bold text-sm '
                    : 'text-gray-600 text-sm'
                )}
                onClick={() => scrollToHeading(heading.id)}
              >
                {heading.text}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default MarkdownContent;
