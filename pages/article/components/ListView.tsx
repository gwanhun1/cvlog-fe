import React, { useEffect, useState } from 'react';
import { Pagination, Spinner } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import * as Shared from 'components/Shared';
import Card from 'components/Shared/LogmeCard';
import { listIndexAtom } from 'service/atoms/atoms';
import { useGetList } from 'service/hooks/List';

type TagType = {
  id: number;
  name: string;
};

type BlogType = {
  id: number;
  title: string;
  content: string;
  user_id: number;
  public_status: boolean;
  created_at: string;
  updated_at: string;
  image: string;
  index: number;
  tags: TagType[];
};

export type ListDataType = {
  posts: BlogType[];
  maxPage: number;
};

export type GetListType = {
  success: boolean;
  data: ListDataType;
};

const ListView = () => {
  //데이터 받기
  const [page, setPage] = useState<number>(1);

  //TODO PARAMS 옵션 추가
  const List = useGetList(page);

  const onPageChange = (page: number) => {
    // TODO : onPageChange 함수를 통해 axios params로 페이지네이션 구현 예정
    setPage(page);
  };
  const router = useRouter();
  useEffect(() => {
    List.refetch();
  }, [page]);
  const [, setListIndex] = useRecoilState(listIndexAtom);
  const saveListIndex = (params: number) => {
    setListIndex(params);
  };

  const SkeletonCard = () => (
    <div className="w-full p-6 bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse">
      <div className="space-y-4">
        {/* Title skeleton */}
        <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>

        {/* Content skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-14 bg-gray-200 rounded-full"></div>
        </div>

        {/* Time skeleton */}
        <div className="flex justify-end">
          <div className="h-5 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );

  if (List.isFetching || List.isLoading) {
    return (
      <div className="grid gap-6">
        {[...Array(4)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.code === 'Enter') {
      alert('v1.1에서 만나요 🥰');
    }
  };
  const handleNewPost = () => {
    router.push('/article/new');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search and New Post Section */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <input
            className="w-full h-12 mobile:h-14 px-6 text-gray-700 text-lg mobile:text-xl tablet:text-2xl bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-blue-300 shadow-[0_0_15px_rgba(0,0,0,0.1)] placeholder:text-gray-400 placeholder:font-light focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:border-blue-300"
            name="title"
            placeholder="Search for articles..."
            onKeyDown={handleKeyDown}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Shared.LogmeIcon.LensIcon
              alt="search"
              width={24}
              height={24}
              onClick={() => alert('v1.1에서 만나요 🥰')}
              cn="hover:cursor-not-allowed"
            />
          </div>
        </div>
        <Shared.LogmeButton type="classic" size="big" onClick={handleNewPost}>
          <Shared.LogmeHeadline
            type="medium"
            fontStyle="semibold"
            style={{ color: '#fff' }}
          >
            NEW
          </Shared.LogmeHeadline>
        </Shared.LogmeButton>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6">
        {List.data?.posts.map(
          ({ id, title, content, tags, updated_at }, index) => {
            return (
              <Link
                href={`/article/content/${id}`}
                key={id}
                onClick={() => saveListIndex(index)}
              >
                <Card
                  title={title}
                  content={content}
                  tags={tags}
                  updated_at={updated_at}
                />
              </Link>
            );
          }
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center py-6">
        {List && List.data?.maxPage && List.data?.maxPage !== 1 && (
          <Pagination
            className="white"
            currentPage={page}
            onPageChange={onPageChange}
            totalPages={List.data.maxPage}
            showIcons={true}
            previousLabel=""
            nextLabel=""
          />
        )}
      </div>
    </div>
  );
};

export default ListView;
