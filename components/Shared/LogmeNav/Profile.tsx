import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { LogmeDropdown, DropdownHeader, DropdownItem } from 'components/Shared';
import { handleSignOut } from 'utils/auth';
import Loader from '../common/Loader';
import { userIdAtom } from 'service/atoms/atoms';
import { useRecoilValue } from 'recoil';

const NavProfile = ({ setAuthority }: Props) => {
  const userInfo = useRecoilValue(userIdAtom);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onClickLogout = async () => {
    await handleSignOut((value: string | null) => setAuthority(!!value));
  };

  if (!mounted) {
    return null;
  }

  if (!userInfo) {
    return <Loader />;
  }

  return (
    <nav>
      <LogmeDropdown
        trigger={
          <img
            src={userInfo.profile_image || '/images/github.png'}
            alt="User"
            className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-ftBlue/30 transition-all"
          />
        }
        align="right"
      >
        <DropdownHeader>
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {userInfo.github_id || '아이디가 없어요'}
            </span>
            <span className="text-xs text-gray-500">
              {userInfo.name
                ? `${userInfo.name}님 환영합니다`
                : '이름을 등록해주세요'}
            </span>
          </div>
        </DropdownHeader>
        <DropdownItem onClick={onClickLogout} danger>
          로그아웃
        </DropdownItem>
      </LogmeDropdown>
    </nav>
  );
};

export default NavProfile;

interface Props {
  setAuthority: Dispatch<SetStateAction<boolean>>;
}
