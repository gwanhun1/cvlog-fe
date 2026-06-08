import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';

export const DRAFT_KEY = 'logme_draft_new';

interface DraftInfo {
  title: string;
}

export const useDraftResume = () => {
  const [showModal, setShowModal] = useState(false);
  const [draftInfo, setDraftInfo] = useState<DraftInfo | null>(null);
  const router = useRouter();

  const handleNewArticle = useCallback(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        const hasContent =
          draft.title?.trim() ||
          (draft.content?.trim() && draft.content.trim() !== '# Hello world') ||
          draft.tags?.length > 0;
        if (hasContent) {
          setDraftInfo({ title: draft.title?.trim() || '제목 없음' });
          setShowModal(true);
          return;
        }
      } catch {}
    }
    router.push('/article/new');
  }, [router]);

  const handleResume = useCallback(() => {
    setShowModal(false);
    router.push('/article/new');
  }, [router]);

  const handleFresh = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setShowModal(false);
    router.push('/article/new');
  }, [router]);

  const handleClose = useCallback(() => setShowModal(false), []);

  return { handleNewArticle, showModal, draftInfo, handleResume, handleFresh, handleClose };
};
