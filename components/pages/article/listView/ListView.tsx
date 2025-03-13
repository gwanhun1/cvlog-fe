import { useEffect, useRef, useState } from 'react';
import { Pagination } from 'flowbite-react';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import Card from 'components/Shared/LogmeCard';
import { listIndexAtom, tagAtom } from 'service/atoms/atoms';
import { useGetList } from 'service/hooks/List';
import CardSkeleton from './Skeleton';
import FilterBox from './FilterBox';
import ListEmpty from './ListEmpty';
import { useRouter } from 'next/router';

const ListView = () => {
  const [page, setPage] = useState<number>(1);
  const [keyword, setKeyword] = useRecoilState(tagAtom);
  const List = useGetList(page);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

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

  const onPageChange = (page: number) => {
    setPage(page);
  };

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
      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4 tablet:gap-6">
        {[...Array(6)].map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }
  const filteredPosts = List?.data?.posts
    ? List.data.posts.filter(item => {
        const titleMatch = item.title
          ? item.title.toLowerCase().includes((keyword || '').toLowerCase())
          : false;

        const tagMatch = item.tags.some(tag =>
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
            : 'grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-2 auto-rows-auto masonry-grid'
        }`}
      >
        {filteredPosts.length > 0 ? (
          filteredPosts.map(
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
          )
        ) : (
          <ListEmpty />
        )}
      </div>

      <div className="flex items-center justify-center py-6">
        {List?.data?.maxPage && List.data.maxPage !== 1 && (
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
