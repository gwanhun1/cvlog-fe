import { useState, useEffect, useRef, useCallback } from 'react';
import { NextPage } from 'next';
import AuthGuard from 'components/Shared/common/AuthGuard';

import {
  EditorHeader,
  EditorContents,
  DocType,
} from '../../../components/pages/article/editor';
import { EDITOR_CONSTANTS } from 'lib/constants';

const DRAFT_KEY = 'logme_draft_new';

const INIT_USER_INPUT: DocType = {
  title: '',
  content: '# Hello world',
  tags: [],
};

const NewPost: NextPage = () => {
  const [doc, setDoc] = useState<DocType>(INIT_USER_INPUT);
  const [isVisiblePreview, setIsVisiblePreview] = useState(true);
  const [imageArr, setImageArr] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const containerTopRef = useRef<HTMLDivElement>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 저장된 임시글 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return;
    try {
      const draft = JSON.parse(saved) as DocType;
      if (draft.title || draft.content !== INIT_USER_INPUT.content || draft.tags.length > 0) {
        setDoc(draft);
      }
    } catch {}
  }, []);

  // 1초 디바운스 자동저장
  useEffect(() => {
    const hasContent =
      doc.title.trim() !== '' ||
      (doc.content.trim() !== '' && doc.content.trim() !== '# Hello world') ||
      doc.tags.length > 0;

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      if (hasContent) localStorage.setItem(DRAFT_KEY, JSON.stringify(doc));
    }, 1000);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [doc]);

  const handleSaveSuccess = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
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
      <main className="min-h-screen tablet:h-screen px-2 tablet:px-10">
        <div className="flex flex-col tablet:h-full">
          <header className="flex-none">
            <EditorHeader
              doc={doc}
              setDoc={setDoc}
              imageArr={imageArr}
              mode="create"
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

export default NewPost;
