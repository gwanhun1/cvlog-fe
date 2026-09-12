import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useGetUserInfo } from 'service/hooks/Login';
import { useGetList } from 'service/hooks/List';
import { getMyResumes } from 'service/api/resume';
import type { BlogType } from 'service/api/tag/type';
import { useLocalDrafts } from 'hooks/useLocalDrafts';
import { getDisplayName, hasCapability } from 'utils/user';
import WorkspaceNav from './WorkspaceNav';
import GithubBackupSummary from './GithubBackupSummary';

const actionClass =
  'inline-flex min-h-[44px] items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ftBlue';

export default function Workspace() {
  const {
    data: user,
    isError: userError,
    refetch: refetchUser,
  } = useGetUserInfo();
  const { drafts, error } = useLocalDrafts();
  const resumes = useQuery({
    queryKey: ['workspaceResumes'],
    queryFn: getMyResumes,
    enabled: !!user?.id,
  });
  const posts = useGetList(1, undefined, !!user?.id);
  const recentPosts: BlogType[] = posts.data?.posts.slice(0, 5) ?? [];

  return (
    <main className="mx-auto w-full max-w-6xl space-y-7 py-6">
      <Head>
        <title>내 작업실 · LOGME</title>
        <meta name="robots" content="noindex" />
      </Head>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">내 작업실</h1>
          <p className="mt-2 text-sm text-slate-600">
            {getDisplayName(user, '개발자')}님의 기록을 이어가세요.
          </p>
        </div>
        <Link
          href="/article/new"
          className={`${actionClass} bg-ftBlue text-white hover:bg-ftBlue/90`}
        >
          새 글 작성
        </Link>
      </header>
      <WorkspaceNav active="overview" />
      {userError && (
        <p role="alert" className="text-sm text-slate-600">
          계정 정보를 불러오지 못했습니다.{' '}
          <button
            type="button"
            onClick={() => refetchUser()}
            className="min-h-[44px] text-ftBlue underline"
          >
            다시 불러오기
          </button>
        </p>
      )}

      <section
        aria-labelledby="drafts-title"
        className="rounded-xl border border-slate-200 bg-white p-5"
      >
        <h2 id="drafts-title" className="text-lg font-bold text-slate-900">
          이어서 작성
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          이 브라우저에 보관된 초안입니다. 다른 기기와 자동 동기화되지 않습니다.
        </p>
        <ul className="mt-3 divide-y divide-slate-200">
          {drafts.map(draft => (
            <li key={draft.key}>
              <Link
                href={draft.href}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg py-4 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ftBlue"
              >
                <div className="min-w-0">
                  <h3 className="break-words text-sm font-semibold text-slate-900">
                    {draft.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {draft.updatedAt
                      ? new Date(draft.updatedAt).toLocaleString('ko-KR')
                      : '이 기기에 저장됨'}
                  </p>
                </div>
                <span className="text-sm font-semibold text-ftBlue">
                  이어서 작성 →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {!drafts.length && (
          <div className="py-4 text-sm text-slate-600">
            <p>
              {error
                ? '브라우저 저장소에 접근할 수 없습니다.'
                : '작성 중인 초안이 없습니다.'}
            </p>
            <Link
              href="/article/new"
              className="mt-2 inline-flex min-h-[44px] items-center font-semibold text-ftBlue hover:underline"
            >
              새 기록 시작하기 →
            </Link>
          </div>
        )}
      </section>

      <div className="grid gap-8 tablet:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <section aria-labelledby="recent-posts-title">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <h2
              id="recent-posts-title"
              className="text-lg font-bold text-slate-900"
            >
              최근 글
            </h2>
            <Link
              href="/article?view=my"
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-ftBlue hover:underline"
            >
              내 글 전체 →
            </Link>
          </div>
          {posts.isError ? (
            <button
              type="button"
              onClick={() => posts.refetch()}
              className="min-h-[44px] py-4 text-sm text-ftBlue underline"
            >
              글 목록 다시 불러오기
            </button>
          ) : posts.isPending ? (
            <p role="status" className="py-5 text-sm text-slate-600">
              글을 불러오는 중…
            </p>
          ) : !recentPosts.length ? (
            <p className="py-5 text-sm text-slate-600">
              아직 작성한 글이 없습니다. 첫 기록을 남겨보세요.
            </p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {recentPosts.map(post => (
                <li
                  key={post.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/article/content/${post.id}`}
                      className="break-words text-sm font-semibold text-slate-900 hover:text-ftBlue hover:underline"
                    >
                      {post.title || '제목 없는 글'}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">
                      {post.public_status ? '공개' : '비공개'} ·{' '}
                      {new Date(post.updated_at).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <Link
                    href={`/article/modify/${post.id}`}
                    aria-label={`${post.title || '제목 없는 글'} 수정`}
                    className="inline-flex min-h-[44px] shrink-0 items-center px-2 text-sm font-semibold text-ftBlue hover:underline"
                  >
                    수정
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <div className="space-y-7">
          <section aria-labelledby="resumes-title">
            <h2
              id="resumes-title"
              className="border-b border-slate-200 pb-4 text-lg font-bold text-slate-900"
            >
              저장한 이력서
            </h2>
            {resumes.isError ? (
              <button
                type="button"
                className="min-h-[44px] py-4 text-sm text-ftBlue underline"
                onClick={() => resumes.refetch()}
              >
                이력서 목록 다시 불러오기
              </button>
            ) : resumes.isPending ? (
              <p role="status" className="py-5 text-sm text-slate-600">
                이력서를 불러오는 중…
              </p>
            ) : resumes.data?.length ? (
              <ul className="divide-y divide-slate-200">
                {resumes.data.slice(0, 3).map(resume => (
                  <li key={resume.id} className="py-3">
                    <p className="break-words text-sm font-semibold text-slate-900">
                      {resume.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(resume.updated_at).toLocaleDateString('ko-KR')}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-4 text-sm text-slate-600">
                계정에 저장한 이력서가 없습니다.
              </p>
            )}
            <Link
              href="/resume"
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-ftBlue hover:underline"
            >
              이력서 작성·불러오기 →
            </Link>
          </section>
          <section
            aria-labelledby="backup-title"
            className="border-t border-slate-200 pt-5"
          >
            <h2
              id="backup-title"
              className="mb-3 text-lg font-bold text-slate-900"
            >
              GitHub 백업
            </h2>
            {user ? (
              hasCapability(user, 'githubStats') ? (
                <GithubBackupSummary />
              ) : (
                <div>
                  <p className="text-sm leading-6 text-slate-600">
                    GitHub을 연결하면 공개 글을 저장소에 보관할 수 있습니다.
                  </p>
                  <Link
                    href="/workspace/github"
                    className="mt-2 inline-flex min-h-[44px] items-center text-sm font-semibold text-ftBlue hover:underline"
                  >
                    GitHub 연결 시작하기 →
                  </Link>
                </div>
              )
            ) : (
              <p role="status" className="text-sm text-slate-600">
                {userError ? '계정 정보를 확인해주세요.' : '계정 확인 중…'}
              </p>
            )}
          </section>
        </div>
      </div>
      <footer className="flex flex-wrap gap-x-6 border-t border-slate-200 pt-3 text-sm text-slate-600">
        {user?.username && (
          <Link
            href={`/u/${user.username}`}
            className="inline-flex min-h-[44px] items-center hover:text-ftBlue"
          >
            내 공개 프로필 보기 →
          </Link>
        )}
        <Link
          href="/mypage"
          className="inline-flex min-h-[44px] items-center hover:text-ftBlue"
        >
          계정 설정 →
        </Link>
      </footer>
    </main>
  );
}
