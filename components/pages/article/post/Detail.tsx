import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { CopyBlock, dracula } from 'react-code-blocks';
import ReactMarkdown from 'react-markdown';
import { useQuery } from 'react-query';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Detail = () => {
  const {
    query: { pid },
  } = useRouter();
  const { data: mockData, isLoading } = useQuery('detail', async () => {
    const res = await axios(
      'https://raw.githubusercontent.com/mxstbr/markdown-test-file/master/TEST.md',
    );
    return res;
  });

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <main>
      <h1 className="text-3xl font-bold underline">
        I&apos;m Detail Page {pid}
      </h1>
      <ReactMarkdown
        className="contentMarkdown"
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
        {mockData?.data}
      </ReactMarkdown>
    </main>
  );
};

export default Detail;
