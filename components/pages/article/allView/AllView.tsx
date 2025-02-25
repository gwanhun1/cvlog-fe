import { useEffect, useState, useRef, useCallback } from 'react';
import LogmeAllCard, { TagItem } from 'components/Shared/LogmeAllCard';
import { useGetPublicList } from 'service/hooks/List';
import CardSkeleton from './Skeleton';

const AllView = () => {
  const [page, setPage] = useState<number>(1);
  const [items, setItems] = useState<any[]>([]);
  const { data: List, isLoading } = useGetPublicList(page);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (List?.posts) {
      setItems(prev => [...prev, ...List.posts]);
    }
  }, [List]);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && List?.maxPage && page < List.maxPage) {
          setPage(prev => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, List, page]
  );

  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="container mx-auto px-2 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="border-b border-gray-300 w-full self-center mb-3" />
        <h2 className="text-3xl font-bold text-gray-500 shrink-0">
          전체 게시물
        </h2>
        <div className="border-b border-gray-300 w-full self-center mb-3" />
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-6 w-full max-w-[1270px]">
          {items.length > 0 ? (
            items.map((post, index) => (
              <div
                key={post.id}
                onClick={() =>
                  handleNavigate(`/article/content/all/${post.id}`)
                }
                ref={index === items.length - 1 ? lastElementRef : null}
              >
                <LogmeAllCard
                  title={post.title}
                  content={post.content}
                  tags={post.tags}
                  updated_at={post.updated_at}
                />
              </div>
            ))
          ) : isLoading ? (
            Array(8)
              .fill(null)
              .map((_, index) => <CardSkeleton key={index} />)
          ) : (
            <div className="col-span-full flex flex-col gap-6 justify-center items-center min-h-[320px] text-xl bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-700">
                아직 작성된 글이 없어요
              </h3>
              <p className="text-sm text-gray-500">
                첫 번째 이야기의 주인공이 되어보세요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllView;
