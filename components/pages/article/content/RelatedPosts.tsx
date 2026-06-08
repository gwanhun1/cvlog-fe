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
      <section className="w-full">
        <h2 className="mb-3 text-sm font-semibold text-gray-500">관련 글</h2>
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="w-full">
      <h2 className="mb-3 text-sm font-semibold text-gray-500">관련 글</h2>
      <div className="flex flex-col gap-2">
        {posts.map(post => (
          <Link key={post.id} href={`/article/content/${post.id}`}>
            <a className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-100 bg-white hover:border-ftBlue/30 hover:bg-ftBlue/5 transition-all group">
              <span className="text-sm font-medium text-gray-700 group-hover:text-ftBlue line-clamp-1 flex-1">
                {post.title}
              </span>
              <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                {post.tags?.slice(0, 2).map(tag => (
                  <span
                    key={tag.id}
                    className="px-2 py-0.5 text-xs text-ftBlue bg-ftBlue/5 border border-ftBlue/20 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
                <time className="text-xs text-gray-400">
                  {post.created_at?.slice(0, 10)}
                </time>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
