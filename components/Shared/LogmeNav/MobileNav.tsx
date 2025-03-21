import { GiHamburgerMenu } from 'react-icons/gi';
import React, { useEffect, useState } from 'react';
import { Avatar, Dropdown } from 'flowbite-react';
import Link from 'next/link';
import { useRecoilState, useRecoilValue } from 'recoil';
import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';
import { authorityState, userIdAtom } from 'service/atoms/atoms';
import { handleSignOut } from 'utils/auth';
import Loader from '../common/Loader';

const menu = ['Home', 'Article', 'Resume', 'Github'];

interface MobileNavProps {
  isLoading: boolean;
}

const MobileNav = ({ isLoading }: MobileNavProps) => {
  const [page, setPage] = useState(menu[0]);
  const [token, setToken] = useState(LocalStorage.getItem('LogmeToken'));
  const [profile_image, setLogmeRefreshToken] = useState(
    Cookie.getItem('refreshToken')
  );
  const [authority, setAuthority] = useRecoilState(authorityState);
  const userInfo = useRecoilValue(userIdAtom);

  useEffect(() => {
    setToken(LocalStorage.getItem('LogmeToken'));
    setLogmeRefreshToken(Cookie.getItem('refreshToken'));
  }, []);

  const onClickLogout = async () => {
    await handleSignOut((value: string | null) => setAuthority(!!value));
  };

  return (
    <nav>
      {isLoading ? (
        <Loader />
      ) : (
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <GiHamburgerMenu className="ml-2 mb-1 stroke-gray-800 w-5 h-5" />
          }
        >
          {token && (
            <Dropdown.Header>
              <div className="flex flex-col items-center space-y-2">
                <Avatar
                  alt="User settings"
                  img={userInfo?.profile_image || '/images/github.png'}
                  size="sm"
                  rounded
                />
                <div className="text-md">
                  {userInfo?.github_id || '아이디가 없어요'}
                </div>
                <div className="text-[10px] text-gray-600">
                  {userInfo?.name
                    ? `${userInfo.name}님 환영합니다`
                    : '이름을 등록해주세요.'}
                </div>
              </div>
            </Dropdown.Header>
          )}

          {menu.map(list => (
            <Link
              key={list}
              href={`/${list.toLowerCase()}`}
              className="flex justify-center px-4 py-1"
              prefetch={true}
            >
              <input
                type="button"
                className={`flex ${
                  page === list ? 'text-blue-700' : 'text-gray-400'
                } hover:cursor-pointer hover:text-blue-700`}
                onClick={() => setPage(list)}
                value={list}
              />
            </Link>
          ))}

          {token ? (
            <>
              <button
                className="flex w-full items-center justify-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                onClick={onClickLogout}
              >
                로그아웃
              </button>
              <Dropdown.Item className="flex justify-center">
                <Link href="/mypage" prefetch={true}>
                  Setting
                </Link>
              </Dropdown.Item>
            </>
          ) : (
            <>
              <Dropdown.Item className="flex justify-center">
                <Link href="/login" prefetch={true}>
                  로그인
                </Link>
              </Dropdown.Item>
              <Dropdown.Item className="flex justify-center">
                <Link
                  href="/mypage"
                  onClick={() => alert('로그인 먼저 해주세요.')}
                  prefetch={true}
                >
                  Setting
                </Link>
              </Dropdown.Item>
            </>
          )}
          <Dropdown.Item className="flex justify-center">
            Alarm
            <div
              className={`w-2 h-2 mb-4 bg-blue-700 rounded-full ${
                token ? 'animate-ping' : 'hidden'
              }`}
            ></div>
          </Dropdown.Item>
        </Dropdown>
      )}
    </nav>
  );
};

export default MobileNav;
