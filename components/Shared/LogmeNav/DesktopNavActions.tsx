import { CiSettings, CiBellOn } from 'react-icons/ci';
import { Dispatch, SetStateAction } from 'react';
import * as Shared from 'components/Shared';
import Link from 'next/link';
import NavPriofile from './Profile';
import { useRouter } from 'next/router';

const DesktopNavActions = ({
  isAuthenticated,
  setAuthority,
}: {
  isAuthenticated: boolean;
  setAuthority: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  if (isAuthenticated) {
    return (
      <div className="items-center hidden gap-4 tablet:flex">
        <button
          className="transition-all duration-300 ease-in-out opacity-100 hover:opacity-50 transform hover:scale-110 hover:bg-gray-100 rounded-full"
          onClick={() => router.push('/mypage')}
        >
          <CiSettings className="w-8 h-8" color="grey" />
        </button>

        <button
          className="transition-all duration-300 ease-in-out opacity-100 hover:opacity-50 transform hover:scale-110 hover:bg-gray-100 rounded-full"
          onClick={() => alert('v1.1에서 만나요 🥰')}
        >
          <CiBellOn className="w-8 h-8" color="grey" />
        </button>

        <NavPriofile setAuthority={setAuthority} />
      </div>
    );
  }

  return (
    <div className="items-center hidden tablet:flex">
      <Link href="/login" prefetch={true}>
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
            Login
          </Shared.LogmeHeadline>
        </Shared.LogmeButton>
      </Link>
    </div>
  );
};

export default DesktopNavActions;
