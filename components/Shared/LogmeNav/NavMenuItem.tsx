import * as Shared from 'components/Shared';
import { useToast } from 'components/Shared';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from 'styles/utils';

const NavMenuItem = ({
  name,
  path,
  requiresAuth = false,
  isAuthenticated,
  shrink = false,
}: {
  name: string;
  path: string;
  requiresAuth?: boolean;
  isAuthenticated: boolean;
  shrink?: boolean;
}) => {
  const router = useRouter();
  const { showToast } = useToast();

  const isActive =
    path === '/' ? router.pathname === '/' : router.pathname.includes(path);

  const handleClick = () => {
    if (requiresAuth && !isAuthenticated) {
      showToast('로그인이 필요합니다.', 'warning');
      return;
    }
  };

  return (
    <Link
      href={requiresAuth && !isAuthenticated ? '' : path}
      onClick={handleClick}
      prefetch={true}
    >
      <div className="group">
        <Shared.LogmeHeadline
          type={shrink ? 'small' : 'medium'}
          fontStyle="semibold"
          className={cn(
            'rounded-2xl transition-all duration-300 hover:cursor-pointer whitespace-nowrap',
            shrink ? 'px-3 py-1.5' : 'px-4 py-2',
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
