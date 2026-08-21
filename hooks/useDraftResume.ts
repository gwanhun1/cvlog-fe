import { useCallback } from 'react';
import { useRouter } from 'next/router';

export const DRAFT_KEY = 'logme_draft_new';
export const DRAFT_UPDATED_AT_KEY = 'logme_draft_new_updated_at';

export const useDraftResume = () => {
  const router = useRouter();

  const handleNewArticle = useCallback(() => {
    router.push('/article/new');
  }, [router]);

  return { handleNewArticle };
};
