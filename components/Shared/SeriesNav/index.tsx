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
      className="w-full rounded-2xl border border-ftBlue/20 bg-ftBlue/5 p-5"
    >
      <div className="flex items-center gap-1.5 mb-3">
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
        <h2 className="text-sm font-bold text-ftBlue truncate">
          시리즈 · {seriesName}
        </h2>
        <span className="flex-shrink-0 text-xs text-gray-400">
          ({data.length}편)
        </span>
      </div>
      <ol className="flex flex-col gap-0.5">
        {data.map((post, idx) => {
          const isCurrent = post.id === currentPostId;
          return (
            <li key={post.id}>
              {isCurrent ? (
                <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-white">
                  <span className="w-5 text-center text-xs font-bold text-ftBlue flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="flex-1 min-w-0 truncate text-sm font-semibold text-ftBlue">
                    {post.title}
                  </span>
                  <span className="flex-shrink-0 text-[10px] font-medium text-ftBlue/60">
                    현재 글
                  </span>
                </div>
              ) : (
                <Link
                  href={`/article/content/${post.id}`}
                  className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-white/70 transition-colors group"
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
