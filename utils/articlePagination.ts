export const publicArticlePagePath = (page: number) =>
  page === 1 ? '/article' : `/article/page/${page}`;

export const parseArticlePage = (value: string | string[] | undefined) => {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return null;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : null;
};
