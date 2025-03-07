import { useEffect, useRef, useState } from 'react';
import { Pagination } from 'flowbite-react';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import Card from 'components/Shared/LogmeCard';
import { listIndexAtom } from 'service/atoms/atoms';
import { useGetList } from 'service/hooks/List';
import CardSkeleton from './Skeleton';
import FilterBox from './FilterBox';
import ListEmpty from './ListEmpty';
import { useRouter } from 'next/router';

const ListView = () => {
  const [page, setPage] = useState<number>(1);
  const [keyword, setKeyword] = useState('');
  const List = useGetList(page);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  console.log(List.data);

  const { tagKeyword } = router.query;

  useEffect(() => {
    const normalizedKeyword = tagKeyword
      ? String(tagKeyword).trim().toLowerCase()
      : '';
    setKeyword(normalizedKeyword);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tagKeyword]);

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
      <div className="grid gap-6">
        {[...Array(4)].map((_, index) => (
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
        className={`grid gap-2 tablet:gap-6 ${
          filteredPosts.length === 0
            ? 'bg-white rounded-2xl shadow-lg border border-gray-100'
            : ''
        }`}
      >
        {filteredPosts.length > 0 ? (
          filteredPosts.map(
            ({ id, title, content, tags, updated_at }, index) => (
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
