import Link from 'next/link';
import { usePopularPosts } from 'service/hooks/Popular';

interface PopularPostsProps {
  limit?: number;
}

/**
 * 조회수 상위 공개 글을 보여주는 '인기 글' 위젯.
 * 내부 링크를 늘려 회유(체류)·SEO에 기여한다. 데이터가 없으면 렌더하지 않는다.
 */
const PopularPosts = ({ limit = 5 }: PopularPostsProps) => {
  const { data, isLoading } = usePopularPosts(limit);

  // 로딩 중엔 동일 골격의 스켈레톤으로 공간을 미리 확보해 갑툭튀(CLS)를 막는다
  if (isLoading) {
    return (
      <section aria-hidden className="p-4 rounded-2xl bg-white shadow-sm">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-4 h-4 rounded bg-gray-100 animate-pulse" />
          <div className="w-14 h-4 rounded bg-gray-100 animate-pulse" />
        </div>
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="h-[26px] rounded bg-gray-50 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <section
      aria-label="인기 글"
      className="p-4 rounded-2xl bg-white shadow-sm"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span aria-hidden>🔥</span>
        <h2 className="text-sm font-bold text-ftBlack">인기 글</h2>
      </div>
      <ol className="flex flex-col">
        {data.map((post, idx) => (
          <li key={post.id}>
            <Link
              href={`/article/content/${post.id}`}
              className="flex items-center gap-2.5 py-1.5 group"
            >
              <span
                className={`w-5 text-center text-sm font-bold flex-shrink-0 ${
                  idx < 3 ? 'text-ftBlue' : 'text-gray-300'
                }`}
              >
                {idx + 1}
              </span>
              <span className="flex-1 min-w-0 truncate text-sm text-gray-700 group-hover:text-ftBlue transition-colors">
                {post.title}
              </span>
              <span className="flex items-center gap-0.5 text-xs text-gray-400 flex-shrink-0">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                {post.view_count.toLocaleString()}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default PopularPosts;
