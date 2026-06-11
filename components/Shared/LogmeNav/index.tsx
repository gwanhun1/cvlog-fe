import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import * as Shared from 'components/Shared';
import NavMenuItem from './NavMenuItem';
import DesktopNavActions from './DesktopNavActions';
import MobileNav from './MobileNav';
import useIsLogin from 'hooks/useIsLogin';
import LocalStorage from 'public/utils/Localstorage';
import { cn } from 'styles/utils';
import { usePushNotification } from 'hooks/usePushNotification';

const MENU_ITEMS = [
  { name: 'HOME', path: '/', requiresAuth: false, hideWhenGuest: false },
  { name: 'ARTICLE', path: '/article', requiresAuth: false, hideWhenGuest: false },
  { name: 'RESUME', path: '/resume', requiresAuth: false, hideWhenGuest: false },
  { name: 'GITHUB', path: '/github', requiresAuth: false, hideWhenGuest: true },
];

const Nav = () => {
  const { isAuthenticated, isLoading } = useIsLogin();
  const [hasToken, setHasToken] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--header-height', '64px');

    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      document.documentElement.style.setProperty('--header-height', scrolled ? '40px' : '64px');
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

  usePushNotification();

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 w-full transition-all duration-300 border-b shadow-sm backdrop-blur-lg border-slate-200/60 bg-white/70',
        isScrolled ? 'h-10' : 'h-16'
      )}
    >
      <div className="grid grid-cols-12 gap-4 px-4 mx-auto max-w-7xl h-full">
        <div className="flex col-span-4 items-center tablet:col-span-3">
          <Link href="/" className="flex items-center group" prefetch={true}>
            <div className="transition-all duration-300 transform group-hover:scale-105">
              <Shared.LogmeIcon.LogmeMarkIcon
                alt="로고"
                width={isScrolled ? 28 : 52}
                height={isScrolled ? 28 : 52}
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

        <div className="flex col-span-8 gap-2 justify-end items-center tablet:col-span-3">
          <div className="hidden tablet:flex">
            {isAuth && <Shared.LogmeNotification />}
          </div>
          <div className="tablet:hidden">
            <MobileNav isLoading={isLoading} isAuth={isAuth} />
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
