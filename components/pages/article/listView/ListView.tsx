import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import Card from 'components/Shared/LogmeCard';
import { listIndexAtom } from 'service/atoms/atoms';
import { useGetList } from 'service/hooks/List';
import CardSkeleton from './Skeleton';
import ListEmpty from '../../../Shared/common/ListEmpty';
import { useRouter } from 'next/router';
import { BlogType } from 'service/api/tag/type';

interface ListViewProps {
  inputRef: React.RefObject<HTMLInputElement>;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
}

const ListView = ({ inputRef, setKeyword }: ListViewProps) => {
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<BlogType[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const List = useGetList(page);
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

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
    if (List.data) {
      if (page === 1) {
        setPosts(List.data.posts);
        setIsInitialLoading(false);
      } else {
        setPosts(prev => [...prev, ...List.data.posts]);
        setIsLoadingMore(false);
      }

      if (page >= List.data.maxPage) {
        setHasMore(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [List.data]);

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
                    href={`/article/content/${id}`}
                    onClick={() => saveListIndex(index)}
                    prefetch={true}
                    className="block h-full"
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

export default ListView;
