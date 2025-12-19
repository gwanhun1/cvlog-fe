import { useEffect, useState } from 'react';
import LocalStorage from 'public/utils/Localstorage';

interface MenuTabProps {
  setMenu: React.Dispatch<React.SetStateAction<'list' | 'all'>>;
  activeMenu?: 'list' | 'all';
}

const MenuTab = ({ setMenu, activeMenu = 'list' }: MenuTabProps) => {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    setHasToken(Boolean(LocalStorage.getItem('LogmeToken')));
  }, []);

  const showMyPostsTab = hasToken === true;
  const resolvedActiveMenu: 'list' | 'all' = showMyPostsTab
    ? activeMenu
    : 'all';

  const handleSetMenu = (menu: 'list' | 'all') => {
    setMenu(menu);
  };

  return (
    <div className="my-2 w-full">
      <div className="flex gap-2 items-center p-1 rounded-2xl border border-ftBlue/20 bg-bgWhite">
        <button
          onClick={showMyPostsTab ? () => handleSetMenu('list') : undefined}
          disabled={!showMyPostsTab}
          tabIndex={showMyPostsTab ? 0 : -1}
          aria-hidden={!showMyPostsTab}
          className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none border ${
            resolvedActiveMenu === 'list'
              ? 'bg-ftBlue text-white border-ftBlue'
              : 'bg-white text-ftGray border-transparent hover:border-ftBlue/40 hover:text-ftBlue'
          } ${
            showMyPostsTab ? '' : 'invisible pointer-events-none select-none'
          }`}
          aria-current={resolvedActiveMenu === 'list' ? 'page' : undefined}
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
        <button
          onClick={() => handleSetMenu('all')}
          className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none border ${
            resolvedActiveMenu === 'all'
              ? 'bg-ftBlue text-white border-ftBlue'
              : 'bg-white text-ftGray border-transparent hover:border-ftBlue/40 hover:text-ftBlue'
          }`}
          aria-current={resolvedActiveMenu === 'all' ? 'page' : undefined}
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
