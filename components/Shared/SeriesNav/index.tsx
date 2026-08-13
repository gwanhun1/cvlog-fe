import Link from 'next/link';
import { useSeriesPosts } from 'service/hooks/Series';

interface SeriesNavProps {
  seriesName?: string | null;
  currentPostId?: number;
}

/**
 * 같은 연재(시리즈)에 속한 글들을 순번대로 보여주는 네비게이션.
 * 시리즈명이 없거나 글이 1편 이하면(=연재로 볼 게 없으면) 렌더하지 않는다.
 */
const SeriesNav = ({ seriesName, currentPostId }: SeriesNavProps) => {
  const { data } = useSeriesPosts(seriesName);

  if (!seriesName || !data || data.length <= 1) return null;

  return (
    <section
      aria-label="시리즈"
      className="w-full border-y border-ftBlue/20 py-3"
    >
      <div className="mb-3 flex items-center gap-2">
        <svg
          className="w-4 h-4 text-ftBlue"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h2 className="truncate text-sm font-bold text-ftBlue">
          {seriesName}
        </h2>
        <span className="flex-shrink-0 text-xs text-slate-400">
          {data.findIndex(post => post.id === currentPostId) + 1} / {data.length}편
        </span>
      </div>
      <ol className="flex flex-col">
        {data.map((post, idx) => {
          const isCurrent = post.id === currentPostId;
          return (
            <li key={post.id}>
              {isCurrent ? (
                <div className="flex items-center gap-2 border-l-2 border-ftBlue py-1.5 pl-3">
                  <span className="w-5 text-center text-xs font-bold text-ftBlue flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="flex-1 min-w-0 truncate text-sm font-semibold text-ftBlue">
                    {post.title}
                  </span>
                  <span className="flex-shrink-0 text-[11px] font-medium text-ftBlue/60">
                    현재 글
                  </span>
                </div>
              ) : (
                <Link
                  href={`/article/content/${post.id}`}
                  className="group flex items-center gap-2 border-l-2 border-transparent py-1.5 pl-3 transition-colors hover:border-ftBlue/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ftBlue"
                >
                  <span className="w-5 text-center text-xs font-bold text-gray-400 flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="flex-1 min-w-0 truncate text-sm text-gray-600 group-hover:text-ftBlue transition-colors">
                    {post.title}
                  </span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default SeriesNav;
