import { useEffect, useRef, useCallback } from 'react';
import { useGetLikedPosts } from 'service/hooks/Like';
import CardSkeleton from './Skeleton';
import Link from 'next/link';
import Card from 'components/Shared/LogmeCard';
import ListEmpty from 'components/Shared/common/ListEmpty';

const LikedListContainer = () => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetLikedPosts();

  const loadingRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = loadingRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, handleLoadMore]);

  const allPosts = data?.pages.flatMap(page => page.posts) ?? [];

  const initialSkeleton = (
    <div className="gap-4 w-full columns-1 tablet:columns-2 desktop:columns-3">
      {[...Array(6)].map((_, index) => (
        <div key={`liked-skeleton-${index}`} className="mb-4 break-inside-avoid">
          <CardSkeleton />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        {isLoading ? (
          initialSkeleton
        ) : allPosts.length > 0 ? (
          <div className="gap-4 w-full columns-1 tablet:columns-2 desktop:columns-3">
            {allPosts.map(({ id, title, content, user, created_at, like_count }) => (
              <div key={id} className="mb-4 break-inside-avoid">
                <Link href={`/article/content/${id}`}>
                  <div className="block h-full cursor-pointer">
                    <Card
                      title={title}
                      content={content}
                      tags={[]}
                      updated_at={created_at}
                      user={user}
                    />
                  </div>
                </Link>
              </div>
            ))}
            {isFetchingNextPage && (
              <>
                {[...Array(3)].map((_, index) => (
                  <div key={`liked-more-skeleton-${index}`} className="mb-4 break-inside-avoid">
                    <CardSkeleton />
                  </div>
                ))}
              </>
            )}
          </div>
        ) : (
          <ListEmpty
            message="좋아요한 글이 없어요"
            subMessage="마음에 드는 글에 좋아요를 눌러보세요"
          />
        )}
      </div>

      <div ref={loadingRef} className="flex flex-col items-center mt-8 mb-4 w-full">
        {!hasNextPage && !isLoading && allPosts.length > 0 && (
          <div className="py-4 text-sm text-ftGray">모든 게시물을 불러왔습니다</div>
        )}
      </div>
    </div>
  );
};

export default LikedListContainer;
