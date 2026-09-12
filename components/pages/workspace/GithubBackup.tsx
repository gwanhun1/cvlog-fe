import Head from 'next/head';
import Link from 'next/link';
import GithubConnectPrompt from 'components/Shared/GithubConnectPrompt';
import GithubSync from 'components/pages/github/GithubSync';
import WorkspaceNav from 'components/pages/workspace/WorkspaceNav';
import { useGetUserInfo } from 'service/hooks/Login';
import { hasCapability } from 'utils/user';

export default function GithubBackup() {
  const { data: user, isPending, isError, refetch } = useGetUserInfo();
  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-3 py-6 tablet:px-0">
      <Head>
        <title>GitHub 백업 · LOGME</title>
        <meta name="robots" content="noindex" />
      </Head>
      <header>
        <h1 className="text-2xl font-bold text-slate-900">GitHub 백업</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          공개 글을 저장소에 보관하고, 아직 반영되지 않은 글을 확인하세요.
        </p>
      </header>
      <WorkspaceNav active="github" />
      {isPending ? (
        <p role="status" className="py-6 text-slate-600">
          계정 확인 중…
        </p>
      ) : isError || !user?.id ? (
        <button
          type="button"
          onClick={() => refetch()}
          className="min-h-[44px] text-ftBlue underline"
        >
          계정 정보를 다시 불러오기
        </button>
      ) : hasCapability(user, 'githubStats') ? (
        <GithubSync />
      ) : (
        <GithubConnectPrompt
          compact
          withRepoScope
          description="GitHub을 연결하면 공개 글을 저장소에 백업할 수 있습니다."
        />
      )}
      <div className="border-t border-slate-200 pt-4">
        <Link
          href="/github"
          className="inline-flex min-h-[44px] items-center text-sm font-semibold text-ftBlue hover:underline"
        >
          GitHub 활동과 저장소 둘러보기 →
        </Link>
      </div>
    </main>
  );
}
