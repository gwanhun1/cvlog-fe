import { useEffect, useState } from 'react';
import { Pagination } from 'flowbite-react';
import LogmeAllCard, { TagItem } from 'components/Shared/LogmeAllCard';
import { useGetPublicList } from 'service/hooks/List';
import CardSkeleton from './Skeleton';

const AllView = () => {
  const [page, setPage] = useState<number>(1);
  const { data: List, isLoading } = useGetPublicList(page);

  const onPageChange = (page: number) => {
    setPage(page);
  };

  useEffect(() => {
    // List.refetch();
  }, [page]);

  // Generate skeleton array when loading
  const skeletonArray = Array(8).fill(null);

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
      <div className="flex justify-center items">
        <div className="flex flex-wrap gap-6 justify-center tablet:justify-start w-full max-w-[1270px]">
          {isLoading ? (
            skeletonArray.map((_, index) => <CardSkeleton key={index} />)
          ) : List && List?.posts && List?.posts.length > 0 ? (
            List?.posts?.map(
              (post: {
                id: React.Key | null | undefined;
                title: string;
                content: string;
                tags: TagItem[];
                updated_at: string | undefined;
              }) => (
                <div
                  key={post.id}
                  className="w-[290px]"
                  onClick={() =>
                    handleNavigate(`/article/content/all/${post.id}`)
                  }
                >
                  <LogmeAllCard
                    title={post.title}
                    content={post.content}
                    tags={post.tags}
                    updated_at={post.updated_at}
                  />
                </div>
              )
            )
          ) : (
            <div className="w-full flex flex-col gap-6 justify-center items-center min-h-[300px] text-xl bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg p-8">
              <div className="relative">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    ></path>
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-gray-700">
                  아직 작성된 글이 없어요
                </h3>
                <p className="text-sm text-gray-500">
                  첫 번째 이야기의 주인공이 되어보세요
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center py-6">
        {List && List.maxPage && List.maxPage !== 1 && (
          <Pagination
            className="white"
            currentPage={page}
            onPageChange={onPageChange}
            totalPages={List.maxPage}
            showIcons={true}
            previousLabel=""
            nextLabel=""
          />
        )}
      </div>
    </div>
  );
};

export default AllView;
