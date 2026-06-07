import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IoMdSearch, IoMdCreate } from 'react-icons/io';
import { motion } from 'framer-motion';
import useIsLogin from 'hooks/useIsLogin';

interface FilterBoxProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const FilterBox = ({ keyword, setKeyword, inputRef }: FilterBoxProps) => {
  const [localKeyword, setLocalKeyword] = useState(keyword);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated } = useIsLogin();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    setLocalKeyword(keyword);
  }, [keyword]);

  const handleSearch = () => setKeyword(localKeyword.trim());

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative flex-1">
        <IoMdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={localKeyword}
          onChange={e => setLocalKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-10 pl-10 pr-4 text-sm bg-gray-50 border border-gray-400 rounded-lg text-gray-900 placeholder:text-gray-400 shadow-[inset_0_1px_3px_rgba(0,0,0,0.07)] focus:outline-none focus:bg-white focus:border-ftBlue/50 focus:ring-2 focus:ring-ftBlue/10 focus:shadow-none transition-all"
          placeholder={isMobile ? '검색어 또는 태그' : '태그나 키워드로 검색 (Enter)'}
          aria-label="게시물 검색"
        />
      </div>

      {isMounted && isAuthenticated && (
        <motion.button
          className="write-btn relative flex-shrink-0 h-10 px-4 text-sm font-semibold text-white bg-ftBlue rounded-lg overflow-hidden"
          whileHover={{ scale: 1.03, backgroundColor: '#1f4a8c' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          onClick={() => router.push('/article/new')}
        >
          <span className="relative z-10 flex items-center gap-1.5">
            <IoMdCreate className="w-4 h-4" />
            {isMobile ? '작성' : '글 작성하기'}
          </span>
        </motion.button>
      )}
    </div>
  );
};

export default FilterBox;
