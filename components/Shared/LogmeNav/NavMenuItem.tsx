import React from 'react';
import * as Shared from 'components/Shared';
import { useToast } from 'components/Shared';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from 'styles/utils';
import { useStore } from 'service/store/useStore';
import { hasCapability } from 'utils/user';
import type { UserCapabilities } from 'service/api/login/type';

const NavMenuItem = ({
  name,
  path,
  requiresAuth = false,
  hideWhenGuest = false,
  requiresCapability,
  isAuthenticated,
  shrink = false,
}: {
  name: string;
  path: string;
  requiresAuth?: boolean;
  hideWhenGuest?: boolean;
  /** 해당 기능을 쓸 수 있는 유저에게만 노출 (예: GitHub 미연동 유저에게 GITHUB 탭 숨김) */
  requiresCapability?: keyof UserCapabilities;
  isAuthenticated: boolean;
  shrink?: boolean;
}) => {
  const router = useRouter();
  const { showToast } = useToast();
  const userInfo = useStore(state => state.userIdAtom);

  if (hideWhenGuest && !isAuthenticated) return null;
  if (requiresCapability && !hasCapability(userInfo, requiresCapability))
    return null;

  const isActive =
    path === '/' ? router.pathname === '/' : router.pathname.includes(path);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (requiresAuth && !isAuthenticated) {
      e.preventDefault();
      showToast('로그인이 필요합니다.', 'warning');
      return;
    }
  };

  return (
    <Link
      href={requiresAuth && !isAuthenticated ? '#' : path}
      onClick={handleClick}
    >
      <div className="group">
        <Shared.LogmeHeadline
          type={shrink ? 'small' : 'medium'}
          fontStyle="semibold"
          className={cn(
            'rounded-2xl transition-all duration-300 hover:cursor-pointer whitespace-nowrap',
            shrink ? 'px-2 py-0.5' : 'px-4 py-2',
            isActive
              ? 'text-ftBlue bg-white/90 shadow-md border border-ftBlue/20 group-hover:text-ftBlue'
              : 'text-ftGray hover:text-ftBlue/90 hover:bg-bgWhite border border-transparent'
          )}
        >
          {name}
        </Shared.LogmeHeadline>
      </div>
    </Link>
  );
};

export default NavMenuItem;
