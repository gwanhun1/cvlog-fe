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

  useEffect(() => {
    if (hasToken === false && activeMenu === 'list') {
      setMenu('all');
    }
  }, [activeMenu, hasToken, setMenu]);

  const isReady = hasToken !== null;
  const showMyPostsTab = hasToken === true;
  const resolvedActiveMenu: 'list' | 'all' | null =
    hasToken === null ? null : showMyPostsTab ? activeMenu : 'all';

  const handleSetMenu = (menu: 'list' | 'all') => {
    setMenu(menu);
  };

  return (
    <div className="w-full">
      <div className="flex gap-1 items-center p-1 rounded-xl bg-gray-100">
        <button
          onClick={
            isReady && showMyPostsTab ? () => handleSetMenu('list') : undefined
          }
          disabled={!isReady || !showMyPostsTab}
          tabIndex={isReady && showMyPostsTab ? 0 : -1}
          aria-hidden={!showMyPostsTab}
          className={`flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-150 focus:outline-none ${
            resolvedActiveMenu === 'list'
              ? 'bg-white text-ftBlue shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          } ${
            showMyPostsTab ? '' : 'hidden'
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
          onClick={isReady ? () => handleSetMenu('all') : undefined}
          disabled={!isReady}
          className={`flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-150 focus:outline-none ${
            resolvedActiveMenu === 'all'
              ? 'bg-white text-ftBlue shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
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
