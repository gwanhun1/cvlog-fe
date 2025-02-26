import { CiSettings, CiBellOn } from 'react-icons/ci';
import { Dispatch, SetStateAction } from 'react';
import * as Shared from 'components/Shared';
import Link from 'next/link';
import NavPriofile from './Profile';

const DesktopNavActions = ({
  isAuthenticated,
  setAuthority,
}: {
  isAuthenticated: boolean;
  setAuthority: Dispatch<SetStateAction<boolean>>;
}) => {
  if (isAuthenticated) {
    return (
      <div className="items-center hidden gap-4 tablet:flex">
        <Link
          href="/mypage"
          className="transition-opacity hover:opacity-80"
          prefetch={true}
        >
          <CiSettings className="w-8 h-8" color="grey" />
        </Link>

        <button className="transition-opacity hover:opacity-80">
          <CiBellOn className="w-8 h-8" color="grey" />
        </button>

        <NavPriofile setAuthority={setAuthority} />
      </div>
    );
  }

  return (
    <div className="items-center hidden tablet:flex">
      <Link href="/" prefetch={true}>
        <Shared.LogmeButton
          variant="classic"
          size="small"
          onClick={() => setAuthority(true)}
        >
          <Shared.LogmeHeadline
            type="medium"
            fontStyle="semibold"
            style={{ color: '#fff' }}
          >
            Join
          </Shared.LogmeHeadline>
        </Shared.LogmeButton>
      </Link>
    </div>
  );
};

export default DesktopNavActions;
