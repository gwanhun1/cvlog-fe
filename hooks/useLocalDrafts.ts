import { hasArticleDraftContent } from 'utils/draftStorage';
import { useEffect, useState } from 'react';
export interface LocalDraft { key: string; title: string; href: string; updatedAt: number }
export function useLocalDrafts() {
  const [drafts, setDrafts] = useState<LocalDraft[]>([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    const read = () => {
      try {
        const result: LocalDraft[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)!;
          if (key !== 'logme_draft_new' && key !== 'logme_resume_v2' && !/^logme_draft_edit_\d+$/.test(key)) continue;
          try { const data = JSON.parse(localStorage.getItem(key) || 'null'); if (!data) continue;
            if (key !== 'logme_resume_v2' && !hasArticleDraftContent(data, key)) continue;
            result.push({ key, title: data.title || data.basicInfo?.name || (key === 'logme_resume_v2' ? '작성 중인 이력서' : '제목 없는 글'), href: key === 'logme_resume_v2' ? '/resume' : key === 'logme_draft_new' ? '/article/new' : `/article/modify/${key.replace('logme_draft_edit_', '')}`, updatedAt: Number(localStorage.getItem(`${key}_updated_at`)) || 0 });
          } catch { /* retain malformed data without deleting */ }
        }
        setDrafts(result.sort((a,b) => b.updatedAt - a.updatedAt)); setError(false);
      } catch { setError(true); }
    };
    read(); window.addEventListener('storage', read); return () => window.removeEventListener('storage', read);
  }, []);
  return { drafts, error };
}
