import { CopyBlock, dracula } from 'react-code-blocks';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Content = ({ data }: { data: string }) => {
  return (
    <div className="w-full min-h-[40vh] ">
      <ReactMarkdown
        className="contentMarkdown "
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
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
        {data}
      </ReactMarkdown>
    </div>
  );
};

export default Content;
