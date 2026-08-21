import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IoMdSearch, IoMdCreate } from 'react-icons/io';
import { motion, useReducedMotion } from 'framer-motion';
import useIsLogin from 'hooks/useIsLogin';
import { useDraftResume } from 'hooks/useDraftResume';

interface FilterBoxProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const FilterBox = ({ keyword, setKeyword, inputRef }: FilterBoxProps) => {
  const [localKeyword, setLocalKeyword] = useState(keyword);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { isAuthenticated, isLoading } = useIsLogin();
  const { handleNewArticle } = useDraftResume();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setLocalKeyword(keyword);
  }, [keyword]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setKeyword(localKeyword.trim());
  };

  const handleWrite = () => {
    if (isAuthenticated) {
      handleNewArticle();
      return;
    }

    router.push('/login?redirect=/article/new');
  };

  return (
    <>
      <form
        role="search"
        onSubmit={handleSearch}
        className="flex w-full items-center gap-2.5"
      >
        <div className="flex min-w-0 flex-1 items-stretch overflow-hidden rounded-[12px] border border-slate-300 bg-white transition-[border-color,box-shadow] focus-within:border-ftBlue focus-within:ring-2 focus-within:ring-ftBlue/10">
          <label htmlFor="article-search" className="sr-only">
            게시물 검색
          </label>
          <div className="relative min-w-0 flex-1">
            <IoMdSearch className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
            <input
              id="article-search"
              ref={inputRef}
              type="search"
              value={localKeyword}
              onChange={event => setLocalKeyword(event.target.value)}
              className="h-12 w-full bg-transparent pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none"
              placeholder="제목 또는 태그 검색"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="flex h-12 min-w-[52px] items-center justify-center bg-ftBlue px-4 text-sm font-bold text-white transition-colors hover:bg-[#1f4a8c] focus-visible:outline-none active:translate-y-px mobile:min-w-[74px]"
          >
            <span className="hidden mobile:inline">검색</span>
            <IoMdSearch aria-hidden className="h-5 w-5 mobile:hidden" />
          </button>
        </div>

        {isMounted && !isLoading && (
          <motion.button
            type="button"
            className="write-btn relative flex h-12 flex-shrink-0 items-center overflow-hidden rounded-[12px] border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700 focus-visible:ring-2 focus-visible:ring-ftBlue focus-visible:ring-offset-2 mobile:px-4"
            whileHover={
              reduceMotion ? undefined : { y: -2, borderColor: '#2657A6' }
            }
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={handleWrite}
          >
            <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
              <IoMdCreate className="w-4 h-4" />
              <span className="hidden mobile:inline">글 작성</span>
              <span className="mobile:hidden">작성</span>
            </span>
          </motion.button>
        )}
      </form>

    </>
  );
};

export default FilterBox;
