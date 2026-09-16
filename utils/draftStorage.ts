export const hasArticleDraftContent = (value: unknown, key: string): boolean => {
  if (!value || typeof value !== 'object') return false;
  const draft = value as { title?: unknown; content?: unknown; tags?: unknown };
  const title = typeof draft.title === 'string' ? draft.title.trim() : '';
  const content = typeof draft.content === 'string' ? draft.content.trim() : '';
  return Boolean(
    title ||
    (content && !(key === 'logme_draft_new' && content === '# Hello world')) ||
    (Array.isArray(draft.tags) && draft.tags.some(tag => typeof tag === 'string' && tag.trim() !== ''))
  );
};

// 작성자의 명시적인 삭제 전까지 임시글을 보존한다. 기존 호출부와의 호환용 함수.
export const isDraftFresh = (_updatedAtKey: string) => true;

export const markDraftUpdated = (updatedAtKey: string) => {
  localStorage.setItem(updatedAtKey, String(Date.now()));
};

export const clearDraftStorage = (...keys: string[]) => {
  keys.forEach(key => localStorage.removeItem(key));
};

export const saveLocalDraft = (key: string, value: unknown): boolean => {
  try {
    if ((key === 'logme_draft_new' || /^logme_draft_edit_\d+$/.test(key)) && !hasArticleDraftContent(value, key)) {
      clearDraftStorage(key, `${key}_updated_at`);
      return true;
    }
    localStorage.setItem(key, JSON.stringify(value));
    markDraftUpdated(`${key}_updated_at`);
    return true;
  } catch { return false; }
};
