import { useState, useEffect, useRef, useCallback } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import AuthGuard from 'components/Shared/common/AuthGuard';

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
  const [doc, setDoc] = useState<DocType>({ title: '', content: '', tags: [] });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVisiblePreview, setIsVisiblePreview] = useState(true);
  const [imageArr, setImageArr] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const containerTopRef = useRef<HTMLDivElement>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const draftKey = `logme_draft_edit_${pid}`;

  const {
    data: detailData,
    isLoading,
    isSuccess: isDetailSuccess,
  } = useGetMyDetail(parseInt(pid));

  useEffect(() => {
    if (isDetailSuccess && detailData?.post) {
      const { title, content, tags } = detailData.post;
      setDoc({
        title: title || '',
        content: content || '',
        tags: tags?.map(tag => tag.name) || [],
      });
      setIsInitialized(true);
    }
  }, [isDetailSuccess, detailData]);

  // 초기 로드 이후만 자동저장 (서버 데이터로 덮어쓰기 방지)
  useEffect(() => {
    if (!isInitialized) return;

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      localStorage.setItem(draftKey, JSON.stringify(doc));
    }, 1000);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [doc, draftKey, isInitialized]);

  const handleSaveSuccess = useCallback(() => {
    localStorage.removeItem(draftKey);
  }, [draftKey]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < EDITOR_CONSTANTS.MOBILE_BREAKPOINT);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const hasUnsavedChanges = doc.title.trim() !== '' || doc.content.trim() !== '';

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [doc.title, doc.content]);

  return (
    <AuthGuard>
      {isLoading && <LoaderAnimation />}
      <main className="min-h-screen tablet:h-screen px-2 tablet:px-10">
        <div className="flex flex-col tablet:h-full">
          <header className="flex-none">
            <EditorHeader
              doc={doc}
              setDoc={setDoc}
              imageArr={imageArr}
              mode="edit"
              pid={pid}
              isVisiblePreview={isVisiblePreview}
              onTogglePreview={() => setIsVisiblePreview(v => !v)}
              onSaveSuccess={handleSaveSuccess}
            />
          </header>
          <div className="flex flex-col flex-1 w-full tablet:flex-row">
            <EditorContents
              doc={doc}
              setDoc={setDoc}
              setImageArr={setImageArr}
              isVisiblePreview={isVisiblePreview}
              containerTopRef={containerTopRef}
              isMobile={isMobile}
            />
          </div>
        </div>
      </main>
    </AuthGuard>
  );
};

export default ModifyPost;

export const getServerSideProps: GetServerSideProps = async context => {
  const pid = context.params?.pid;
  return { props: { pid } };
};
