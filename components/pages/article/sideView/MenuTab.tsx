import LocalStorage from 'public/utils/Localstorage';

interface MenuTabProps {
  setMenu: React.Dispatch<React.SetStateAction<'list' | 'all'>>;
  activeMenu?: 'list' | 'all';
}

const MenuTab = ({ setMenu, activeMenu = 'list' }: MenuTabProps) => {
  const accessToken = LocalStorage.getItem('LogmeToken');
  const handleSetMenu = (menu: 'list' | 'all') => {
    setMenu(menu);
  };

  return (
    <div className="my-2 w-full">
      <div className="flex gap-2 items-center p-1 rounded-2xl border border-ftBlue/20 bg-bgWhite">
        {accessToken && (
          <button
            onClick={() => handleSetMenu('list')}
            className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none border ${
              activeMenu === 'list'
                ? 'bg-ftBlue text-white border-ftBlue'
                : 'bg-white text-ftGray border-transparent hover:border-ftBlue/40 hover:text-ftBlue'
            }`}
            aria-current={activeMenu === 'list' ? 'page' : undefined}
          >
            <span className="flex gap-2 justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              나의 게시물
            </span>
          </button>
        )}
        <button
          onClick={() => handleSetMenu('all')}
          className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none border ${
            activeMenu === 'all'
              ? 'bg-ftBlue text-white border-ftBlue'
              : 'bg-white text-ftGray border-transparent hover:border-ftBlue/40 hover:text-ftBlue'
          }`}
          aria-current={activeMenu === 'all' ? 'page' : undefined}
        >
          <span className="flex gap-2 justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            전체 게시물
          </span>
        </button>
      </div>
    </div>
  );
};

export default MenuTab;
