import { useEffect, useState, useRef, useCallback } from 'react';
import { useGetPublicList, useGetList } from 'service/hooks/List';
import CardSkeleton from './Skeleton';
import { useRouter } from 'next/router';
import { BlogType } from 'service/api/tag/type';
import { useRecoilState } from 'recoil';
import { listIndexAtom } from 'service/atoms/atoms';
import Link from 'next/link';
import Card from 'components/Shared/LogmeCard';
import ListEmpty from '../../../Shared/common/ListEmpty';

interface PostListViewProps {
  inputRef: React.RefObject<HTMLInputElement>;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  mode: 'public' | 'my';
  initialPosts?: BlogType[];
}

const PostListView = ({
  inputRef,
  setKeyword,
  mode,
  initialPosts,
}: PostListViewProps) => {
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<BlogType[]>(initialPosts || []);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(
    mode === 'public' ? !(initialPosts && initialPosts.length > 0) : true
  );
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // mode에 따라 필요한 훅만 호출 (성능 최적화)
  const publicList = useGetPublicList(page, mode === 'public');
  const myList = useGetList(page, undefined, mode === 'my');
  const List = mode === 'public' ? publicList.data : myList.data;

  const { tagKeyword } = router.query;

  useEffect(() => {
    const normalizedKeyword = tagKeyword
      ? String(tagKeyword).trim().toLowerCase()
      : '';
    setKeyword(normalizedKeyword);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, setKeyword, tagKeyword]);

  const loadMorePosts = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      setPage(prevPage => prevPage + 1);
    }
  }, [hasMore, isLoadingMore]);

  useEffect(() => {
    if (List) {
      if (page === 1) {
        setPosts(List.posts);
        setIsInitialLoading(false);
      } else {
        setPosts(prev => [...prev, ...List.posts]);
        setIsLoadingMore(false);
      }

      if (page >= List.maxPage) {
        setHasMore(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [List]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    const currentLoadingRef = loadingRef.current;
    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }

    return () => {
      if (currentLoadingRef && observerRef.current) {
        observerRef.current.unobserve(currentLoadingRef);
      }
    };
  }, [hasMore, isLoadingMore, isInitialLoading, loadMorePosts]);

  const [, setListIndex] = useRecoilState(listIndexAtom);
  const saveListIndex = (params: number) => {
    setListIndex(params);
  };

  // mode에 따른 링크 경로
  const getPostLink = (id: number) =>
    mode === 'public' ? `/article/content/all/${id}` : `/article/content/${id}`;

  // mode에 따른 빈 목록 스타일
  const emptyContainerClass =
    mode === 'public'
      ? 'bg-white rounded-2xl shadow-lg border border-gray-100'
      : 'bg-white/90 backdrop-blur rounded-2xl border border-ftBlue/15';

  // mode에 따른 끝 메시지 색상
  const endMessageClass = mode === 'public' ? 'text-gray-300' : 'text-ftGray';

  if (isInitialLoading) {
    return (
      <div className="masonry-grid">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="masonry-item break-inside-avoid">
            <div className="block h-full">
              <CardSkeleton />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div
          className={`${
            posts.length === 0 ? emptyContainerClass : 'masonry-grid'
          }`}
        >
          {posts.length > 0 ? (
            <>
              {posts.map(({ id, title, content, tags, updated_at }, index) => (
                <div key={id} className="masonry-item break-inside-avoid">
                  <Link
                    href={getPostLink(id)}
                    onClick={() => saveListIndex(index)}
                    className="block h-full"
                    {...(mode === 'public' && {
                      title: title,
                      'aria-label': `게시물 보기: ${title}`,
                      'data-seo-important': 'true',
                    })}
                  >
                    {mode === 'public' ? (
                      <div
                        itemScope
                        itemType="https://schema.org/BlogPosting"
                        className="w-full"
                      >
                        <meta
                          itemProp="mainEntityOfPage"
                          content={`https://logme.shop/article/content/all/${id}`}
                        />
                        <meta itemProp="headline" content={title} />
                        <meta itemProp="dateModified" content={updated_at} />
                        <Card
                          title={title}
                          content={content}
                          tags={tags}
                          updated_at={updated_at}
                        />
                      </div>
                    ) : (
                      <Card
                        title={title}
                        content={content}
                        tags={tags}
                        updated_at={updated_at}
                      />
                    )}
                  </Link>
                </div>
              ))}

              <div
                ref={loadingRef}
                className="flex flex-col items-center my-4 w-full"
              >
                {!hasMore && !isInitialLoading && (
                  <div className={`py-4 text-sm ${endMessageClass}`}>
                    모든 게시물을 불러왔습니다
                  </div>
                )}
              </div>
            </>
          ) : (
            <ListEmpty />
          )}
        </div>
      </div>

      {hasMore && isLoadingMore && (
        <div className="w-full masonry-grid">
          {[...Array(3)].map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="masonry-item break-inside-avoid"
            >
              <div className="block h-full">
                <CardSkeleton />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PostListView;
