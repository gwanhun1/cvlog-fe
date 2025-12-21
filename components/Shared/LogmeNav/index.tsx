import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import * as Shared from 'components/Shared';
import NavMenuItem from './NavMenuItem';
import DesktopNavActions from './DesktopNavActions';
import MobileNav from './MobileNav';
import useIsLogin from 'hooks/useIsLogin';
import LocalStorage from 'public/utils/Localstorage';

const MENU_ITEMS = [
  { name: 'HOME', path: '/', requiresAuth: false },
  { name: 'ARTICLE', path: '/article', requiresAuth: false },
  { name: 'RESUME', path: '/resume', requiresAuth: true },
  { name: 'GITHUB', path: '/github', requiresAuth: true },
] as const;

const Nav = () => {
  const { isAuthenticated, isLoading } = useIsLogin();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = LocalStorage.getItem('LogmeToken');
      setHasToken(!!token);
    };

    checkToken();

    window.addEventListener('storage', checkToken);

    return () => {
      window.removeEventListener('storage', checkToken);
    };
  }, [isAuthenticated]);

  const isAuth = hasToken || isAuthenticated;

  return (
    <header className="fixed top-0 right-0 left-0 z-50 w-full h-24 border-b shadow-sm backdrop-blur-md border-slate-200/80 bg-white/80">
      <div className="grid grid-cols-12 gap-4 px-4 mx-auto max-w-7xl h-full">
        <div className="flex col-span-4 items-center tablet:col-span-3">
          <Link href="/" className="flex items-center" prefetch={true}>
            <Shared.LogmeIcon.LogmeMarkIcon alt="로고" width={72} height={72} />
          </Link>
        </div>

        <nav className="hidden col-span-6 justify-center items-center tablet:flex">
          <div className="flex gap-2 justify-center items-center">
            {MENU_ITEMS.map(item => (
              <NavMenuItem key={item.name} {...item} isAuthenticated={isAuth} />
            ))}
          </div>
        </nav>

        <div className="flex col-span-8 gap-6 justify-end items-center tablet:col-span-3">
          <div className="tablet:hidden">
            <MobileNav isLoading={isLoading} />
          </div>
          <DesktopNavActions
            isAuthenticated={isAuth}
            setAuthority={() => {}}
            isLoading={isLoading}
          />
        </div>
      </div>
    </header>
  );
};

export default Nav;
