import { useEffect, useState, useRef, useCallback } from 'react';
import { useGetPublicList, useGetList } from 'service/hooks/List';
import { useQueryClient } from '@tanstack/react-query';
import CardSkeleton from './Skeleton';
import { useRouter } from 'next/router';
import { BlogType } from 'service/api/tag/type';
import { useStore } from 'service/store/useStore';
import Link from 'next/link';
import Card from 'components/Shared/LogmeCard';
import ListEmpty from '../../../Shared/common/ListEmpty';
import { useResponsiveColumnCount } from 'hooks/useResponsiveColumnCount';

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
    mode === 'public' ? !(initialPosts && initialPosts.length > 0) : true,
  );
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null); // mode에 따라 필요한 훅만 호출하며, 서버에서 받은 initialPosts를 초기값으로 활용
  const keyword = useStore(state => state.tagAtom);
  // initialPosts가 실제 데이터가 있을 때만 initialData로 사용
  // 빈 배열이나 undefined이면 undefined → React Query가 실제 API 호출
  const hasInitialData =
    mode === 'public' && page === 1 && !keyword &&
    Array.isArray(initialPosts) && initialPosts.length > 0;

  const publicList = useGetPublicList(
    page,
    mode === 'public',
    hasInitialData ? { posts: initialPosts, maxPage: 1 } : undefined,
    keyword,
  );
  const myList = useGetList(page, undefined, mode === 'my', undefined, keyword);
  const List = mode === 'public' ? publicList.data : myList.data;

  const { tagKeyword } = router.query;
  const isFirstRender = useRef(true);

  // 키워드가 변경되면 페이지와 포스트 초기화 및 로딩 상태 시작
  useEffect(() => {
    setPage(1);
    setPosts([]);
    setHasMore(true);
    if (keyword) {
      setIsInitialLoading(true);
    }
  }, [keyword]);

  // URL의 태그 키워드와 전역 상태 동기화 (초기 진입 시)
  useEffect(() => {
    if (tagKeyword) {
      const normalizedKeyword = String(tagKeyword).trim().toLowerCase();
      setKeyword(normalizedKeyword);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
    isFirstRender.current = false;
  }, [tagKeyword, setKeyword, inputRef]);

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
        setPosts(prev => {
          const newPosts = List.posts.filter(
            (newPost: BlogType) =>
              !prev.some((prevPost: BlogType) => prevPost.id === newPost.id),
          );
          if (newPosts.length === 0) return prev;
          return [...prev, ...newPosts];
        });
        setIsLoadingMore(false);
      }

      if (page >= List.maxPage) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [List, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 },
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

  const setListIndex = useStore(state => state.setListIndexAtom);
  const saveListIndex = (params: number) => {
    setListIndex(params);
  };

  const getPostLink = (id: number) => `/article/content/${id}`;

  // mode에 따른 빈 목록 스타일
  const emptyContainerClass =
    mode === 'public'
      ? 'bg-white rounded-2xl shadow-lg border border-gray-100'
      : 'bg-white/90 backdrop-blur rounded-2xl border border-ftBlue/15';

  // mode에 따른 끝 메시지 색상
  const endMessageClass = mode === 'public' ? 'text-gray-300' : 'text-ftGray';

  const queryClient = useQueryClient();

  const handlePrefetch = (id: number) => {
    if (mode === 'public') {
      queryClient.prefetchQuery({
        queryKey: ['detail', id],
        queryFn: () =>
          import('service/api/detail').then(api => api.getDetail(id)),
      });
    }
  };

  // CSS 멀티컬럼(columns-*)은 아이템이 추가될 때마다 전체를 컬럼 개수만큼 다시 분배하므로,
  // 무한 스크롤로 새 게시물이 붙을 때 이미 보이던 카드가 다른 컬럼으로 튀는 문제가 있었다.
  // 하이드레이션 이후에는 index % columnCount로 직접 배치해 각 게시물의 컬럼을 고정한다(가로 우선).
  // 다만 서버는 뷰포트를 모르므로, 해결 전(null)에는 기존 CSS 멀티컬럼으로 렌더한다.
  // 그래야 SSG된 첫 페인트가 모든 breakpoint에서 올바르게 보인다.
  const columnCount = useResponsiveColumnCount();

  const renderCard = ({
    id,
    title,
    content,
    tags,
    created_at,
    updated_at,
    user,
  }: BlogType, index: number) => (
    <Link
      key={id}
      href={getPostLink(id)}
      onClick={() => saveListIndex(index)}
      onMouseEnter={() => handlePrefetch(id)}
      className="block"
      {...(mode === 'public' && {
        title: title,
        'aria-label': `게시물 보기: ${title}`,
        'data-seo-important': 'true',
      })}
    >
      {mode === 'public' ? (
        <div itemScope itemType="https://schema.org/BlogPosting">
          <meta
            itemProp="mainEntityOfPage"
            content={`https://logme.cloud/article/content/${id}`}
          />
          <meta itemProp="headline" content={title} />
          <meta itemProp="dateModified" content={updated_at} />
          <Card
            title={title}
            content={content}
            tags={tags}
            created_at={created_at}
            updated_at={updated_at}
            user={user}
          />
        </div>
      ) : (
        <Card
          title={title}
          content={content}
          tags={tags}
          created_at={created_at}
          updated_at={updated_at}
          user={user}
        />
      )}
    </Link>
  );

  // 현재 화면에 그려야 할 아이템들을 순서대로 만든다(게시물 + 다음 페이지 스켈레톤).
  const buildItems = (): React.ReactNode[] => {
    const items: React.ReactNode[] = posts.map((post, index) =>
      renderCard(post, index),
    );

    if (hasMore && isLoadingMore) {
      for (let i = 0; i < 3; i += 1) {
        items.push(
          <div key={`skeleton-${i}`}>
            <CardSkeleton />
          </div>,
        );
      }
    }

    return items;
  };

  const buildSkeletonItems = (count: number): React.ReactNode[] =>
    [...Array(count)].map((_, index) => (
      <div key={`initial-skeleton-${index}`}>
        <CardSkeleton />
      </div>
    ));

  // 하이드레이션 전: CSS 멀티컬럼. 서버가 뷰포트를 몰라도 breakpoint별로 올바르게 렌더된다.
  const renderCssColumns = (items: React.ReactNode[]) => (
    <div className="gap-4 w-full columns-1 tablet:columns-2 desktop:columns-3">
      {items.map((item, index) => (
        <div key={`css-col-item-${index}`} className="mb-4 break-inside-avoid">
          {item}
        </div>
      ))}
    </div>
  );

  // 하이드레이션 후: index % columnCount 고정 배치라 새 페이지가 붙어도 기존 카드가 안 움직인다.
  const renderFixedColumns = (items: React.ReactNode[], count: number) => {
    const columns: React.ReactNode[][] = Array.from({ length: count }, () => []);
    items.forEach((item, index) => {
      columns[index % count].push(
        <div key={`fixed-col-item-${index}`} className="mb-4">
          {item}
        </div>,
      );
    });

    return (
      <div className="flex gap-4 items-start w-full">
        {columns.map((column, colIndex) => (
          <div
            key={`column-${colIndex}`}
            className="flex flex-col flex-1 min-w-0"
          >
            {column}
          </div>
        ))}
      </div>
    );
  };

  const renderLayout = (items: React.ReactNode[]) =>
    columnCount === null
      ? renderCssColumns(items)
      : renderFixedColumns(items, columnCount);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="w-full">
          {isInitialLoading ? (
            renderLayout(buildSkeletonItems(6))
          ) : posts.length > 0 ? (
            renderLayout(buildItems())
          ) : (
            <ListEmpty />
          )}
        </div>

        <div
          ref={loadingRef}
          className="flex flex-col items-center mt-8 mb-4 w-full"
        >
          {!hasMore && !isInitialLoading && posts.length > 0 && (
            <div className={`py-4 text-sm ${endMessageClass}`}>
              모든 게시물을 불러왔습니다
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PostListView;
