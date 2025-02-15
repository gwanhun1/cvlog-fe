import React, { useEffect, useState } from 'react';
import { Avatar, Dropdown } from 'flowbite-react';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import * as Shared from 'components/Shared';
import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';
import { authorityState } from 'service/atoms/atoms';
import { useGetUserInfo } from 'service/hooks/Login';
import { handleSignOut } from 'utils/auth';
import { useRouter } from 'next/router';

const MobileNav = () => {
  const router = useRouter();
  const menu = ['About', 'Article', 'Resume', 'Github'];
  const [page, setPage] = useState(menu[0]);

  const accessToken = LocalStorage.getItem('CVtoken');
  const [token, setToken] = useState(accessToken);

  const refreshToken = Cookie.getItem('refreshToken');
  const [cvRefreshToken, setCvRefreshToken] = useState(refreshToken);
  const info = useGetUserInfo().data;
  const [authority, setAuthority] = useRecoilState(authorityState);

  useEffect(() => {
    setToken(accessToken);
    setCvRefreshToken(cvRefreshToken);
  }, [accessToken, cvRefreshToken]);

  const onClickLogout = async () => {
    await handleSignOut((value: string | null) => setAuthority(!!value));
  };

  return (
    <nav>
      {info && (
        <>
          <Dropdown
            arrowIcon={false}
            inline={true}
            label={
              <Shared.LogmeIcon.BurgerIcon
                alt={'햄버거'}
                width={20}
                height={20}
                cn="ml-2 mb-1 stroke-gray-800"
              />
            }
          >
            {token && token !== null && (
              <Dropdown.Header>
                <div className="flex flex-col ">
                  <Avatar
                    alt="User settings"
                    img={`${info ? info.profile_image : '/images/github.png'}`}
                    size="sm"
                    rounded={true}
                  />
                  <div className="flex items-end truncate text-[10px] justify-center">
                    {info ? info.github_id : '아이디가 없어요'}
                  </div>
                  <div className="flex items-end truncate text-[10px] justify-center">
                    {info && info.name !== null
                      ? info.name + '님 환영합니다'
                      : '이름을 등록해주세요.'}
                  </div>
                </div>
              </Dropdown.Header>
            )}
            {menu.map((list: string) => (
              <Link
                key={list}
                href={`/${list !== 'About' ? list.toLowerCase() : ''}`}
                className="flex justify-center px-4 py-1 z-[999]"
              >
                <input
                  type="button"
                  className={`flex  ${
                    page === list ? 'text-blue-700 ' : 'text-gray-400 '
                  } hover:cursor-pointer hover:text-blue-700 `}
                  onClick={() => {
                    setPage(list);
                  }}
                  value={list}
                />
              </Link>
            ))}
            <div className="flex flex-col justify-center w-28 ">
              {token && token !== null ? (
                <button
                  className="flex w-full items-center justify-center rounded-lg  px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                  onClick={onClickLogout}
                >
                  로그아웃
                </button>
              ) : (
                <Dropdown.Item className="flex justify-center">
                  <Link href={'/about'}>
                    <div>로그인</div>
                  </Link>
                </Dropdown.Item>
              )}
              <Dropdown.Item className="flex justify-center">
                Alarm
                <div
                  className={`w-2 h-2 mb-4  bg-blue-700 rounded-full ${
                    token && token !== null ? 'animate-ping' : 'hidden'
                    //FIXME 알람 구현 시 수정 localToken =>localToken && alarmData
                  }`}
                ></div>
              </Dropdown.Item>
              <Dropdown.Item className="flex justify-center">
                <Link
                  href={`${token ? '/mypage' : '/'}`}
                  onClick={() => !token && alert('로그인 먼저 해주세요.')}
                >
                  Setting
                </Link>
              </Dropdown.Item>
            </div>
          </Dropdown>
        </>
      )}
    </nav>
  );
};

const MobileNavWrapper = () => {
  return (
    <div className="desktop:hidden">
      <MobileNav />
    </div>
  );
};

export default MobileNavWrapper;
