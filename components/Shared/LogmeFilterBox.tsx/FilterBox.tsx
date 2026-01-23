import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IoMdSearch } from 'react-icons/io';
import useIsLogin from 'hooks/useIsLogin';

interface FilterBoxProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const FilterBox = ({ keyword, setKeyword, inputRef }: FilterBoxProps) => {
  const [localKeyword, setLocalKeyword] = useState(keyword);
  const [isMounted, setIsMounted] = useState(false);
  const { isAuthenticated } = useIsLogin();
  const router = useRouter();

  // 하이드레이션 오류 방지
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 외부에서 검색어가 바뀌면(예: 태그 클릭) 로컬 입력창도 동기화
  useEffect(() => {
    setLocalKeyword(keyword);
  }, [keyword]);

  // 실제 검색을 실행하는 함수
  const handleSearch = () => {
    setKeyword(localKeyword.trim());
  };

  // 엔터 키 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNewPost = () => {
    router.push('/article/new');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 w-full tablet:flex-row tablet:items-center">
        <div className="relative flex-1 group">
          <input
            ref={inputRef}
            type="text"
            value={localKeyword}
            onChange={e => setLocalKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-14 pl-5 w-full h-11 text-base rounded-2xl border-2 border-solid transition-all border-slate-200 tablet:h-12 tablet:text-lg text-slate-900 bg-white/90 focus:outline-none focus:ring-4 focus:ring-ftBlue/10 focus:border-ftBlue/50 placeholder:text-ftGray"
            placeholder="태그나 키워드로 검색해보세요 (Enter)"
          />
          <button
            onClick={handleSearch}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 tablet:w-9 tablet:h-9 flex items-center justify-center rounded-full bg-ftBlue text-white hover:bg-[#1f4a8c] transition-all active:scale-95 shadow-sm"
            title="검색"
          >
            <IoMdSearch className="w-5 h-5 tablet:w-6 tablet:h-6" />
          </button>
        </div>

        {isMounted && isAuthenticated && (
          <button
            className="inline-flex items-center justify-center whitespace-nowrap bg-ftBlue text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-[#1f4a8c] transition-all"
            onClick={handleNewPost}
          >
            글 작성하기
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBox;
