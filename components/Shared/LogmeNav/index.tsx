import React, { useEffect, useState } from 'react';
import { axiosInstance } from 'service/axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import * as Shared from 'components/Shared';
import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';
import { accessTokenAtom, refreshTokenAtom } from 'service/atoms/atoms';
import MobileNav from './MobileNav';
import NavPriofile from './Profile';

const MENU_ITEMS = [
  { name: 'ABOUT', path: '/about' },
  { name: 'ARTICLE', path: '/article', requiresAuth: true },
  { name: 'RESUME', path: '/resume' },
  { name: 'GITHUB', path: '/github' },
] as const;

const NavMenuItem = ({
  name,
  path,
  isActive,
  requiresAuth = false,
  isAuthenticated,
  onClick,
}: {
  name: string;
  path: string;
  isActive: boolean;
  requiresAuth?: boolean;
  isAuthenticated: boolean;
  onClick: () => void;
}) => {
  const handleClick = () => {
    if (requiresAuth && !isAuthenticated) {
      alert('로그인 먼저 해주세요.');
      return;
    }
    onClick();
  };

  return (
    <Link
      href={requiresAuth && !isAuthenticated ? '' : path}
      onClick={handleClick}
    >
      <Shared.LogmeHeadline
        type="medium"
        fontStyle="semibold"
        className={`px-4 py-2 transition-all duration-200 hover:cursor-pointer ${
          isActive
            ? 'text-beige30 bg-white rounded-3xl shadow-md'
            : 'text-gray50 hover:text-gray70'
        }`}
      >
        {name}
      </Shared.LogmeHeadline>
    </Link>
  );
};

const DesktopNavActions = ({
  isAuthenticated,
  setAuthority,
}: {
  isAuthenticated: boolean;
  setAuthority: (value: boolean) => void;
}) => {
  if (isAuthenticated) {
    return (
      <div className="items-center hidden gap-6 mobile:flex">
        <Link href="/mypage" className="transition-opacity hover:opacity-80">
          <Shared.LogmeIcon.SettingsIcon alt="설정" width={28} height={28} />
        </Link>

        <button className="transition-opacity hover:opacity-80">
          <Shared.LogmeIcon.NotificationIcon
            alt="알람"
            width={28}
            height={28}
          />
        </button>

        <NavPriofile setAuthority={setAuthority} />
      </div>
    );
  }

  return (
    <div className="items-center hidden mobile:flex">
      <Link href="/">
        <div className="border-2 border-[#000000] rounded-lg overflow-hidden">
          <button
            onClick={() => setAuthority(true)}
            className="px-4 py-2 text-xl font-medium transition-all bg-white text-black hover:bg-gray-100"
          >
            Join
          </button>
        </div>
      </Link>
    </div>
  );
};

const Nav = () => {
  const [currentPage, setCurrentPage] = useState(MENU_ITEMS[0].name);
  const [authority, setAuthority] = useState(false);
  const router = useRouter();

  const [, setAccessToken] = useRecoilState(accessTokenAtom);
  const [, setRefreshToken] = useRecoilState(refreshTokenAtom);

  const localAccessToken = LocalStorage.getItem('CVtoken');
  const localRefreshToken = Cookie.getItem('refreshToken');

  useEffect(() => {
    if (!localAccessToken && !localRefreshToken) {
      setAccessToken(localAccessToken as string);
      setRefreshToken(localRefreshToken as string);
    }
  }, [localAccessToken, localRefreshToken, setAccessToken, setRefreshToken]);

  useEffect(() => {
    if (localAccessToken) {
      setAuthority(true);
    }
  }, [localAccessToken]);

  useEffect(() => {
    const currentPath = router.asPath;
    const matchedMenu = MENU_ITEMS.find(item =>
      currentPath.includes(item.name.toLowerCase())
    );
    if (matchedMenu) {
      setCurrentPage(matchedMenu.name);
    }
  }, [router.asPath]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-24 shadow-md bg-beige10 shadow-gray-200">
      <div className="grid h-full grid-cols-12 gap-4 px-4 mx-auto max-w-7xl">
        {/* Logo */}
        <div className="flex items-center col-span-4 mobile:col-span-3">
          <Link
            href="/about"
            onClick={() => setCurrentPage('ABOUT')}
            className="flex items-center"
          >
            <Shared.LogmeIcon.NewLogo alt="로고" width={130} height={45} />
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="items-center justify-center hidden col-span-6 mobile:flex">
          <div className="flex items-center justify-center gap-2">
            {MENU_ITEMS.map(item => (
              <NavMenuItem
                key={item.name}
                name={item.name}
                path={item.path}
                isActive={currentPage === item.name}
                requiresAuth={item.requiresAuth}
                isAuthenticated={!!localAccessToken}
                onClick={() => setCurrentPage(item.name)}
              />
            ))}
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center justify-end col-span-8 gap-6 mobile:col-span-3">
          <div className="lg:hidden">
            <MobileNav />
          </div>
          <DesktopNavActions
            isAuthenticated={!!localAccessToken}
            setAuthority={setAuthority}
          />
        </div>
      </div>
    </header>
  );
};

export default Nav;
