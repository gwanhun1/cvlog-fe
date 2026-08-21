const DRAFT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30;

export const isDraftFresh = (updatedAtKey: string) => {
  const updatedAt = Number(localStorage.getItem(updatedAtKey));
  return Number.isFinite(updatedAt) && updatedAt > 0 && Date.now() - updatedAt <= DRAFT_MAX_AGE_MS;
};

export const markDraftUpdated = (updatedAtKey: string) => {
  localStorage.setItem(updatedAtKey, String(Date.now()));
};

export const clearDraftStorage = (...keys: string[]) => {
  keys.forEach(key => localStorage.removeItem(key));
};
