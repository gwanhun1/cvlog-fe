import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import { useGetList, useGetPublicList } from 'service/hooks/List';
import { BlogType, ListDataType } from 'service/api/tag/type';
import { useStore } from 'service/store/useStore';
import { useResponsiveColumnCount } from 'hooks/useResponsiveColumnCount';
import ListEmpty from '../../../Shared/common/ListEmpty';
import EditorialPostCard from './EditorialPostCard';
import CardSkeleton from './Skeleton';

interface PostListViewProps {
  inputRef: React.RefObject<HTMLInputElement>;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  mode: 'public' | 'my';
  initialList?: ListDataType;
  excludedPostId?: number;
}

interface MasonryItem {
  key: string;
  node: ReactNode;
}

const PostListView = ({
  inputRef,
  setKeyword,
  mode,
  initialList,
  excludedPostId,
}: PostListViewProps) => {
  const getVisiblePosts = useCallback(
    (nextPosts: BlogType[]) =>
      excludedPostId
        ? nextPosts.filter(post => post.id !== excludedPostId)
        : nextPosts,
    [excludedPostId],
  );

  const hasPublicSeed = mode === 'public' && initialList !== undefined;
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<BlogType[]>(
    hasPublicSeed ? getVisiblePosts(initialList.posts) : [],
  );
  const [hasMore, setHasMore] = useState(
    hasPublicSeed ? initialList.maxPage > 1 : true,
  );
  const [isInitialLoading, setIsInitialLoading] = useState(!hasPublicSeed);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadingLockRef = useRef(false);
  const loadingRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const keyword = useStore(state => state.tagAtom);

  const usePublicSeed =
    mode === 'public' && page === 1 && !keyword && initialList !== undefined;
  const publicList = useGetPublicList(
    page,
    mode === 'public',
    usePublicSeed ? initialList : undefined,
    keyword,
  );
  const myList = useGetList(page, undefined, mode === 'my', undefined, keyword);
  const listQuery = mode === 'public' ? publicList : myList;
  const list = listQuery.data;
  const { tagKeyword } = router.query;

  useEffect(() => {
    const canUseSeed =
      mode === 'public' && !keyword && initialList !== undefined;
    setPage(1);
    setPosts(canUseSeed ? getVisiblePosts(initialList.posts) : []);
    setHasMore(canUseSeed ? initialList.maxPage > 1 : true);
    setIsInitialLoading(!canUseSeed);
    setIsLoadingMore(false);
    loadingLockRef.current = false;
  }, [getVisiblePosts, initialList, keyword, mode]);

  useEffect(() => {
    if (!tagKeyword) return;

    const normalizedKeyword = String(tagKeyword).trim().toLowerCase();
    setKeyword(normalizedKeyword);
    inputRef.current?.focus();
  }, [inputRef, setKeyword, tagKeyword]);

  useEffect(() => {
    if (!list) return;

    const visiblePosts = getVisiblePosts(list.posts);
    if (page === 1) {
      setPosts(visiblePosts);
      setIsInitialLoading(false);
    } else {
      setPosts(previous => {
        const nextPosts = visiblePosts.filter(
          post => !previous.some(previousPost => previousPost.id === post.id),
        );
        return nextPosts.length > 0 ? [...previous, ...nextPosts] : previous;
      });
      setIsLoadingMore(false);
    }

    setHasMore(page < list.maxPage);
    loadingLockRef.current = false;
  }, [getVisiblePosts, list, page]);

  useEffect(() => {
    if (!listQuery.isError) return;
    setIsInitialLoading(false);
    setIsLoadingMore(false);
    loadingLockRef.current = false;
  }, [listQuery.isError]);

  const loadMorePosts = useCallback(() => {
    if (
      !hasMore ||
      isInitialLoading ||
      isLoadingMore ||
      listQuery.isError ||
      listQuery.isFetching ||
      loadingLockRef.current
    ) {
      return;
    }

    loadingLockRef.current = true;
    setIsLoadingMore(true);
    setPage(previousPage => previousPage + 1);
  }, [
    hasMore,
    isInitialLoading,
    isLoadingMore,
    listQuery.isError,
    listQuery.isFetching,
  ]);

  useEffect(() => {
    const target = loadingRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) loadMorePosts();
      },
      { rootMargin: '240px 0px', threshold: 0.01 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMorePosts]);

  const setListIndex = useStore(state => state.setListIndexAtom);
  const queryClient = useQueryClient();

  const handlePrefetch = (id: number) => {
    if (mode !== 'public') return;

    queryClient.prefetchQuery({
      queryKey: ['detail', id],
      queryFn: () =>
        import('service/api/detail').then(api => api.getDetail(id)),
    });
  };

  const renderCard = (post: BlogType, index: number) => (
    <Link
      href={`/article/content/${post.id}`}
      onClick={() => setListIndex(index)}
      onMouseEnter={() => handlePrefetch(post.id)}
      onFocus={() => handlePrefetch(post.id)}
      className="group/card block rounded-[14px] focus-visible:ring-2 focus-visible:ring-ftBlue focus-visible:ring-offset-2"
      {...(mode === 'public' && {
        title: post.title,
        'aria-label': `게시물 보기: ${post.title}`,
        'data-seo-important': 'true',
      })}
    >
      <EditorialPostCard post={post} keyword={keyword} mode={mode} />
    </Link>
  );

  const buildItems = (): MasonryItem[] => {
    const items = posts.map((post, index) => ({
      key: `post-${post.id}`,
      node: renderCard(post, index),
    }));

    if (hasMore && isLoadingMore) {
      for (let index = 0; index < 3; index += 1) {
        items.push({
          key: `loading-${page}-${index}`,
          node: <CardSkeleton />,
        });
      }
    }

    return items;
  };

  const buildSkeletonItems = (count: number): MasonryItem[] =>
    Array.from({ length: count }, (_, index) => ({
      key: `initial-loading-${index}`,
      node: <CardSkeleton />,
    }));

  const renderCssColumns = (items: MasonryItem[]) => (
    <div className="w-full gap-4 columns-1 tablet:columns-2 desktop:columns-3">
      {items.map(item => (
        <div key={item.key} className="mb-4 break-inside-avoid">
          {item.node}
        </div>
      ))}
    </div>
  );

  const renderFixedColumns = (items: MasonryItem[], count: number) => {
    const columns: MasonryItem[][] = Array.from({ length: count }, () => []);
    items.forEach((item, index) => columns[index % count].push(item));

    return (
      <div className="flex w-full items-start gap-4">
        {columns.map((column, columnIndex) => (
          <div
            key={`column-${columnIndex}`}
            className="flex min-w-0 flex-1 flex-col"
          >
            {column.map(item => (
              <div key={item.key} className="mb-4">
                {item.node}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const columnCount = useResponsiveColumnCount();
  const renderLayout = (items: MasonryItem[]) =>
    columnCount === null
      ? renderCssColumns(items)
      : renderFixedColumns(items, columnCount);

  const emptyMessage = keyword
    ? {
        message: '검색 결과가 없습니다',
        subMessage: '다른 제목이나 태그로 다시 검색해보세요.',
      }
    : mode === 'my'
      ? {
          message: '아직 작성한 글이 없습니다',
          subMessage: '첫 기록을 작성하면 이곳에 모아볼 수 있어요.',
        }
      : {
          message: '아직 공개된 글이 없습니다',
          subMessage: '새로운 기술 기록이 등록되면 이곳에서 확인할 수 있어요.',
        };

  const showError = listQuery.isError && posts.length === 0;
  const showEmpty =
    !isInitialLoading &&
    posts.length === 0 &&
    !(excludedPostId && !keyword && mode === 'public');

  return (
    <div className="w-full">
      <div aria-live="polite" className="sr-only">
        {isInitialLoading
          ? '게시물을 불러오는 중입니다.'
          : `${posts.length}개의 게시물을 표시하고 있습니다.`}
      </div>

      {showError ? (
        <div
          role="alert"
          className="flex min-h-[260px] flex-col items-center justify-center border-y border-slate-200 px-6 text-center"
        >
          <h3 className="m-0 text-lg font-bold text-slate-800">
            게시물을 불러오지 못했습니다
          </h3>
          <p className="mb-0 mt-2 text-sm text-slate-500">
            잠시 후 다시 시도해주세요.
          </p>
          <button
            type="button"
            onClick={() => listQuery.refetch()}
            className="mt-5 min-h-[44px] rounded-[10px] border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 hover:border-ftBlue hover:text-ftBlue focus-visible:ring-2 focus-visible:ring-ftBlue focus-visible:ring-offset-2"
          >
            다시 시도
          </button>
        </div>
      ) : isInitialLoading ? (
        renderLayout(buildSkeletonItems(6))
      ) : posts.length > 0 ? (
        renderLayout(buildItems())
      ) : showEmpty ? (
        <ListEmpty {...emptyMessage} />
      ) : null}

      <div
        ref={loadingRef}
        className="flex min-h-[72px] w-full flex-col items-center justify-center"
      >
        {listQuery.isError && posts.length > 0 && (
          <button
            type="button"
            onClick={() => listQuery.refetch()}
            className="min-h-[44px] rounded-[10px] border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 hover:border-ftBlue hover:text-ftBlue focus-visible:ring-2 focus-visible:ring-ftBlue focus-visible:ring-offset-2"
          >
            이어서 불러오기
          </button>
        )}
        {!hasMore && !isInitialLoading && posts.length > 0 && (
          <p className="m-0 py-4 text-xs text-slate-400">
            모든 게시물을 불러왔습니다
          </p>
        )}
      </div>
    </div>
  );
};

export default PostListView;
