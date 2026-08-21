import { useState, useEffect, useRef, useCallback } from 'react';
import { NextPage } from 'next';
import AuthGuard from 'components/Shared/common/AuthGuard';

import {
  EditorHeader,
  EditorContents,
  DocType,
} from '../../../components/pages/article/editor';
import { EDITOR_CONSTANTS } from 'lib/constants';
import { clearDraftStorage, isDraftFresh, markDraftUpdated } from 'utils/draftStorage';

const DRAFT_KEY = 'logme_draft_new';
const DRAFT_UPDATED_AT_KEY = 'logme_draft_new_updated_at';

const INIT_USER_INPUT: DocType = {
  title: '',
  content: '# Hello world',
  tags: [],
};

const NewPost: NextPage = () => {
  const [doc, setDoc] = useState<DocType>(INIT_USER_INPUT);
  const [isVisiblePreview, setIsVisiblePreview] = useState(true);
  const [imageArr, setImageArr] = useState<string[]>([]);
  const [pendingDraft, setPendingDraft] = useState<DocType | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerTopRef = useRef<HTMLDivElement>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canAutoSaveRef = useRef(true);
  const draftPendingRef = useRef(false);

  // 저장된 임시글 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return;
    if (!isDraftFresh(DRAFT_UPDATED_AT_KEY)) {
      clearDraftStorage(DRAFT_KEY, DRAFT_UPDATED_AT_KEY);
      return;
    }
    try {
      const draft = JSON.parse(saved) as DocType;
      if (
        typeof draft.title === 'string' &&
        typeof draft.content === 'string' &&
        Array.isArray(draft.tags) &&
        (draft.title || draft.content !== INIT_USER_INPUT.content || draft.tags.length > 0)
      ) {
        draftPendingRef.current = true;
        setPendingDraft(draft);
      }
    } catch {
      clearDraftStorage(DRAFT_KEY, DRAFT_UPDATED_AT_KEY);
    }
  }, []);

  // 1초 디바운스 자동저장
  useEffect(() => {
    const hasContent =
      doc.title.trim() !== '' ||
      (doc.content.trim() !== '' && doc.content.trim() !== '# Hello world') ||
      doc.tags.length > 0;

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      if (!canAutoSaveRef.current) return;
      if (draftPendingRef.current) {
        if (!hasContent) return;
        draftPendingRef.current = false;
        setPendingDraft(null);
      }
      if (hasContent) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(doc));
        markDraftUpdated(DRAFT_UPDATED_AT_KEY);
      } else {
        clearDraftStorage(DRAFT_KEY, DRAFT_UPDATED_AT_KEY);
      }
    }, 1000);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [doc]);

  const discardDraft = useCallback(() => {
    canAutoSaveRef.current = false;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    clearDraftStorage(DRAFT_KEY, DRAFT_UPDATED_AT_KEY);
  }, []);

  const handleRestoreDraft = useCallback(() => {
    if (pendingDraft) setDoc(pendingDraft);
    draftPendingRef.current = false;
    setPendingDraft(null);
  }, [pendingDraft]);

  const handleDeleteDraft = useCallback(() => {
    clearDraftStorage(DRAFT_KEY, DRAFT_UPDATED_AT_KEY);
    draftPendingRef.current = false;
    setPendingDraft(null);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < EDITOR_CONSTANTS.MOBILE_BREAKPOINT);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const hasUnsavedChanges =
      doc.title.trim() !== '' ||
      (doc.content.trim() !== '' && doc.content.trim() !== '# Hello world');

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
      <main className="min-h-screen min-h-[100dvh] tablet:h-screen tablet:overflow-hidden px-2 tablet:px-10">
        <div className="flex flex-col tablet:h-full tablet:min-h-0">
          <header className="flex-none">
            <EditorHeader
              doc={doc}
              setDoc={setDoc}
              imageArr={imageArr}
              mode="create"
              isVisiblePreview={isVisiblePreview}
              onTogglePreview={() => setIsVisiblePreview(v => !v)}
              onSaveSuccess={discardDraft}
              onCancel={discardDraft}
              draftTitle={
                pendingDraft ? pendingDraft.title.trim() || '제목 없음' : undefined
              }
              onRestoreDraft={handleRestoreDraft}
              onDiscardDraft={handleDeleteDraft}
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

export default NewPost;
