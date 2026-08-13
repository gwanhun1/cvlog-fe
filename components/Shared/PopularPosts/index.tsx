import Link from 'next/link';
import { usePopularPosts } from 'service/hooks/Popular';

interface PopularPostsProps {
  limit?: number;
}

const PopularPosts = ({ limit = 3 }: PopularPostsProps) => {
  const { data, isLoading } = usePopularPosts(limit);

  if (isLoading) {
    return (
      <section aria-hidden className="border-t-2 border-slate-900 pt-4">
        <div className="mb-2 h-6 w-24 animate-pulse rounded bg-slate-200" />
        <div className="divide-y divide-slate-200">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="flex gap-4 py-5">
              <div className="h-4 w-6 animate-pulse rounded bg-slate-200" />
              <div className="h-10 flex-1 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <section
      aria-labelledby="popular-posts-title"
      className="border-t-2 border-slate-900 pt-4"
    >
      <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 pb-3">
        <h2
          id="popular-posts-title"
          className="m-0 text-[18px] font-bold tracking-[-0.025em] text-slate-950"
        >
          많이 읽은 글
        </h2>
        <span className="text-[11px] font-medium text-slate-400">
          누적 조회
        </span>
      </div>

      <ol className="m-0 list-none p-0">
        {data.map((post, index) => (
          <li
            key={post.id}
            className="border-b border-slate-200 last:border-b-0"
          >
            <Link
              href={`/article/content/${post.id}`}
              className="group grid grid-cols-[28px_minmax(0,1fr)] gap-3 py-5 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ftBlue focus-visible:ring-offset-2"
            >
              <span className="pt-0.5 font-mono text-[11px] font-bold text-ftBlue">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0">
                <strong className="line-clamp-2 block text-[15px] leading-[1.45] text-slate-800 transition-colors group-hover:text-ftBlue">
                  {post.title}
                </strong>
                <span className="mt-2 block text-[11px] text-slate-400">
                  조회 {post.view_count.toLocaleString()}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default PopularPosts;
