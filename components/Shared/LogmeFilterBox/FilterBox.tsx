import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IoMdSearch, IoMdCreate, IoMdClose } from 'react-icons/io';
import { motion, useReducedMotion } from 'framer-motion';
import useIsLogin from 'hooks/useIsLogin';
import { useDraftResume } from 'hooks/useDraftResume';

interface FilterBoxProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  suggestedTags?: string[];
}

const FilterBox = ({ keyword, setKeyword, inputRef, suggestedTags = [] }: FilterBoxProps) => {
  const [localKeyword, setLocalKeyword] = useState(keyword);
  const [isMounted, setIsMounted] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { isAuthenticated, isLoading } = useIsLogin();
  const { handleNewArticle } = useDraftResume();

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = window.localStorage.getItem('logme-search-history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setSearchHistory(parsed.filter(item => typeof item === 'string'));
      }
    } catch {
      // 검색 기록이 손상되었거나 저장소를 사용할 수 없는 경우 무시합니다.
    }
  }, []);

  useEffect(() => {
    setLocalKeyword(keyword);
  }, [keyword]);

  const saveSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const nextHistory = [trimmed, ...searchHistory.filter(item => item !== trimmed)].slice(0, 8);
    setSearchHistory(nextHistory);
    window.localStorage.setItem('logme-search-history', JSON.stringify(nextHistory));
  };

  const removeSearchHistory = (value: string) => {
    const nextHistory = searchHistory.filter(item => item !== value);
    setSearchHistory(nextHistory);
    window.localStorage.setItem('logme-search-history', JSON.stringify(nextHistory));
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextKeyword = localKeyword.trim();
    saveSearch(nextKeyword);
    setKeyword(nextKeyword);
    inputRef.current?.blur();
  };

  const selectSearchTerm = (value: string) => {
    setLocalKeyword(value);
    saveSearch(value);
    setKeyword(value);
    inputRef.current?.blur();
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
        <div className="group relative min-w-0 flex-1">
          <div className="flex min-w-0 items-stretch overflow-hidden rounded-[12px] border border-slate-300 bg-white transition-[border-color,box-shadow] focus-within:border-ftBlue focus-within:ring-2 focus-within:ring-ftBlue/10">
            <label htmlFor="article-search" className="sr-only">
              게시물 검색
            </label>
            <div className="min-w-0 flex-1">
              <IoMdSearch className="pointer-events-none absolute left-4 top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
              <input
                id="article-search"
                ref={inputRef}
                type="search"
                value={localKeyword}
                onChange={event => setLocalKeyword(event.target.value)}
                className="h-12 w-full bg-transparent pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none"
                placeholder="제목·태그·시리즈 검색"
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              className="flex h-12 min-w-[52px] shrink-0 items-center justify-center bg-ftBlue px-4 text-sm font-bold text-white transition-colors hover:bg-[#1f4a8c] focus-visible:outline-none active:translate-y-px mobile:min-w-[74px]"
            >
              <span className="hidden mobile:inline">검색</span>
              <IoMdSearch aria-hidden className="h-5 w-5 mobile:hidden" />
            </button>
          </div>

          {(searchHistory.length > 0 || suggestedTags.length > 0) && (
            <div className="pointer-events-none invisible absolute left-0 right-0 top-[calc(100%+8px)] z-30 rounded-[12px] border border-ftBlue/10 bg-white/95 p-4 opacity-0 shadow-[0_10px_30px_rgba(38,87,166,0.12)] backdrop-blur-sm transition-[opacity,visibility] duration-150 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100">
              {searchHistory.length > 0 && (
                <section aria-labelledby="search-history-title">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h2 id="search-history-title" className="m-0 text-xs font-bold text-slate-700">
                      이전 검색어
                    </h2>
                    <button
                      type="button"
                      className="text-[11px] text-slate-400 hover:text-ftBlue"
                      onMouseDown={event => event.preventDefault()}
                      onClick={() => {
                        setSearchHistory([]);
                        window.localStorage.removeItem('logme-search-history');
                      }}
                    >
                      전체 삭제
                    </button>
                  </div>
                  <div className="flex max-w-full gap-2 overflow-x-auto whitespace-nowrap pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {searchHistory.map(item => (
                      <div key={item} className="flex shrink-0 items-center gap-1 rounded-md bg-slate-50 pl-2.5 text-xs text-slate-600">
                        <button
                          type="button"
                          className="max-w-[180px] truncate py-1.5 hover:text-ftBlue"
                          onMouseDown={event => event.preventDefault()}
                          onClick={() => selectSearchTerm(item)}
                        >
                          {item}
                        </button>
                        <button
                          type="button"
                          aria-label={`${item} 검색 기록 삭제`}
                          className="p-1.5 text-slate-300 hover:text-ftBlue"
                          onMouseDown={event => event.preventDefault()}
                          onClick={() => removeSearchHistory(item)}
                        >
                          <IoMdClose aria-hidden className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {suggestedTags.length > 0 && (
                <section aria-labelledby="popular-tags-title" className={searchHistory.length > 0 ? 'mt-4 border-t border-slate-100 pt-3' : ''}>
                  <h2 id="popular-tags-title" className="mb-2 text-xs font-bold text-slate-700">
                    인기 태그
                  </h2>
                  <div className="flex max-w-full items-center gap-3 overflow-x-auto whitespace-nowrap pb-1 text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {suggestedTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        className="shrink-0 text-ftBlue/70 transition-colors hover:text-ftBlue focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ftBlue/30"
                        onMouseDown={event => event.preventDefault()}
                        onClick={() => selectSearchTerm(tag)}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
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
