import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import {
  FiArrowUpRight,
  FiGitCommit,
  FiGithub,
  FiSearch,
  FiStar,
} from 'react-icons/fi';
import ContributionCalendar from './ContributionCalendar';
import GithubSyncPanel from './GithubSyncPanel';
import RepositoryExplorer from './RepositoryExplorer';
import RelatedPostsCard from './RelatedPostsCard';
import GithubConnectPrompt from 'components/Shared/GithubConnectPrompt';
import type { UserInfoType } from 'service/api/login/type';

interface Props {
  userInfo: UserInfoType | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}
interface GithubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  followers: number;
  public_repos: number;
  created_at: string;
}
interface GithubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  size: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
}
interface GithubEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: {
    action?: string;
    ref_type?: string;
    commits?: { message: string }[];
    pull_request?: { title: string; html_url?: string };
    issue?: { title: string; html_url?: string };
  };
}
interface GithubData {
  profile: GithubUser;
  repos: GithubRepo[];
  events: GithubEvent[];
  reposUnavailable: boolean;
  eventsUnavailable: boolean;
}
const USERNAME_PATTERN = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};
const card = 'rounded-2xl border border-slate-200 bg-white shadow-sm';
const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#a16207',
  Python: '#2563eb',
  Java: '#b07219',
  Go: '#0891b2',
  Rust: '#c2410c',
  Kotlin: '#7c3aed',
  Swift: '#c2410c',
  Ruby: '#b91c1c',
  'C++': '#db2777',
  C: '#475569',
  Vue: '#047857',
};

async function fetchGithub(
  username: string,
  signal: AbortSignal,
): Promise<GithubData> {
  const id = encodeURIComponent(username);
  const [profileResult, repoResult, eventResult] = await Promise.allSettled([
    fetch(`https://api.github.com/users/${id}`, { headers, signal }),
    fetch(
      `https://api.github.com/users/${id}/repos?per_page=100&type=owner&sort=pushed`,
      { headers, signal },
    ),
    fetch(`https://api.github.com/users/${id}/events/public?per_page=100`, {
      headers,
      signal,
    }),
  ]);
  if (profileResult.status === 'rejected') throw new Error('failed');
  const profile = profileResult.value;
  if (profile.status === 404) throw new Error('not_found');
  if (profile.status === 403 || profile.status === 429)
    throw new Error('rate_limit');
  if (!profile.ok) throw new Error('failed');
  const repos =
    repoResult.status === 'fulfilled' && repoResult.value.ok
      ? repoResult.value
      : null;
  const events =
    eventResult.status === 'fulfilled' && eventResult.value.ok
      ? eventResult.value
      : null;
  const [profileData, repoData, eventData] = await Promise.all([
    profile.json(),
    repos?.json() ?? [],
    events?.json() ?? [],
  ]);
  return {
    profile: profileData,
    repos: repoData,
    events: eventData,
    reposUnavailable: !repos,
    eventsUnavailable: !events,
  };
}

function Languages({ repos }: { repos: GithubRepo[] }) {
  const items = useMemo(() => {
    const counts = new Map<string, number>();
    repos
      .filter(repo => !repo.fork && !repo.archived && repo.language)
      .forEach(repo =>
        counts.set(repo.language!, (counts.get(repo.language!) || 0) + 1),
      );
    return [...counts].sort((a, b) => b[1] - a[1]);
  }, [repos]);
  const total = items.reduce((sum, [, count]) => sum + count, 0);
  return (
    <section className={`${card} p-5`}>
      <h3 className="text-base font-bold text-slate-950">
        프로젝트의 주력 언어
      </h3>
      <p className="mb-5 mt-1 text-xs leading-5 text-slate-600">
        조회한 원본 저장소의 대표 언어별 개수입니다.
      </p>
      <div className="space-y-4">
        {items.slice(0, 6).map(([name, count]) => (
          <div key={name}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-800">{name}</span>
              <span className="text-xs text-slate-600">
                {count}개 · {Math.round((count / total) * 100)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(count / total) * 100}%`,
                  backgroundColor: languageColors[name] || '#475569',
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {!items.length ? (
        <p className="py-8 text-center text-sm text-slate-600">
          표시할 언어가 없습니다.
        </p>
      ) : null}
    </section>
  );
}

const eventLabels: Record<string, string> = {
  PushEvent: '커밋 푸시',
  PullRequestEvent: '풀 리퀘스트',
  IssuesEvent: '이슈',
  CreateEvent: '생성',
  WatchEvent: 'Star',
  ForkEvent: 'Fork',
  ReleaseEvent: '릴리스',
};
function Activity({
  events,
  unavailable,
}: {
  events: GithubEvent[];
  unavailable: boolean;
}) {
  const [filter, setFilter] = useState('all');
  const visible = events
    .filter(
      event =>
        eventLabels[event.type] && (filter === 'all' || event.type === filter),
    )
    .slice(0, 10);
  return (
    <section className={`${card} overflow-hidden`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
        <div>
          <h3 className="text-base font-bold text-slate-950">최근 공개 활동</h3>
          <p className="mt-1 text-xs text-slate-600">
            GitHub에서 제공하는 최근 공개 이벤트입니다.
          </p>
        </div>
        <select
          value={filter}
          onChange={event => setFilter(event.target.value)}
          aria-label="공개 활동 유형"
          className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs"
        >
          <option value="all">모든 활동</option>
          <option value="PushEvent">커밋</option>
          <option value="PullRequestEvent">풀 리퀘스트</option>
          <option value="IssuesEvent">이슈</option>
        </select>
      </div>
      {unavailable ? (
        <p role="status" className="p-6 text-sm text-amber-800">
          최근 활동을 불러오지 못했습니다. 다른 정보는 계속 확인할 수 있습니다.
        </p>
      ) : visible.length ? (
        <ul className="divide-y divide-slate-100">
          {visible.map(event => (
            <li key={event.id} className="flex gap-3 p-5">
              <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                <FiGitCommit />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-600">
                    {eventLabels[event.type]}
                  </span>
                  <time
                    dateTime={event.created_at}
                    className="text-xs text-slate-500"
                  >
                    {new Date(event.created_at).toLocaleDateString('ko-KR')}
                  </time>
                </div>
                <a
                  href={`https://github.com/${event.repo.name.split('/').map(encodeURIComponent).join('/')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block truncate text-sm font-bold text-blue-800 hover:underline"
                >
                  {event.repo.name}
                </a>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">
                  {event.payload.pull_request?.title ||
                    event.payload.issue?.title ||
                    event.payload.commits?.[0]?.message ||
                    '저장소에서 자세한 활동을 확인하세요.'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-8 text-center text-sm text-slate-600">
          선택한 유형의 최근 공개 활동이 없습니다.
        </p>
      )}
    </section>
  );
}

export default function GithubStudio({
  userInfo,
  isAuthenticated,
  isAuthLoading,
}: Props) {
  const router = useRouter();
  const connected = isAuthenticated ? userInfo?.github_id || '' : '';
  const routeUser =
    typeof router.query.user === 'string' &&
    USERNAME_PATTERN.test(router.query.user)
      ? router.query.user
      : '';
  const [requested, setRequested] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [searchError, setSearchError] = useState('');
  const username = requested ?? (routeUser || connected);
  const ownProfile = Boolean(
    connected && username.toLowerCase() === connected.toLowerCase(),
  );
  const query = useQuery({
    queryKey: ['github-studio', username],
    queryFn: ({ signal }) => fetchGithub(username, signal),
    enabled: Boolean(username),
    staleTime: 300000,
    retry: false,
  });
  const search = (value = draft) => {
    const normalized = value.trim().replace(/^@/, '');
    if (!USERNAME_PATTERN.test(normalized)) {
      setSearchError('올바른 GitHub 아이디를 입력해주세요.');
      return;
    }
    setSearchError('');
    setDraft(normalized);
    setRequested(normalized);
    router.replace(
      { pathname: '/github', query: { user: normalized } },
      undefined,
      { shallow: true },
    );
  };
  const topLanguages = useMemo(
    () =>
      [
        ...new Set(
          query.data?.repos
            .map(repo => repo.language)
            .filter((value): value is string => Boolean(value)),
        ),
      ].slice(0, 5),
    [query.data],
  );
  const stars =
    query.data?.repos
      .filter(repo => !repo.fork)
      .reduce((sum, repo) => sum + repo.stargazers_count, 0) ?? 0;
  if (isAuthLoading)
    return (
      <main
        className="h-96 animate-pulse rounded-2xl bg-slate-100"
        aria-label="계정 확인 중"
      />
    );
  return (
    <main className="space-y-5 pb-16">
      <section className="rounded-2xl bg-slate-950 px-5 py-7 text-white shadow-sm mobile:px-7 tablet:px-8">
        <div className="flex flex-col gap-6 tablet:flex-row tablet:items-center tablet:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest text-blue-300">
              <FiGithub className="h-4 w-4" />
              GITHUB WORKSPACE
            </div>
            <h1 className="mb-0 text-2xl font-extrabold tracking-tight text-white mobile:text-3xl">
              코드와 기록이 이어지는 곳
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              기여를 돌아보고, 글을 백업하고, 다음 프로젝트를 찾아보세요.
            </p>
          </div>
          <div className="w-full tablet:max-w-sm">
            <form
              onSubmit={event => {
                event.preventDefault();
                search();
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-600 bg-white p-1.5 text-slate-900"
            >
              <FiSearch className="ml-2 shrink-0 text-slate-500" />
              <label htmlFor="github-username" className="sr-only">
                GitHub 아이디
              </label>
              <input
                id="github-username"
                value={draft}
                onChange={event => setDraft(event.target.value)}
                placeholder={username || 'GitHub 아이디 검색'}
                autoComplete="off"
                className="min-w-0 flex-1 px-1 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
              >
                탐색
              </button>
            </form>
            {searchError ? (
              <p role="alert" className="mt-2 text-xs text-rose-300">
                {searchError}
              </p>
            ) : (
              <p className="mt-2 text-xs text-slate-300">
                공개 프로필은 로그인 없이도 탐색할 수 있어요.
              </p>
            )}
            {connected && !ownProfile ? (
              <button
                onClick={() => search(connected)}
                className="mt-2 text-xs font-semibold text-blue-200 underline"
              >
                내 GitHub로 돌아가기
              </button>
            ) : null}
          </div>
        </div>
      </section>
      {isAuthenticated && !connected ? (
        <section className={card}>
          <GithubConnectPrompt
            compact
            withRepoScope
            title="내 GitHub 연결"
            description="계정을 연결하면 내 기여 기록과 블로그 동기화를 함께 관리할 수 있습니다."
          />
        </section>
      ) : null}
      {!username ? (
        <section className={`${card} p-8`}>
          <h2 className="text-xl font-bold text-slate-950">
            어떤 개발자의 기록이 궁금한가요?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            위 검색창에 아이디를 입력해 시작하세요.
          </p>
          <div className="mt-6 grid gap-4 tablet:grid-cols-3">
            {[
              [
                '01',
                '기여 기록',
                '연도별 캘린더와 연속 활동, 날짜별 기여를 확인합니다.',
              ],
              [
                '02',
                '프로젝트 탐색',
                '언어·이름·Star로 관심 있는 저장소를 찾습니다.',
              ],
              [
                '03',
                '글 자동 백업',
                '내 계정을 연결해 동기화 상태와 누락 글을 관리합니다.',
              ],
            ].map(([num, title, text]) => (
              <div key={num} className="rounded-xl bg-slate-50 p-5">
                <span className="text-xs font-bold text-blue-700">{num}</span>
                <h3 className="mt-2 font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {query.isLoading ? (
        <div
          className="h-96 animate-pulse rounded-2xl bg-slate-100"
          role="status"
          aria-label="GitHub 정보 불러오는 중"
        />
      ) : query.error ? (
        <section role="alert" className={`${card} p-8 text-center`}>
          <h2 className="text-lg font-bold text-slate-900">
            {query.error.message === 'not_found'
              ? '해당 GitHub 사용자를 찾지 못했습니다.'
              : 'GitHub 정보를 불러오지 못했습니다.'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {query.error.message === 'rate_limit'
              ? 'GitHub 공개 API 호출 한도에 도달했습니다. 잠시 후 다시 시도해주세요.'
              : '아이디와 연결 상태를 확인해주세요.'}
          </p>
          <button
            onClick={() => query.refetch()}
            className="mt-4 rounded-lg bg-blue-700 px-4 py-2 text-sm text-white"
          >
            다시 시도
          </button>
        </section>
      ) : query.data ? (
        <>
          <section
            className={`${card} flex flex-col gap-5 p-5 mobile:p-6 tablet:flex-row tablet:items-center tablet:justify-between`}
          >
            <div className="flex min-w-0 items-center gap-4">
              <Image
                src={query.data.profile.avatar_url}
                alt={`${username} 프로필`}
                width={64}
                height={64}
                className="h-16 w-16 rounded-2xl border border-slate-200"
              />
              <div className="min-w-0">
                <div className="mb-1 text-xs font-semibold text-blue-700">
                  {ownProfile ? '내 작업 공간' : '공개 프로필 탐색'}
                </div>
                <a
                  href={query.data.profile.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xl font-bold text-slate-950 hover:text-blue-700"
                >
                  {query.data.profile.name || username}
                  <FiArrowUpRight className="h-4 w-4" />
                </a>
                <p className="text-sm text-slate-600">
                  @{query.data.profile.login}
                </p>
                {query.data.profile.bio ? (
                  <p className="mt-1 max-w-xl text-sm text-slate-600">
                    {query.data.profile.bio}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex gap-6 border-t border-slate-200 pt-4 tablet:border-l tablet:border-t-0 tablet:pl-6 tablet:pt-0">
              {[
                [query.data.profile.public_repos, '공개 저장소'],
                [
                  query.data.reposUnavailable ? '—' : stars.toLocaleString(),
                  '조회 저장소 Star',
                ],
                [query.data.profile.followers.toLocaleString(), '팔로워'],
              ].map(([value, label]) => (
                <div key={label}>
                  <strong className="text-xl font-extrabold text-slate-950">
                    {value}
                  </strong>
                  <p className="mt-1 text-xs text-slate-600">{label}</p>
                </div>
              ))}
            </div>
          </section>
          {ownProfile ? <GithubSyncPanel /> : null}
          <ContributionCalendar
            key={username}
            username={username}
            joinedAt={query.data.profile.created_at}
          />
          <div className="grid items-start gap-5 desktop:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-5">
              {query.data.reposUnavailable ? (
                <section
                  role="status"
                  className={`${card} p-6 text-sm text-amber-800`}
                >
                  저장소를 불러오지 못했습니다.{' '}
                  <button className="underline" onClick={() => query.refetch()}>
                    다시 시도
                  </button>
                </section>
              ) : (
                <RepositoryExplorer
                  key={`repos-${username}`}
                  repos={query.data.repos}
                  total={query.data.profile.public_repos}
                />
              )}
              <Activity
                key={`activity-${username}`}
                events={query.data.events}
                unavailable={query.data.eventsUnavailable}
              />
            </div>
            <aside className="space-y-5">
              <Languages repos={query.data.repos} />
              {ownProfile && userInfo ? (
                <RelatedPostsCard
                  userId={userInfo.id}
                  topLanguages={topLanguages}
                />
              ) : (
                <section className={`${card} p-5`}>
                  <FiStar className="mb-3 text-blue-700" />
                  <h3 className="font-bold text-slate-950">
                    활동을 나의 기록으로
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    LOGME에 쓴 공개 글을 GitHub에 백업하고, 기록이 빠짐없이
                    쌓이는지 확인하세요.
                  </p>
                  <Link
                    href={isAuthenticated ? '/mypage' : '/login'}
                    className="mt-4 inline-flex text-sm font-semibold text-blue-700 underline"
                  >
                    {isAuthenticated ? '내 연동 관리' : '로그인하고 연결하기'}
                  </Link>
                </section>
              )}
            </aside>
          </div>
        </>
      ) : null}
    </main>
  );
}
