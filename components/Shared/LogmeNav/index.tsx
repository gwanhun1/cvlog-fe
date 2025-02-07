import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import * as Shared from 'components/Shared';
import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';
import { accessTokenAtom, refreshTokenAtom } from 'service/atoms/atoms';
import MobileNav from './MobileNav';
import NavPriofile from './Profile';

const MENU_ITEMS: { name: string; path: string; requiresAuth: boolean }[] = [
  { name: 'ABOUT', path: '/about', requiresAuth: false },
  { name: 'ARTICLE', path: '/article', requiresAuth: false },
  { name: 'RESUME', path: '/resume', requiresAuth: true },
  { name: 'GITHUB', path: '/github', requiresAuth: true },
];

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
      alert('로그인이 필요합니다.');
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
      <div className="items-center hidden gap-6 tablet:flex">
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
    <div className="items-center hidden tablet:flex">
      <Link href="/">
        <Shared.LogmeButton
          variant="classic"
          size="small"
          onClick={() => setAuthority(true)}
        >
          <Shared.LogmeHeadline
            type="medium"
            fontStyle="semibold"
            style={{ color: '#fff' }}
          >
            Join
          </Shared.LogmeHeadline>
        </Shared.LogmeButton>
      </Link>
    </div>
  );
};

const Nav = () => {
  const [currentPage, setCurrentPage] = useState<
    (typeof MENU_ITEMS)[number]['name']
  >(MENU_ITEMS[0].name);

  const [, setAuthority] = useState(false);
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
        <div className="flex items-center col-span-4 tablet:col-span-3">
          <Link
            href="/about"
            onClick={() => setCurrentPage('ABOUT')}
            className="flex items-center"
          >
            <Shared.LogmeIcon.NavLogo alt="로고" width={70} height={70} />
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="items-center justify-center hidden col-span-6 tablet:flex">
          <div className="flex items-center justify-center gap-2">
            {MENU_ITEMS.map(item => (
              <NavMenuItem
                key={item.name}
                name={item.name}
                path={item.path}
                isActive={currentPage === item.name}
                requiresAuth={item.requiresAuth ?? false}
                isAuthenticated={!!localAccessToken}
                onClick={() => setCurrentPage(item.name)}
              />
            ))}
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center justify-end col-span-8 gap-6 tablet:col-span-3">
          <div className="tablet:hidden">
            {localAccessToken && <MobileNav />}
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
