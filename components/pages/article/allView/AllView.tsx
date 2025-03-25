import { useEffect, useState, useRef, useCallback } from 'react';
import { useGetPublicList } from 'service/hooks/List';
import CardSkeleton from './Skeleton';
import { useRouter } from 'next/router';
import { BlogType } from 'service/api/tag/type';
import { useRecoilState } from 'recoil';
import { listIndexAtom } from 'service/atoms/atoms';
import Link from 'next/link';
import Card from 'components/Shared/LogmeCard';
import ListEmpty from '../../../Shared/common/ListEmpty';

interface AllViewProps {
  inputRef: React.RefObject<HTMLInputElement>;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
}

const AllView = ({ inputRef, setKeyword }: AllViewProps) => {
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<BlogType[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const { data: List } = useGetPublicList(page);

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
      <div className="flex flex-col gap-4 ">
        <div
          className={`${
            posts.length === 0
              ? 'bg-white rounded-2xl shadow-lg border border-gray-100'
              : 'masonry-grid'
          }`}
        >
          {posts.length > 0 ? (
            <>
              {posts.map(({ id, title, content, tags, updated_at }, index) => (
                <div key={id} className="masonry-item break-inside-avoid">
                  <Link
                    href={`/article/content/all/${id}`}
                    onClick={() => saveListIndex(index)}
                    className="block h-full"
                    title={title}
                  >
                    <Card
                      title={title}
                      content={content}
                      tags={tags}
                      updated_at={updated_at}
                    />
                  </Link>
                </div>
              ))}

              <div
                ref={loadingRef}
                className="w-full flex flex-col items-center my-4"
              >
                {!hasMore && !isInitialLoading && (
                  <div className="text-gray-300 text-sm py-4">
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
        <div className="masonry-grid w-full">
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

export default AllView;
