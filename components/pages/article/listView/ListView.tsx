import { useEffect, useState } from 'react';
import { Pagination } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import * as Shared from 'components/Shared';
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
  }, [List, page]);

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
    <div className="flex flex-col gap-6 ">
      {/* Search and New Post Section */}
      <div className="flex flex-col tablet:flex-row tablet:items-center gap-4 w-full">
        <div className="flex-1 relative">
          <input
            className="w-full h-12 mobile:h-14 px-6 text-gray-700 text-lg mobile:text-xl tablet:text-2xl bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-blue-300 shadow-[0_0_15px_rgba(0,0,0,0.1)] placeholder:text-gray-400 placeholder:font-light focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:border-blue-300"
            name="title"
            placeholder="Search for articles..."
            onKeyUp={handleKeyDown}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Shared.LogmeIcon.LensIcon
              alt="search"
              width={24}
              height={24}
              onClick={() => alert('v1.1에서 만나요 🥰')}
              cn="hover:cursor-not-allowed [filter:brightness(0)_saturate(100%)_invert(83%)_sepia(8%)_saturate(0%)_hue-rotate(177deg)_brightness(89%)_contrast(84%)]"
            />
          </div>
        </div>
        <div className="w-full tablet:w-auto flex justify-end">
          <Shared.LogmeButton
            variant="classic"
            size="big"
            onClick={handleNewPost}
          >
            <Shared.LogmeHeadline
              type="medium"
              fontStyle="semibold"
              style={{ color: '#fff' }}
            >
              글 작성하기
            </Shared.LogmeHeadline>
          </Shared.LogmeButton>
        </div>
      </div>

      {/* Cards Grid */}
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
          <div className="flex w-full justify-center items-center h-20 tablet:h-[23.5rem]">
            <p className=" text-2xl font-bold text-gray-400">
              글을 작성해주세요. 😄
            </p>
          </div>
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
