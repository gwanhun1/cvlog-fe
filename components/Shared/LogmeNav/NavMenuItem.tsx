import * as Shared from 'components/Shared';
import Link from 'next/link';

const NavMenuItem = ({
  name,
  path,
  isActive,
  requiresAuth = false,
  isAuthenticated,
  onClick,
}: {
  name: string;
  path: string;
  isActive: boolean;
  requiresAuth?: boolean;
  isAuthenticated: boolean;
  onClick: () => void;
}) => {
  const handleClick = () => {
    if (requiresAuth && !isAuthenticated) {
      alert('로그인이 필요합니다.');
      return;
    }
    onClick();
  };

  return (
    <Link
      href={requiresAuth && !isAuthenticated ? '' : path}
      onClick={handleClick}
      prefetch={true}
    >
      <Shared.LogmeHeadline
        type="medium"
        fontStyle="semibold"
        className={`px-4 py-2 transition-all duration-200 hover:cursor-pointer ${
          isActive
            ? 'text-ftBlue bg-white rounded-3xl shadow-md'
            : 'text-ftGray hover:text-ftGray'
        }`}
      >
        {name}
      </Shared.LogmeHeadline>
    </Link>
  );
};

export default NavMenuItem;
