import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import Card from 'components/Shared/LogmeCard';
import { listIndexAtom, tagAtom } from 'service/atoms/atoms';
import { useGetList } from 'service/hooks/List';
import CardSkeleton from './Skeleton';
import FilterBox from './FilterBox';
import ListEmpty from './ListEmpty';
import { useRouter } from 'next/router';
import { BlogType, TagType } from 'service/api/tag/type';

const ListView = () => {
  const [page, setPage] = useState<number>(1);
  const [keyword, setKeyword] = useRecoilState(tagAtom);
  const [posts, setPosts] = useState<BlogType[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const List = useGetList(page);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
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
  }, [setKeyword, tagKeyword]);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setIsInitialLoading(true);
  }, [keyword]);

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
        if (
          entry.isIntersecting &&
          hasMore &&
          !isLoadingMore &&
          !isInitialLoading
        ) {
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
          <div key={index} className="masonry-item">
            <CardSkeleton />
          </div>
        ))}
      </div>
    );
  }
  const filteredPosts = posts
    ? posts.filter(item => {
        const titleMatch = item.title
          ? item.title.toLowerCase().includes((keyword || '').toLowerCase())
          : false;

        const tagMatch = item.tags.some((tag: TagType) =>
          tag.name
            ? tag.name.toLowerCase().includes((keyword || '').toLowerCase())
            : false
        );

        return titleMatch || tagMatch;
      })
    : [];

  return (
    <div className="flex flex-col gap-4 ">
      <FilterBox
        keyword={keyword}
        setKeyword={setKeyword}
        inputRef={inputRef}
      />
      <div
        className={`${
          filteredPosts.length === 0
            ? 'bg-white rounded-2xl shadow-lg border border-gray-100'
            : 'masonry-grid'
        }`}
      >
        {filteredPosts.length > 0 ? (
          <>
            {filteredPosts.map(
              ({ id, title, content, tags, updated_at }, index) => (
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
              )
            )}

            <div
              ref={loadingRef}
              className="w-full flex flex-col items-center my-4"
            >
              {hasMore && isLoadingMore && (
                <div className="masonry-grid w-full">
                  {[...Array(3)].map((_, index) => (
                    <div key={`skeleton-${index}`} className="masonry-item">
                      <CardSkeleton />
                    </div>
                  ))}
                </div>
              )}

              {!hasMore && (
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
  );
};

export default ListView;
