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
    localStorage.setItem(key, JSON.stringify(value));
    markDraftUpdated(`${key}_updated_at`);
    return true;
  } catch { return false; }
};
