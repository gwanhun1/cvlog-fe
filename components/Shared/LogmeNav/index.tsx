import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { atom, useRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import * as Shared from 'components/Shared';
import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';
import { accessTokenAtom, refreshTokenAtom } from 'service/atoms/atoms';
import { UserId } from 'service/atoms/type';
import MobileNav from './MobileNav';
import NavPriofile from './Profile';

axios.defaults.withCredentials = true;

const Nav = () => {
  const menu = ['ABOUT', 'ARTICLE', 'RESUME', 'GITHUB'];
  const [page, setPage] = useState(menu[0]);
  const [authority, setAuthority] = useState<boolean>(false);
  const router = useRouter();

  // nav바 현재 페이지 확인
  const urlHasAbout = router.asPath.includes('about');
  const urlHasArticle = router.asPath.includes('article');
  const urlHasResume = router.asPath.includes('resume');
  const urlHasGithub = router.asPath.includes('github');

  useEffect(() => {
    if (urlHasAbout) setPage('ABOUT');
    else if (urlHasArticle) setPage('ARTICLE');
    else if (urlHasResume) setPage('RESUME');
    else if (urlHasGithub) setPage('GITHUB');
  }, [router.asPath]);

  // 토큰 전역처리
  const localAccessToken = LocalStorage.getItem('CVtoken');
  const localRefreshToken = Cookie.getItem('refreshToken');
  const [, setAccessToken] = useRecoilState(accessTokenAtom);
  const [, setRefreshToken] = useRecoilState(refreshTokenAtom);

  if (!localAccessToken && !localRefreshToken) {
    setAccessToken(localAccessToken as string);
    setRefreshToken(localRefreshToken as string);
  }

  useEffect(() => {
    if (localAccessToken && localAccessToken !== null) {
      setAuthority(true);
    }
  }, [localAccessToken]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-24 shadow-md bg-beige10 shadow-gray-200">
      <div className="grid h-full grid-cols-12 gap-4 px-4 mx-auto max-w-7xl">
        {/* 로고 섹션 - 모바일에서는 4칸, 데스크탑에서는 3칸 */}
        <div className="flex items-center col-span-4 mobile:col-span-3">
          <Link
            href="/about"
            onClick={() => setPage('About')}
            className="flex items-center"
          >
            <Shared.LogmeIcon.NewLogo alt="로고" width={130} height={45} />
          </Link>
        </div>

        {/* 메뉴 리스트 섹션 - 모바일에서는 숨김, 데스크탑에서는 6칸 */}
        <nav className="items-center justify-center hidden col-span-6 mobile:flex">
          <div className="flex items-center justify-center gap-2">
            {menu.map(list => (
              <Link
                key={list}
                href={`/${
                  list === 'Article' && localAccessToken === null
                    ? ''
                    : list.toLowerCase()
                }`}
                onClick={() => {
                  if (list === 'Article' && localAccessToken === null) {
                    alert('로그인 먼저 해주세요.');
                  }
                  setPage(list);
                }}
              >
                <Shared.LogmeHeadline
                  type="medium"
                  fontStyle="semibold"
                  className={`px-4  py-2 transition-all duration-200 hover:cursor-pointer ${
                    page === list
                      ? 'text-beige30 bg-white rounded-3xl shadow-md'
                      : 'text-gray50 hover:text-gray70'
                  }`}
                >
                  {list}
                </Shared.LogmeHeadline>
              </Link>
            ))}
          </div>
        </nav>

        {/* 우측 메뉴 섹션 - 모바일에서는 8칸, 데스크탑에서는 3칸 */}
        <div className="flex items-center justify-end col-span-8 gap-6 mobile:col-span-3">
          {/* 모바일 메뉴 토글 */}
          <div className="mobile:hidden">
            <MobileNav />
          </div>

          {/* 데스크탑 메뉴 아이템들 */}
          <div className="items-center hidden gap-6 mobile:flex">
            <Link
              href={authority ? '/mypage' : '/'}
              onClick={() => !authority && alert('로그인 먼저 해주세요.')}
              className="transition-opacity hover:opacity-80"
            >
              <Shared.LogmeIcon.SettingsIcon
                alt="설정"
                width={28}
                height={28}
              />
            </Link>

            <button className="transition-opacity hover:opacity-80">
              <Shared.LogmeIcon.NotificationIcon
                alt="알람"
                width={28}
                height={28}
              />
            </button>

            {authority && localAccessToken !== null ? (
              <NavPriofile setAuthority={setAuthority} />
            ) : (
              <Link href="/">
                <button
                  onClick={() => setAuthority(true)}
                  className="px-4 py-2 text-sm font-medium transition-all border border-black rounded-lg text-ftBlick hover:bg-gray-100"
                >
                  Join
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;

const recoilLocalStorage =
  typeof window !== 'undefined' ? window.localStorage : undefined;

const { persistAtom } = recoilPersist({
  key: 'recoil-persist',
  storage: recoilLocalStorage,
});

export const userIdAtom = atom<UserId>({
  key: 'userId',
  default: { id: 999999 },
  effects_UNSTABLE: [persistAtom],
});
