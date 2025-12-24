import { CiSettings, CiBellOn } from 'react-icons/ci';
import { Dispatch, SetStateAction } from 'react';
import * as Shared from 'components/Shared';
import { useToast } from 'components/Shared';
import Link from 'next/link';
import NavPriofile from './Profile';
import { useRouter } from 'next/router';
import Loader from '../common/Loader';
import { cn } from 'styles/utils';

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
  const router = useRouter();
  const { showToast } = useToast();

  if (isLoading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return (
      <div className="hidden gap-4 items-center tablet:flex">
        <button
          className={cn(
            'transition-all duration-300 ease-in-out hover:-translate-y-0.5 rounded-full bg-bgWhite hover:bg-ftBlue/10',
            shrink ? 'p-1.5' : 'p-2'
          )}
          onClick={() => router.push('/mypage')}
        >
          <CiSettings
            className={cn('transition-all duration-300', shrink ? 'w-5 h-5' : 'w-7 h-7')}
            color="#2657A6"
          />
        </button>

        <button
          className={cn(
            'transition-all duration-300 ease-in-out hover:-translate-y-0.5 rounded-full bg-bgWhite hover:bg-ftBlue/10',
            shrink ? 'p-1.5' : 'p-2'
          )}
          onClick={() => showToast('v1.1에서 만나요 🥰', 'info')}
        >
          <CiBellOn
            className={cn('transition-all duration-300', shrink ? 'w-5 h-5' : 'w-7 h-7')}
            color="#2657A6"
          />
        </button>

        <NavPriofile setAuthority={setAuthority} shrink={shrink} />
      </div>
    );
  }

  return (
    <div className="hidden items-center tablet:flex">
      <Link href="/login" prefetch={true}>
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
