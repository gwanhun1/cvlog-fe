import { IoMdSearch } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { Pagination } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import Card from 'components/Shared/LogmeCard';
import { listIndexAtom } from 'service/atoms/atoms';
import { useGetList } from 'service/hooks/List';
import CardSkeleton from './Skeleton';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const [, setListIndex] = useRecoilState(listIndexAtom);
  const saveListIndex = (params: number) => {
    setListIndex(params);
  };

  if (List.isFetching || List.isLoading) {
    return (
      <div className="grid gap-6">
        {[...Array(4)].map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.code === 'Enter') {
      event.preventDefault();
      alert('v1.1에서 만나요 🥰');
    }
  };
  const handleNewPost = () => {
    router.push('/article/new');
  };

  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col tablet:flex-row tablet:items-end gap-4 w-full">
          <div className="flex-1 relative">
            <div className="relative w-full">
              <input
                style={{ border: '1px solid #dbeafe' }}
                className="w-full h-10 mobile:h-12 pl-14 pr-6 text-gray-800 text-md mobile:text-lg tablet:text-xl bg-white/90 backdrop-blur-sm rounded-xl border-2 border-blue-300 shadow-lg placeholder:text-gray-400 placeholder:font-light focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 hover:shadow-xl hover:border-blue-500"
                name="title"
                placeholder="Search for articles..."
                onKeyUp={handleKeyDown}
              />
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full transition-all duration-300  hover:scale-105 cursor-pointer hover:text-blue-600 hover:outline hover:outline-2 hover:outline-blue-400 active:scale-95  active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                <IoMdSearch className="text-white w-5 h-5" />
              </div>
            </div>
          </div>
          <button
            className="font-bold bg-blue-500 border border-blue-50 text-white rounded-2xl p-4 text-lg transition-all duration-300 transform hover:scale-105 hover:bg-blue-100 hover:text-blue-600 hover:outline hover:outline-2 hover:outline-blue-400 active:scale-95  active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            onClick={handleNewPost}
          >
            글 작성하기
          </button>
        </div>
      </div>

      <div
        className={`grid gap-2 tablet:gap-6 ${
          List && List.data && List.data?.posts.length < 0
            ? 'bg-white rounded-2xl shadow-lg border border-gray-100'
            : null
        } `}
      >
        {List && List.data && List.data?.posts.length > 0 ? (
          List.data?.posts.map(
            ({ id, title, content, tags, updated_at }, index) => {
              return (
                <Link
                  href={`/article/content/${id}`}
                  key={id}
                  onClick={() => saveListIndex(index)}
                  prefetch={true}
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
          )
        ) : (
          <div className="flex flex-col gap-6 w-full justify-center items-center h-20 tablet:h-[23.5rem] bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-lg p-8">
            <div className="relative">
              <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
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
                새로운 이야기를 시작해보세요
              </h3>
              <p className="text-sm text-gray-500">
                당신만의 특별한 순간을 기록해보세요
              </p>
            </div>
          </div>
        )}
      </div>

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
