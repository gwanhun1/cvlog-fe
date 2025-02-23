import React, { useEffect, useState } from 'react';
import { Avatar, Dropdown } from 'flowbite-react';
import Link from 'next/link';
import { useRecoilState, useRecoilValue } from 'recoil';
import * as Shared from 'components/Shared';
import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';
import { authorityState, userIdAtom } from 'service/atoms/atoms';
import { handleSignOut } from 'utils/auth';

const menu = ['About', 'Article', 'Resume', 'Github'];

const MobileNav = () => {
  const [page, setPage] = useState(menu[0]);
  const [token, setToken] = useState(LocalStorage.getItem('CVtoken'));
  const [cvRefreshToken, setCvRefreshToken] = useState(
    Cookie.getItem('refreshToken')
  );
  const [_, setAuthority] = useRecoilState(authorityState);
  const userInfo = useRecoilValue(userIdAtom);

  useEffect(() => {
    setToken(LocalStorage.getItem('CVtoken'));
    setCvRefreshToken(Cookie.getItem('refreshToken'));
  }, []);

  const onClickLogout = async () => {
    await handleSignOut((value: string | null) => setAuthority(!!value));
  };

  return (
    <nav>
      {userInfo.id && (
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Shared.LogmeIcon.BurgerIcon
              alt="햄버거"
              width={20}
              height={20}
              cn="ml-2 mb-1 stroke-gray-800"
            />
          }
        >
          {token && (
            <Dropdown.Header>
              <div className="flex flex-col items-center">
                <Avatar
                  alt="User settings"
                  img={userInfo?.profile_image || '/images/github.png'}
                  size="sm"
                  rounded
                />
                <div className="text-xs">
                  {userInfo?.github_id || '아이디가 없어요'}
                </div>
                <div className="text-xs">
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
              href={`/${list !== 'About' ? list.toLowerCase() : ''}`}
              className="flex justify-center px-4 py-1"
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

          <div className="flex flex-col justify-center w-28">
            {token ? (
              <>
                <button
                  className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                  onClick={onClickLogout}
                >
                  로그아웃
                </button>
                <Dropdown.Item className="flex justify-center">
                  <Link href="/mypage">Setting</Link>
                </Dropdown.Item>
              </>
            ) : (
              <>
                <Dropdown.Item className="flex justify-center">
                  <Link href="/about">로그인</Link>
                </Dropdown.Item>
                <Dropdown.Item className="flex justify-center">
                  <Link href="/" onClick={() => alert('로그인 먼저 해주세요.')}>
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
          </div>
        </Dropdown>
      )}
    </nav>
  );
};

export default MobileNav;
