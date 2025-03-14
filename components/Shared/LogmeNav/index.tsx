import React from 'react';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import * as Shared from 'components/Shared';
import { accessTokenAtom } from 'service/atoms/atoms';
import NavMenuItem from './NavMenuItem';
import DesktopNavActions from './DesktopNavActions';
import MobileNav from './MobileNav';

const MENU_ITEMS = [
  { name: 'HOME', path: '/', requiresAuth: false },
  { name: 'ARTICLE', path: '/article', requiresAuth: false },
  { name: 'RESUME', path: '/resume', requiresAuth: true },
  { name: 'GITHUB', path: '/github', requiresAuth: true },
] as const;

const Nav = () => {
  const [accessToken] = useRecoilState(accessTokenAtom);

  const isAuthenticated = !!accessToken;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-24 shadow-md bg-bgWhite shadow-gray-200">
      <div className="grid h-full grid-cols-12 gap-4 px-4 mx-auto max-w-7xl">
        <div className="flex items-center col-span-4 tablet:col-span-3">
          <Link href="/" className="flex items-center" prefetch={true}>
            <Shared.LogmeIcon.NavLogo alt="로고" width={70} height={70} />
          </Link>
        </div>

        <nav className="items-center justify-center hidden col-span-6 tablet:flex">
          <div className="flex items-center justify-center gap-2">
            {MENU_ITEMS.map(item => (
              <NavMenuItem
                key={item.name}
                {...item}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        </nav>

        <div className="flex items-center justify-end col-span-8 gap-6 tablet:col-span-3">
          <div className="tablet:hidden">
            <MobileNav />
          </div>
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
