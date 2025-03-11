import { CopyBlock, dracula } from 'react-code-blocks';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { useRef, useMemo, memo } from 'react';
import { cn } from 'styles/utils';
import { useRecoilValue } from 'recoil';
import { userIdAtom, selectedTagListAtom } from 'service/atoms/atoms';
import styles from '../../../styles/markdown.module.scss';
import TocItemsContainer from './TocItemsContainer';

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

// 파란 계열 색상
const blueColors = ['#60a5fa', '#7bb9f9', '#93c8f8', '#a9d7f7', '#bedff6'];

const MarkdownContentComponent = ({
  content = '',
  className = '',
  writer,
  id,
}: MarkdownContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const userInfo = useRecoilValue(userIdAtom);
  const selectedTags = useRecoilValue(selectedTagListAtom);

  const selectedWords = useMemo(
    () => selectedTags.map(tag => tag.name),
    [selectedTags]
  );

  // 텍스트에서 선택된 태그 단어들을 강조 처리
  const highlightWords = useMemo(() => {
    return (text: string) => {
      if (!selectedWords.length) return text;

      let result = text;
      selectedWords.forEach((word, index) => {
        if (!word) return;
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedWord})`, 'gi');
        const color = blueColors[index % blueColors.length];
        result = result.replace(
          regex,
          `<span style="background-color: ${color}">$1</span>`
        );
      });
      return result;
    };
  }, [selectedWords]);

  // 마크다운 컴포넌트에 전달할 커스텀 컴포넌트
  const components = useMemo(() => {
    const createHighlightComponent = (Tag: keyof JSX.IntrinsicElements) => {
      const HighlightComponent = ({ children, ...props }: any) => {
        if (typeof children === 'string') {
          return (
            <Tag
              {...props}
              dangerouslySetInnerHTML={{ __html: highlightWords(children) }}
            />
          );
        }
        return <Tag {...props}>{children}</Tag>;
      };
      HighlightComponent.displayName = `Highlight${
        Tag.charAt(0).toUpperCase() + Tag.slice(1)
      }`;
      return HighlightComponent;
    };

    return {
      p: createHighlightComponent('p'),
      h1: createHighlightComponent('h1'),
      h2: createHighlightComponent('h2'),
      h3: createHighlightComponent('h3'),
      h4: createHighlightComponent('h4'),
      h5: createHighlightComponent('h5'),
      h6: createHighlightComponent('h6'),
      li: createHighlightComponent('li'),
      em: createHighlightComponent('em'),
      strong: createHighlightComponent('strong'),
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
    };
  }, [highlightWords]);

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
            components={components}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>

      <TocItemsContainer contentRef={contentRef} content={content} />
    </div>
  );
};

MarkdownContentComponent.displayName = 'MarkdownContent';

const MarkdownContent = memo(MarkdownContentComponent);
export default MarkdownContent;
