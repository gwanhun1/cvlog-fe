import type { ReactNode } from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import ProfileHeader from 'components/pages/mypage/ProfileHeader';
import HomeSection from 'components/pages/mypage/HomeSection';
import ContactInfo from 'components/pages/mypage/ContactInfo';
import AccountManagement from 'components/pages/mypage/AccountManagement';
import { useGetUserInfo } from 'service/hooks/Login';
import AuthGuard from 'components/Shared/common/AuthGuard';
import { getDisplayName } from 'utils/user';

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-4 border-t border-slate-200 py-6 tablet:grid-cols-[180px_minmax(0,1fr)]">
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function AccountSettings() {
  const { data: userInfo, isPending, isError, refetch } = useGetUserInfo();
  const joined = userInfo?.created_at ? new Date(userInfo.created_at) : null;
  const joinDate =
    joined && !Number.isNaN(joined.getTime())
      ? joined.toLocaleDateString('ko-KR')
      : null;
  return (
    <main className="mx-auto w-full pb-0 tablet:pb-6">
      <Head>
        <title>계정 설정 · LOGME</title>
        <meta name="robots" content="noindex" />
      </Head>
      <header className="mb-6">
        <Link
          href="/workspace"
          className="inline-flex min-h-[44px] items-center text-sm font-semibold text-ftBlue hover:underline"
        >
          ← 내 작업실
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">계정 설정</h1>
        <p className="mt-2 text-sm text-slate-600">
          프로필과 계정 정보를 관리하세요.
        </p>
      </header>
      {isPending ? (
        <p role="status" className="py-6 text-slate-600">
          계정 정보를 불러오는 중…
        </p>
      ) : isError || !userInfo?.id ? (
        <button
          type="button"
          onClick={() => refetch()}
          className="min-h-[44px] text-ftBlue underline"
        >
          계정 정보를 다시 불러오기
        </button>
      ) : (
        <>
          <div className="py-4">
            <ProfileHeader
              profileImage={userInfo?.profile_image}
              displayName={getDisplayName(userInfo)}
              joinDate={joinDate}
              providers={userInfo?.providers}
            />
          </div>
          {userInfo?.username && (
            <Link
              href={`/u/${userInfo.username}`}
              className="mb-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-ftBlue hover:underline"
            >
              방문자에게 보이는 공개 프로필 확인 →
            </Link>
          )}
          <SettingsSection title="프로필 소개">
            <HomeSection description={userInfo?.description} />
          </SettingsSection>
          <SettingsSection title="연락처">
            <ContactInfo
              displayName={getDisplayName(userInfo)}
              githubId={userInfo?.github_id}
            />
          </SettingsSection>
          <SettingsSection title="GitHub 백업">
            <p className="text-sm leading-6 text-slate-600">
              공개 글 백업과 저장소 연결은 작업실에서 관리합니다.
            </p>
            <Link
              href="/workspace/github"
              className="mt-2 inline-flex min-h-[44px] items-center text-sm font-semibold text-ftBlue hover:underline"
            >
              GitHub 백업 관리 →
            </Link>
          </SettingsSection>
          <SettingsSection title="계정 관리">
            <AccountManagement />
          </SettingsSection>
        </>
      )}
    </main>
  );
}

function Mypage() {
  return (
    <AuthGuard>
      <AccountSettings />
    </AuthGuard>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const hasRefreshToken = context.req.headers.cookie?.includes('refreshToken');

  if (!hasRefreshToken) {
    return {
      redirect: {
        destination: '/login?redirect=/mypage',
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default Mypage;
