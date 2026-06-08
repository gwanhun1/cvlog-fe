import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getList } from 'service/api/tag';
import { useDraftResume } from 'hooks/useDraftResume';
import DraftResumeModal from 'components/Shared/DraftResumeModal';

interface Props {
  userId: number;
  topLanguages: string[];
}

interface PostItem {
  id: number;
  title: string;
  created_at: string;
  tags: { id: number; name: string }[];
}

const cardBase =
  'relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5';

const PenIcon = () => (
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const RelatedPostsCard = ({ userId, topLanguages }: Props) => {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleNewArticle, showModal, draftInfo, handleResume, handleFresh, handleClose } =
    useDraftResume();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchPosts = async () => {
      try {
        const result = await getList(1, userId);
        if (cancelled) return;
        const items = (result?.posts ?? []) as PostItem[];
        setPosts(items.slice(0, 6));
      } catch {
        if (!cancelled) setError('게시글을 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPosts();
    return () => { cancelled = true; };
  }, [userId]);

  // 게시글 태그가 GitHub 주요 언어와 일치하면 "관련" 표시
  const isRelated = (post: PostItem) =>
    post.tags.some(tag =>
      topLanguages.some(lang => lang.toLowerCase() === tag.name.toLowerCase()),
    );

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const d = Math.floor(diff / 86400000);
    if (d === 0) return '오늘';
    if (d < 30) return `${d}일 전`;
    if (d < 365) return `${Math.floor(d / 30)}달 전`;
    return `${Math.floor(d / 365)}년 전`;
  };

  return (
    <section className={cardBase}>
      <div className="p-5 space-y-4">
        {/* 헤더 */}
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-slate-400 mb-0.5">LOGME</div>
            <div className="text-lg font-semibold text-slate-900">나의 최근 글</div>
          </div>
          <button
            type="button"
            onClick={handleNewArticle}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-ftBlue/8 text-ftBlue hover:bg-ftBlue/15 transition-colors border border-ftBlue/15"
          >
            <PenIcon />
            새 글 쓰기
          </button>
        </div>

        {/* 로딩 */}
        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl animate-pulse bg-gray-100" />
            ))}
          </div>
        )}

        {/* 에러 */}
        {!loading && error && (
          <div className="px-4 py-3 text-sm text-red-500 bg-red-50 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {/* 빈 상태 */}
        {!loading && !error && posts.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
              <PenIcon />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">작성한 글이 없어요</p>
              <p className="mt-0.5 text-xs text-slate-400">첫 번째 글을 작성해보세요.</p>
            </div>
            <button
              type="button"
              onClick={handleNewArticle}
              className="px-4 py-2 text-xs font-semibold text-white rounded-lg bg-ftBlue hover:bg-[#1c3f7a] transition-colors"
            >
              글 작성하기
            </button>
          </div>
        )}

        {/* 게시글 목록 */}
        {!loading && !error && posts.length > 0 && (
          <div className="space-y-2">
            {posts.map(post => {
              const related = isRelated(post);
              return (
                <Link
                  key={post.id}
                  href={`/article/content/${post.id}`}
                  className="flex items-start gap-2.5 p-3 rounded-xl border border-transparent hover:border-ftBlue/15 hover:bg-ftBlue/[0.03] transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-medium text-ftBlack group-hover:text-ftBlue transition-colors truncate">
                        {post.title}
                      </span>
                      {related && (
                        <span className="flex-shrink-0 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-ftBlue/10 text-ftBlue border border-ftBlue/15">
                          GitHub 관련
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-slate-400">{timeAgo(post.created_at)}</span>
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag.id} className="text-[10px] text-slate-400">
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <svg className="h-3.5 w-3.5 text-slate-300 group-hover:text-ftBlue flex-shrink-0 mt-0.5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>
        )}

        {/* 전체 보기 */}
        {!loading && !error && posts.length > 0 && (
          <Link
            href="/article"
            className="block text-center py-2 text-xs font-medium text-ftGray hover:text-ftBlue transition-colors"
          >
            전체 글 보기 →
          </Link>
        )}
      </div>

      <DraftResumeModal
        isOpen={showModal}
        draftTitle={draftInfo?.title ?? ''}
        onResume={handleResume}
        onFresh={handleFresh}
        onClose={handleClose}
      />
    </section>
  );
};

export default RelatedPostsCard;
