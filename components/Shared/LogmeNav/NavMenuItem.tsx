import * as Shared from 'components/Shared';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NavMenuItem = ({
  name,
  path,
  requiresAuth = false,
  isAuthenticated,
}: {
  name: string;
  path: string;
  requiresAuth?: boolean;
  isAuthenticated: boolean;
}) => {
  const router = useRouter();

  const isActive = router.pathname === path;

  const handleClick = () => {
    if (requiresAuth && !isAuthenticated) {
      alert('로그인이 필요합니다.');
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
          type="medium"
          fontStyle="semibold"
          className={`px-4 py-2 transition-all duration-200 hover:cursor-pointer 
            ${
              isActive
                ? 'text-ftBlue bg-white rounded-3xl shadow-md group-hover:text-blue-700'
                : 'text-ftGray hover:text-blue-700'
            }`}
        >
          {name}
        </Shared.LogmeHeadline>
      </div>
    </Link>
  );
};

export default NavMenuItem;
