import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Link from 'next/link';
import { HiOutlineCog6Tooth, HiArrowRightOnRectangle } from 'react-icons/hi2';
import { LogmeDropdown, DropdownHeader, DropdownItem } from 'components/Shared';
import { handleSignOut } from 'utils/auth';
import Loader from '../common/Loader';
import { useStore } from 'service/store/useStore';
import { cn } from 'styles/utils';

const NavProfile = ({ setAuthority, shrink = false }: Props) => {
  const userInfo = useStore((state) => state.userIdAtom);
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
            className={cn(
              'rounded-full object-cover cursor-pointer ring-2 ring-slate-200 hover:ring-ftBlue/40 transition-all duration-300',
              shrink ? 'w-6 h-6' : 'w-9 h-9'
            )}
          />
        }
        align="right"
      >
        <DropdownHeader>
          <div className="text-[13px] font-semibold text-gray-900">
            {userInfo.name || userInfo.github_id || '사용자'}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            @{userInfo.github_id || '아이디가 없어요'}
          </div>
        </DropdownHeader>
        <div className="py-1">
          <Link href="/mypage" prefetch={true}>
            <DropdownItem>
              <HiOutlineCog6Tooth className="w-4 h-4 flex-shrink-0" />
              설정
            </DropdownItem>
          </Link>
          <DropdownItem onClick={onClickLogout} danger>
            <HiArrowRightOnRectangle className="w-4 h-4 flex-shrink-0" />
            로그아웃
          </DropdownItem>
        </div>
      </LogmeDropdown>
    </nav>
  );
};

export default NavProfile;

interface Props {
  setAuthority: Dispatch<SetStateAction<boolean>>;
  shrink?: boolean;
}
