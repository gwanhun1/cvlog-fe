import { saveLocalDraft } from 'utils/draftStorage';
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
  const [pendingDraft, setPendingDraft] = useState<DocType | null>(null);
  const [saveStatus, setSaveStatus] = useState('수정 내용은 이 기기에 임시 저장됩니다.');
  const [doc, setDoc] = useState<DocType>({ title: '', content: '', tags: [] });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVisiblePreview, setIsVisiblePreview] = useState(true);
  const [imageArr, setImageArr] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const containerTopRef = useRef<HTMLDivElement>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canAutoSaveRef = useRef(true);

  const draftKey = `logme_draft_edit_${pid}`;

  const {
    data: detailData,
    isLoading,
    isSuccess: isDetailSuccess,
  } = useGetMyDetail(parseInt(pid));

  useEffect(() => {
    if (isDetailSuccess && detailData?.post) {
      const { title, content, tags, series, series_order } = detailData.post;
      setDoc({
        title: title || '',
        content: content || '',
        tags: tags?.map(tag => tag.name) || [],
        series: series || '',
        series_order: series_order ?? null,
      });
      try {
        const saved = JSON.parse(localStorage.getItem(draftKey) || 'null');
        if (saved && typeof saved.title === 'string' && typeof saved.content === 'string' && Array.isArray(saved.tags) && (saved.content !== content || saved.title !== title || JSON.stringify(saved.tags) !== JSON.stringify(tags?.map(t => t.name) || []))) setPendingDraft(saved);
      } catch { /* malformed local draft */ }
      setIsInitialized(true);
    }
  }, [isDetailSuccess, detailData]);

  // 초기 로드 이후만 자동저장 (서버 데이터로 덮어쓰기 방지)
  useEffect(() => {
    if (!isInitialized || pendingDraft) return;

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      if (!canAutoSaveRef.current) return;
      setSaveStatus(saveLocalDraft(draftKey, doc) ? '이 기기에 임시 저장됨 · 게시글 반영은 저장 버튼을 눌러주세요.' : '임시 저장 실패 · 내용을 복사해 보관해주세요.');
    }, 1000);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [doc, draftKey, isInitialized, pendingDraft]);

  const discardDraft = useCallback(() => {
    canAutoSaveRef.current = false;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
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
      <main className="min-h-screen min-h-[100dvh] tablet:h-screen tablet:overflow-hidden px-2 tablet:px-10">
        <div className="flex flex-col tablet:h-full tablet:min-h-0">
          <header className="flex-none">
            <p role="status" className="px-3 pt-3 text-xs text-slate-600">{saveStatus}</p>
            <EditorHeader
              doc={doc}
              setDoc={setDoc}
              imageArr={imageArr}
              mode="edit"
              pid={pid}
              isVisiblePreview={isVisiblePreview}
              onTogglePreview={() => setIsVisiblePreview(v => !v)}
              onSaveSuccess={discardDraft}
              onCancel={() => { canAutoSaveRef.current = false; if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current); if (!pendingDraft) saveLocalDraft(draftKey, doc); }}
              draftTitle={pendingDraft ? pendingDraft.title || '수정 중인 글' : undefined}
              onRestoreDraft={() => { if (pendingDraft) setDoc(pendingDraft); setPendingDraft(null); }}
              onDiscardDraft={() => { localStorage.removeItem(draftKey); setPendingDraft(null); }}
            />
          </header>
          <div className="flex flex-col flex-1 w-full tablet:flex-row tablet:min-h-0">
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
