import { useRouter } from 'next/router';
import LocalStorage from 'public/utils/Localstorage';
import { IoMdSearch } from 'react-icons/io';

interface FilterBoxProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const FilterBox = ({ keyword, setKeyword, inputRef }: FilterBoxProps) => {
  const accessToken = LocalStorage.getItem('LogmeToken');
  const router = useRouter();

  const handleNewPost = () => {
    router.push('/article/new');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col tablet:flex-row tablet:items-center gap-3 w-full">
        <label className="flex-1">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
              <IoMdSearch className="w-5 h-5" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value.toLocaleLowerCase())}
              className="w-full h-11 tablet:h-12 pl-12 pr-4 text-base tablet:text-lg text-slate-900 bg-white/90 border border-slate-200 rounded-2xl shadow-[0_10px_35px_-28px_rgba(15,23,42,0.5)] focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-400 transition-all placeholder:text-slate-400"
              placeholder="태그나 키워드로 검색해보세요"
            />
          </div>
        </label>

        {accessToken && (
          <button
            className="inline-flex items-center justify-center whitespace-nowrap bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:-translate-y-[1px] active:translate-y-0"
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
