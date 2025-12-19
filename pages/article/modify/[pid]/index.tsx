import { useState, useEffect, useRef } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import 'easymde/dist/easymde.min.css';

import {
  EditorHeader,
  EditorContents,
  DocType,
} from 'components/pages/article/editor';
import { useGetMyDetail } from 'service/hooks/Detail';
import LoaderAnimation from 'components/Shared/common/LoaderAnimation';
import { EDITOR_CONSTANTS } from 'lib/constants';

interface ModifyPostProps {
  pid: string;
}

const ModifyPost: NextPage<ModifyPostProps> = ({ pid }) => {
  const [doc, setDoc] = useState<DocType>({
    title: '',
    content: '',
    tags: [],
  });
  const [isVisiblePreview, setIsVisiblePreview] = useState(true);
  const [imageArr, setImageArr] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const containerTopRef = useRef<HTMLDivElement>(null);

  const {
    data: detailData,
    isLoading,
    isSuccess: isDetailSuccess,
  } = useGetMyDetail(parseInt(pid));

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
      setIsMobile(window.innerWidth < EDITOR_CONSTANTS.MOBILE_BREAKPOINT);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isLoading && <LoaderAnimation />}

      <main className="h-screen min-h-screen mx-2 tablet:px-10">
        <div className="flex flex-col h-full">
          <header className="flex-none">
            <EditorHeader
              doc={doc}
              setDoc={setDoc}
              imageArr={imageArr}
              mode="edit"
              pid={pid}
            />
          </header>

          <main className="relative flex flex-col justify-center flex-1 w-full tablet:flex-row">
            <EditorContents
              doc={doc}
              setDoc={setDoc}
              setImageArr={setImageArr}
              isVisiblePreview={isVisiblePreview}
              containerTopRef={containerTopRef}
              isMobile={isMobile}
            />
          </main>
        </div>
      </main>
    </>
  );
};

export default ModifyPost;

export const getServerSideProps: GetServerSideProps = async context => {
  const pid = context.params?.pid;
  return { props: { pid } };
};
