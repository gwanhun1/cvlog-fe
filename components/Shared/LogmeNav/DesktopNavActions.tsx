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
      <div className="items-center hidden gap-6 tablet:flex">
        <Link
          href="/mypage"
          className="transition-opacity hover:opacity-80"
          prefetch={true}
        >
          <Shared.LogmeIcon.SettingsIcon alt="설정" width={28} height={28} />
        </Link>

        <button className="transition-opacity hover:opacity-80">
          <Shared.LogmeIcon.NotificationIcon
            alt="알람"
            width={28}
            height={28}
          />
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
