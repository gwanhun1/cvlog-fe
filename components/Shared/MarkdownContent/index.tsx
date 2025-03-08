import { CopyBlock, dracula } from 'react-code-blocks';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { useState, useEffect, useRef } from 'react';
import { cn } from 'styles/utils';
import { useRecoilValue } from 'recoil';
import { userIdAtom } from 'service/atoms/atoms';
import styles from '../../../styles/markdown.module.scss';

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface TOCItem {
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
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const userInfo = useRecoilValue(userIdAtom);

  useEffect(() => {
    if (!contentRef.current || !content) return;

    const extractTocItems = () => {
      const headingElements = contentRef.current?.querySelectorAll(
        'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]'
      );

      if (!headingElements) return [];

      const items: TOCItem[] = [];

      headingElements.forEach(el => {
        const id = el.getAttribute('id');
        if (!id) return;

        const level = parseInt(el.tagName.substring(1));
        const text = el.textContent || '';

        items.push({ id, text, level });
      });

      return items;
    };

    setTimeout(() => {
      const items = extractTocItems();
      setTocItems(items);

      if (items.length > 0) {
        setActiveId(items[0].id);
      }
    }, 300);
  }, [content]);

  useEffect(() => {
    if (tocItems.length === 0) return;

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const headingElements = tocItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id),
      }));

      const scrollPosition = window.scrollY + 150;

      let currentId = headingElements[0].id;

      for (const { id, element } of headingElements) {
        if (element && element.offsetTop <= scrollPosition) {
          currentId = id;
        } else {
          break;
        }
      }

      if (currentId !== activeId) {
        setActiveId(currentId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems, activeId]);

  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (!element) return;

    isScrollingRef.current = true;
    setActiveId(headingId);

    const headerOffset = -220;
    const elementPosition = element.offsetTop;

    window.scrollTo({
      top: elementPosition - headerOffset,
      behavior: 'smooth',
    });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 700);
  };

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

      {tocItems.length > 0 && (
        <nav className="tablet:fixed tablet:top-40 tablet:left-1/2 tablet:translate-x-[440px] tablet:w-64 tablet:h-fit tablet:ml-8 tablet:p-4 tablet:border-l tablet:border-gray-200">
          <ul className="space-y-2">
            {tocItems.map(item => (
              <li
                key={item.id}
                style={{ paddingLeft: `${(item.level - 1) * 1}rem` }}
                className={cn(
                  'cursor-pointer hover:text-blue-500 transition-colors duration-200 py-1 text-sm',
                  activeId === item.id
                    ? 'text-blue-700 font-bold border-l-2 border-blue-500 -ml-[1px] pl-[calc(1rem*(item.level-1)+3px)]'
                    : 'text-gray-600'
                )}
                onClick={() => scrollToHeading(item.id)}
              >
                {item.text}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default MarkdownContent;
