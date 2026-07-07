import { Dispatch, SetStateAction } from 'react';
import * as Shared from 'components/Shared';
import Link from 'next/link';
import NavPriofile from './Profile';
import Loader from '../common/Loader';

interface DesktopNavActionsProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthority: Dispatch<SetStateAction<boolean>>;
  shrink?: boolean;
}

const DesktopNavActions = ({
  isAuthenticated,
  isLoading,
  setAuthority,
  shrink = false,
}: DesktopNavActionsProps) => {
  if (isLoading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return (
      <div className="hidden items-center tablet:flex">
        <NavPriofile setAuthority={setAuthority} shrink={shrink} />
      </div>
    );
  }

  return (
    <div className="hidden items-center tablet:flex">
      <Link href="/login">
        <Shared.LogmeButton
          variant="classic"
          size={shrink ? 'small' : 'small'} // Already small, maybe custom size needed if it's too big
          className={shrink ? 'px-3 py-1' : ''}
          onClick={() => setAuthority(true)}
        >
          <Shared.LogmeHeadline
            type={shrink ? 'small' : 'medium'}
            fontStyle="semibold"
            className="text-white"
          >
            로그인
          </Shared.LogmeHeadline>
        </Shared.LogmeButton>
      </Link>
    </div>
  );
};

export default DesktopNavActions;
