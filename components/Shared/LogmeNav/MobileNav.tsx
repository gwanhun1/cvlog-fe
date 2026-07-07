import { GiHamburgerMenu } from 'react-icons/gi';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  useToast,
  LogmeDropdown,
  DropdownHeader,
  DropdownItem,
  LogmeNotification,
} from 'components/Shared';
import { handleSignOut } from 'utils/auth';
import Loader from '../common/Loader';
import LocalStorage from 'public/utils/Localstorage';
import { useStore } from 'service/store/useStore';

const MENU_ITEMS = [
  { label: 'Home', path: '/', authRequired: false },
  { label: 'Article', path: '/article', authRequired: false },
  { label: 'Resume', path: '/resume', authRequired: false },
  { label: 'GitHub', path: '/github', authRequired: true },
];

interface MobileNavProps {
  isLoading: boolean;
  isAuth: boolean;
}

const MobileNav = ({ isLoading, isAuth }: MobileNavProps) => {
  const [token, setToken] = useState<string | null>(null);
  const setAuthority = useStore(state => state.setAuthorityState);
  const userInfo = useStore(state => state.userIdAtom);
  const { showToast } = useToast();
  const { pathname } = useRouter();

  useEffect(() => {
    const checkToken = () => {
      const accessToken = LocalStorage.getItem('LogmeToken');
      setToken(accessToken);
    };

    checkToken();
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, [isLoading]);

  const onClickLogout = async () => {
    await handleSignOut((value: string | null) => setAuthority(!!value));
  };

  if (isLoading) {
    return <Loader />;
  }

  const visibleMenuItems = MENU_ITEMS.filter(
    item => !item.authRequired || !!token,
  );

  return (
    <nav>
      <LogmeDropdown
        trigger={<GiHamburgerMenu className="w-5 h-5 text-gray-700" />}
        align="right"
      >
        {token && (
          <DropdownHeader>
            <div className="flex flex-col items-center space-y-2">
              <img
                src={userInfo?.profile_image || '/images/github.png'}
                alt="User"
                className="object-cover w-10 h-10 rounded-full"
              />
              <div className="text-sm font-semibold text-gray-900">
                {userInfo?.github_id}
              </div>
              <div className="text-xs text-gray-500">
                {userInfo?.name
                  ? `${userInfo.name}님 환영합니다`
                  : userInfo?.github_id}
              </div>
            </div>
          </DropdownHeader>
        )}

        {isAuth && (
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm text-gray-500">알림</span>
            <LogmeNotification />
          </div>
        )}

        {visibleMenuItems.map(item => (
          <Link key={item.path} href={item.path}>
            <DropdownItem
              className={
                pathname === item.path ||
                (item.path !== '/' && pathname.startsWith(item.path))
                  ? 'text-ftBlue font-bold'
                  : ''
              }
            >
              {item.label}
            </DropdownItem>
          </Link>
        ))}

        {token ? (
          <>
            <Link href="/mypage">
              <DropdownItem
                className={
                  pathname === '/mypage' ? 'text-ftBlue font-bold' : ''
                }
              >
                마이페이지/설정
              </DropdownItem>
            </Link>
            <DropdownItem onClick={onClickLogout} danger>
              로그아웃
            </DropdownItem>
          </>
        ) : (
          <>
            <Link href="/login">
              <DropdownItem>로그인</DropdownItem>
            </Link>
            <DropdownItem
              onClick={() => showToast('로그인 먼저 해주세요.', 'warning')}
            >
              마이페이지/설정
            </DropdownItem>
          </>
        )}
      </LogmeDropdown>
    </nav>
  );
};

export default MobileNav;
