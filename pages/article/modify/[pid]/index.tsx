import { useState, useEffect, useRef } from 'react';
import { GetServerSideProps } from 'next';
import 'easymde/dist/easymde.min.css';

import ModifyBtn from 'components/pages/article/modify/ModifyBtn';
import ModifyContents from 'components/pages/article/modify/ModifyContents';
import { useGetMyDetail } from 'service/hooks/Detail';

export type DocType = {
  title: string;
  content: string;
  tags: string[];
};

interface ModifyPostProps {
  pid: string;
}

const ModifyPost = ({ pid }: ModifyPostProps) => {
  const [doc, setDoc] = useState<DocType>({
    title: '',
    content: '',
    tags: [],
  });
  const [isVisiblePreview, setIsVisiblePreview] = useState(true);
  const [imageArr, setImageArr] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const containerTopRef = useRef<HTMLDivElement>(null);

  const { data: detailData, isSuccess: isDetailSuccess } = useGetMyDetail(
    parseInt(pid)
  );

  useEffect(() => {
    if (isDetailSuccess && detailData?.post) {
      const { title, content, tags } = detailData.post;
      const tagNames = tags?.map(tag => tag.name) || [];

      setDoc({
        title: title || '',
        content: content || '',
        tags: tagNames,
      });
    }
  }, [isDetailSuccess, detailData]);

  useEffect(() => {
    if (
      containerTopRef.current &&
      containerTopRef.current.scrollHeight >
        containerTopRef.current.clientHeight
    ) {
      containerTopRef.current.scrollTop =
        containerTopRef.current.scrollHeight -
        containerTopRef.current.clientHeight;
    }
  }, [doc]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className="h-screen min-h-screen">
      <div className="flex flex-col h-full">
        <div className="bg-[#f8f9fa]">
          <header className="flex-none">
            <ModifyBtn
              doc={doc}
              setDoc={setDoc}
              pid={pid}
              imageArr={imageArr}
            />
          </header>

          <main className="relative flex flex-col justify-center flex-1 w-full tablet:flex-row">
            <ModifyContents
              doc={doc}
              setDoc={setDoc}
              setImageArr={setImageArr}
              isVisiblePreview={isVisiblePreview}
              containerTopRef={containerTopRef}
              isMobile={isMobile}
            />
          </main>
        </div>
      </div>
    </main>
  );
};

export default ModifyPost;

export const getServerSideProps: GetServerSideProps = async context => {
  const pid = context.params?.pid;
  return { props: { pid } };
};
