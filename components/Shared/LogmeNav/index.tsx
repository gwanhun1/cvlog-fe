import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import * as Shared from 'components/Shared';
import NavMenuItem from './NavMenuItem';
import DesktopNavActions from './DesktopNavActions';
import MobileNav from './MobileNav';
import useIsLogin from 'hooks/useIsLogin';
import LocalStorage from 'public/utils/Localstorage';
import { cn } from 'styles/utils';

const MENU_ITEMS = [
  { name: 'HOME', path: '/', requiresAuth: false },
  { name: 'ARTICLE', path: '/article', requiresAuth: false },
  { name: 'RESUME', path: '/resume', requiresAuth: true },
  { name: 'GITHUB', path: '/github', requiresAuth: true },
] as const;

const Nav = () => {
  const { isAuthenticated, isLoading } = useIsLogin();
  const [hasToken, setHasToken] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 50px만 내려가도 즉시 축소하여 화면 영역 확보
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 w-full transition-all duration-300 border-b shadow-sm backdrop-blur-lg border-slate-200/60 bg-white/70',
        isScrolled ? 'h-12' : 'h-24'
      )}
    >
      <div className="grid grid-cols-12 gap-4 px-4 mx-auto max-w-7xl h-full">
        <div className="flex col-span-4 items-center tablet:col-span-3">
          <Link href="/" className="flex items-center group" prefetch={true}>
            <div className="transition-all duration-300 transform group-hover:scale-105">
              <Shared.LogmeIcon.LogmeMarkIcon
                alt="로고"
                width={isScrolled ? 40 : 72}
                height={isScrolled ? 40 : 72}
              />
            </div>
          </Link>
        </div>

        <nav className="hidden col-span-6 justify-center items-center tablet:flex">
          <div className="flex gap-1 justify-center items-center">
            {MENU_ITEMS.map(item => (
              <NavMenuItem
                key={item.name}
                {...item}
                isAuthenticated={isAuth}
                shrink={isScrolled}
              />
            ))}
          </div>
        </nav>

        <div className="flex col-span-8 gap-4 justify-end items-center tablet:col-span-3">
          <div className="tablet:hidden">
            <MobileNav isLoading={isLoading} />
          </div>
          <DesktopNavActions
            isAuthenticated={isAuth}
            setAuthority={() => {}}
            isLoading={isLoading}
            shrink={isScrolled}
          />
        </div>
      </div>
    </header>
  );
};

export default Nav;
