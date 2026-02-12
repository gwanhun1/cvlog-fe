import { GiHamburgerMenu } from 'react-icons/gi';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  useToast,
  LogmeDropdown,
  DropdownHeader,
  DropdownItem,
} from 'components/Shared';
import { handleSignOut } from 'utils/auth';
import Loader from '../common/Loader';
import LocalStorage from 'public/utils/Localstorage';
import { useStore } from 'service/store/useStore';

const menu = ['Article', 'Resume', 'Github'];

interface MobileNavProps {
  isLoading: boolean;
}

const MobileNav = ({ isLoading }: MobileNavProps) => {
  const [page, setPage] = useState(menu[0]);
  const [token, setToken] = useState<string | null>(null);
  const setAuthority = useStore((state) => state.setAuthorityState);
  const userInfo = useStore((state) => state.userIdAtom);
  const { showToast } = useToast();

  useEffect(() => {
    const checkToken = () => {
      const accessToken = LocalStorage.getItem('LogmeToken');
      setToken(accessToken);
    };

    checkToken();

    window.addEventListener('storage', checkToken);

    return () => {
      window.removeEventListener('storage', checkToken);
    };
  }, [isLoading]);

  const onClickLogout = async () => {
    await handleSignOut((value: string | null) => setAuthority(!!value));
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <nav>
      <LogmeDropdown
        trigger={
          <GiHamburgerMenu className="mb-1 ml-2 w-5 h-5 stroke-gray-800" />
        }
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
                {userInfo?.github_id || '아이디가 없어요'}
              </div>
              <div className="text-xs text-gray-500">
                {userInfo?.name
                  ? `${userInfo.name}님 환영합니다`
                  : '이름을 등록해주세요.'}
              </div>
            </div>
          </DropdownHeader>
        )}

        <Link key="Home" href="/" prefetch={true}>
          <DropdownItem
            onClick={() => setPage('Home')}
            className={page === 'Home' ? 'text-ftBlue font-bold' : ''}
          >
            Home
          </DropdownItem>
        </Link>
        {menu.map(list => (
          <Link key={list} href={`/${list.toLowerCase()}`} prefetch={true}>
            <DropdownItem
              onClick={() => setPage(list)}
              className={page === list ? 'text-ftBlue font-bold' : ''}
            >
              {list}
            </DropdownItem>
          </Link>
        ))}

        {token ? (
          <>
            <DropdownItem onClick={onClickLogout} danger>
              로그아웃
            </DropdownItem>
            <Link href="/mypage" prefetch={true}>
              <DropdownItem>Setting</DropdownItem>
            </Link>
          </>
        ) : (
          <>
            <Link href="/login" prefetch={true}>
              <DropdownItem>로그인</DropdownItem>
            </Link>
            <DropdownItem
              onClick={() => showToast('로그인 먼저 해주세요.', 'warning')}
            >
              Setting
            </DropdownItem>
          </>
        )}

        <DropdownItem>
          <span className="flex gap-2 items-center">
            Alarm
            {token && (
              <span className="w-2 h-2 rounded-full animate-ping bg-ftBlue" />
            )}
          </span>
        </DropdownItem>
      </LogmeDropdown>
    </nav>
  );
};

export default MobileNav;
