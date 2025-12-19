import { CiSettings, CiBellOn } from 'react-icons/ci';
import { Dispatch, SetStateAction } from 'react';
import * as Shared from 'components/Shared';
import { useToast } from 'components/Shared';
import Link from 'next/link';
import NavPriofile from './Profile';
import { useRouter } from 'next/router';
import Loader from '../common/Loader';

interface DesktopNavActionsProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthority: Dispatch<SetStateAction<boolean>>;
}

const DesktopNavActions = ({
  isAuthenticated,
  isLoading,
  setAuthority,
}: DesktopNavActionsProps) => {
  const router = useRouter();
  const { showToast } = useToast();

  if (isLoading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return (
      <div className="hidden gap-4 items-center tablet:flex">
        <button
          className="transition-all duration-200 ease-in-out hover:-translate-y-0.5 rounded-full p-2 bg-bgWhite hover:bg-ftBlue/10"
          onClick={() => router.push('/mypage')}
        >
          <CiSettings className="w-7 h-7" color="#2657A6" />
        </button>

        <button
          className="transition-all duration-200 ease-in-out hover:-translate-y-0.5 rounded-full p-2 bg-bgWhite hover:bg-ftBlue/10"
          onClick={() => showToast('v1.1에서 만나요 🥰', 'info')}
        >
          <CiBellOn className="w-7 h-7" color="#2657A6" />
        </button>

        <NavPriofile setAuthority={setAuthority} />
      </div>
    );
  }

  return (
    <div className="hidden items-center tablet:flex">
      <Link href="/login" prefetch={true}>
        <Shared.LogmeButton
          variant="classic"
          size="small"
          onClick={() => setAuthority(true)}
        >
          <Shared.LogmeHeadline
            type="medium"
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
