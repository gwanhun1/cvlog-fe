import LocalStorage from 'public/utils/Localstorage';
import React from 'react';

interface MenuTabProps {
  setMenu: React.Dispatch<React.SetStateAction<'list' | 'all'>>;
  activeMenu?: 'list' | 'all';
}

const MenuTab: React.FC<MenuTabProps> = ({ setMenu, activeMenu = 'list' }) => {
  const accessToken = LocalStorage.getItem('LogmeToken');
  const handleSetMenu = (menu: 'list' | 'all') => {
    setMenu(menu);
  };

  return (
    <div className="w-full  rounded-lg shadow-sm my-3">
      <div className="flex items-center justify-center">
        {accessToken && (
          <button
            onClick={() => handleSetMenu('list')}
            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-l-lg transition-colors duration-200 focus:outline-none
            ${
              activeMenu === 'list'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-current={activeMenu === 'list' ? 'page' : undefined}
          >
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
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
            </div>
          </button>
        )}
        <button
          onClick={() => handleSetMenu('all')}
          className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-r-lg transition-colors duration-200 focus:outline-none
            ${
              activeMenu === 'all'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          aria-current={activeMenu === 'all' ? 'page' : undefined}
        >
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
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
          </div>
        </button>
      </div>
    </div>
  );
};

export default MenuTab;
