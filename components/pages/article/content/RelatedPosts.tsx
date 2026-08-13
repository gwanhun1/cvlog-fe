import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getRelatedPosts } from 'service/api/detail';
import type { RelatedPost } from 'service/api/detail/type';

interface RelatedPostsProps {
  postId: number;
}

export const RelatedPosts = ({ postId }: RelatedPostsProps) => {
  const [posts, setPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    getRelatedPosts(postId)
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading) {
    return (
      <section className="w-full" aria-labelledby="related-posts-title">
        <h2 id="related-posts-title" className="mb-4 text-xl font-bold text-slate-950">
          이어서 읽기
        </h2>
        <div className="border-t border-slate-200">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[76px] animate-pulse border-b border-slate-100 bg-slate-50" />
          ))}
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="w-full" aria-labelledby="related-posts-title">
      <h2 id="related-posts-title" className="mb-4 text-xl font-bold text-slate-950">
        이어서 읽기
      </h2>
      <div className="border-t border-slate-200">
        {posts.map(post => (
          <Link
            key={post.id}
            href={`/article/content/${post.id}`}
            className="group flex min-h-[64px] flex-col justify-center gap-2 border-b border-slate-200 py-3 transition-colors hover:text-ftBlue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ftBlue focus-visible:ring-offset-4 mobile:flex-row mobile:items-center mobile:justify-between"
          >
            <span className="line-clamp-2 flex-1 text-sm font-semibold leading-6 text-slate-700 group-hover:text-ftBlue">
              {post.title}
            </span>
            <div className="flex flex-shrink-0 items-center gap-2 mobile:ml-4">
              {post.tags?.slice(0, 2).map(tag => (
                <span
                  key={tag.id}
                  className="text-xs font-medium text-ftBlue"
                >
                  #{tag.name}
                </span>
              ))}
              <time className="text-xs text-slate-400">
                {post.created_at?.slice(0, 10)}
              </time>
              <span aria-hidden="true" className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-ftBlue">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
