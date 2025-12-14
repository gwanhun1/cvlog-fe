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
      <div className="flex flex-col gap-3 w-full tablet:flex-row tablet:items-center">
        <label className="flex-1">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ftBlue">
              <IoMdSearch className="w-5 h-5" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value.toLocaleLowerCase())}
              className="pr-4 pl-12 w-full h-11 text-base rounded-2xl border transition-all tablet:h-12 tablet:text-lg text-slate-900 bg-white/90 border-ftBlue/25 focus:outline-none focus:ring-2 focus:ring-ftBlue/60 focus:border-ftBlue/50 placeholder:text-ftGray"
              placeholder="태그나 키워드로 검색해보세요"
            />
          </div>
        </label>

        {accessToken && (
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
