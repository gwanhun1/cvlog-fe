import { GiHamburgerMenu } from 'react-icons/gi';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  useToast,
  LogmeDropdown,
  DropdownHeader,
  DropdownItem,
} from 'components/Shared';
import {
  authorityState,
  userIdAtom,
  accessTokenAtom,
} from 'service/atoms/atoms';
import { handleSignOut } from 'utils/auth';
import Loader from '../common/Loader';

const menu = ['Home', 'Article', 'Resume', 'Github'];

interface MobileNavProps {
  isLoading: boolean;
}

const MobileNav = ({ isLoading }: MobileNavProps) => {
  const [page, setPage] = useState(menu[0]);
  const token = useRecoilValue(accessTokenAtom);
  const [, setAuthority] = useRecoilState(authorityState);
  const userInfo = useRecoilValue(userIdAtom);
  const { showToast } = useToast();

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
          <GiHamburgerMenu className="ml-2 mb-1 stroke-gray-800 w-5 h-5" />
        }
        align="right"
      >
        {token && (
          <DropdownHeader>
            <div className="flex flex-col items-center space-y-2">
              <img
                src={userInfo?.profile_image || '/images/github.png'}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
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
          <span className="flex items-center gap-2">
            Alarm
            {token && (
              <span className="w-2 h-2 bg-ftBlue rounded-full animate-ping" />
            )}
          </span>
        </DropdownItem>
      </LogmeDropdown>
    </nav>
  );
};

export default MobileNav;
