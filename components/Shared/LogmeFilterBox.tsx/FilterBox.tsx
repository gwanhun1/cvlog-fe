import { useRouter } from 'next/router';
import { IoMdSearch } from 'react-icons/io';

type FilterBoxProps = {
  keyword: string;
  setKeyword: (keyword: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

const FilterBox = ({ keyword, setKeyword, inputRef }: FilterBoxProps) => {
  const router = useRouter();

  const handleNewPost = () => {
    router.push('/article/new');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col tablet:flex-row tablet:items-end gap-4 w-full">
        <div className="flex-1 relative">
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value.toLocaleLowerCase())}
              style={{ border: '1px solid #dbeafe' }}
              className="w-full h-10 mobile:h-12 pl-14 pr-6 text-gray-800 text-md mobile:text-lg tablet:text-xl bg-white/90 backdrop-blur-sm rounded-xl border-2 border-blue-300 shadow-lg placeholder:text-[16px] placeholder:text-gray-400 placeholder:font-light focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 hover:shadow-xl hover:border-blue-500"
              placeholder="태그를 입력해보세요!!"
            />

            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer hover:text-blue-600 hover:outline hover:outline-2 hover:outline-blue-400 active:scale-95 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
              <IoMdSearch className="text-white w-5 h-5" />
            </div>
          </div>
        </div>
        <button
          className="font-bold bg-blue-500 border border-blue-50 text-white rounded-2xl p-4 text-lg transition-all duration-300 transform hover:scale-105 hover:bg-blue-100 hover:text-blue-600 hover:outline hover:outline-2 hover:outline-blue-400 active:scale-95 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          onClick={handleNewPost}
        >
          글 작성하기
        </button>
      </div>
    </div>
  );
};

export default FilterBox;
