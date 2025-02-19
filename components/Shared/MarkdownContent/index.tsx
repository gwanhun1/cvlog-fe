import { CopyBlock, dracula } from 'react-code-blocks';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef, useState } from 'react';
import { cn } from 'styles/utils';

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
}

const MarkdownContent = ({
  content = '',
  className = '',
}: MarkdownContentProps) => {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!content) return;

    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches = Array.from(content.matchAll(headingRegex));
    const items = matches.map((match, index) => ({
      id: `heading-${index}`,
      text: match[2],
      level: match[1].length,
    }));
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

      const currentHeading =
        headingPositions.find(heading => heading.top > 0) ||
        headingPositions[0];
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
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={cn('relative flex w-full min-h-[40vh]', className || '')}>
      <div className="flex-1" ref={contentRef}>
        <ReactMarkdown
          className="contentMarkdown"
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children, ...props }) => (
              <h1 id={`heading-${props.key}`} {...props}>
                {children}
              </h1>
            ),
            h2: ({ children, ...props }) => (
              <h2 id={`heading-${props.key}`} {...props}>
                {children}
              </h2>
            ),
            h3: ({ children, ...props }) => (
              <h3 id={`heading-${props.key}`} {...props}>
                {children}
              </h3>
            ),
            h4: ({ children, ...props }) => (
              <h4 id={`heading-${props.key}`} {...props}>
                {children}
              </h4>
            ),
            h5: ({ children, ...props }) => (
              <h5 id={`heading-${props.key}`} {...props}>
                {children}
              </h5>
            ),
            h6: ({ children, ...props }) => (
              <h6 id={`heading-${props.key}`} {...props}>
                {children}
              </h6>
            ),
            code: ({ inline, className, children, ...props }: CodeProps) => {
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
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {headings.length > 0 && (
        <nav className="hidden lg:block sticky top-20 right-0 w-64 h-fit ml-8 p-4 border-l border-gray-200">
          <ul className="space-y-2">
            {headings.map(heading => (
              <li
                key={heading.id}
                style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
                className={cn(
                  'cursor-pointer text-sm hover:text-blue-500 transition-colors',
                  activeId === heading.id
                    ? 'text-blue-500 font-medium'
                    : 'text-gray-600'
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
