import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';
import * as Shared from 'components/Shared';
import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';
import { accessTokenAtom, refreshTokenAtom } from 'service/atoms/atoms';
import NavMenuItem from './NavMenuItem';
import DesktopNavActions from './DesktopNavActions';
import MobileNav from './MobileNav';

const MENU_ITEMS = [
  { name: 'ABOUT', path: '/about', requiresAuth: false },
  { name: 'ARTICLE', path: '/article', requiresAuth: false },
  { name: 'RESUME', path: '/resume', requiresAuth: true },
  { name: 'GITHUB', path: '/github', requiresAuth: true },
] as const;

const Nav = () => {
  const [currentPage, setCurrentPage] = useState<
    (typeof MENU_ITEMS)[number]['name']
  >(MENU_ITEMS[0].name);
  const router = useRouter();
  const setAccessToken = useSetRecoilState(accessTokenAtom);
  const setRefreshToken = useSetRecoilState(refreshTokenAtom);

  const localAccessToken = useMemo(() => LocalStorage.getItem('CVtoken'), []);
  const localRefreshToken = useMemo(() => Cookie.getItem('refreshToken'), []);

  useEffect(() => {
    setAccessToken(localAccessToken || '');
    setRefreshToken(localRefreshToken || '');
  }, [localAccessToken, localRefreshToken, setAccessToken, setRefreshToken]);

  const isAuthenticated = !!localAccessToken;

  useEffect(() => {
    const currentPath = router.asPath.toLowerCase();
    const matchedMenu = MENU_ITEMS.find(item =>
      currentPath.startsWith(item.path)
    );
    if (matchedMenu) {
      setCurrentPage(matchedMenu.name);
    }
  }, [router.asPath]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-24 shadow-md bg-bgWhite shadow-gray-200">
      <div className="grid h-full grid-cols-12 gap-4 px-4 mx-auto max-w-7xl">
        <div className="flex items-center col-span-4 tablet:col-span-3">
          <Link href="/about" className="flex items-center">
            <Shared.LogmeIcon.NavLogo alt="로고" width={70} height={70} />
          </Link>
        </div>

        <nav className="items-center justify-center hidden col-span-6 tablet:flex">
          <div className="flex items-center justify-center gap-2">
            {MENU_ITEMS.map(item => (
              <NavMenuItem
                key={item.name}
                {...item}
                isActive={currentPage === item.name}
                isAuthenticated={isAuthenticated}
                onClick={() => setCurrentPage(item.name)}
              />
            ))}
          </div>
        </nav>

        <div className="flex items-center justify-end col-span-8 gap-6 tablet:col-span-3">
          {isAuthenticated && (
            <div className="tablet:hidden">
              <MobileNav />
            </div>
          )}
          <DesktopNavActions
            isAuthenticated={isAuthenticated}
            setAuthority={() => {}}
          />
        </div>
      </div>
    </header>
  );
};

export default Nav;
