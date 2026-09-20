import Link from 'next/link';
import { publicArticlePagePath } from 'utils/articlePagination';

export default function ArticlePagination({
  page,
  maxPage,
}: {
  page: number;
  maxPage: number;
}) {
  if (maxPage <= 1) return null;
  const linkClass =
    'inline-flex min-h-[44px] items-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:border-ftBlue hover:text-ftBlue focus-visible:ring-2 focus-visible:ring-ftBlue focus-visible:ring-offset-2';
  return (
    <nav
      aria-label="게시물 페이지"
      className="mt-6 flex items-center justify-center gap-4"
    >
      {page > 1 && (
        <Link
          href={publicArticlePagePath(page - 1)}
          prefetch={false}
          rel="prev"
          className={linkClass}
        >
          이전 페이지
        </Link>
      )}
      <span aria-current="page" className="text-sm text-slate-500">
        {page} / {maxPage}
      </span>
      {page < maxPage && (
        <Link
          href={publicArticlePagePath(page + 1)}
          prefetch={false}
          rel="next"
          className={linkClass}
        >
          다음 페이지
        </Link>
      )}
    </nav>
  );
}
