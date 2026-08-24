import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import {
  FiArrowUpRight, FiBookOpen, FiChevronRight, FiClock, FiCode,
  FiGitCommit, FiGitPullRequest, FiGithub, FiSearch, FiStar, FiZap,
} from 'react-icons/fi';
import RelatedPostsCard from './RelatedPostsCard';
import GithubConnectPrompt from 'components/Shared/GithubConnectPrompt';
import type { UserInfoType } from 'service/api/login/type';

const GithubEChart = dynamic(() => import('./GithubEChart'), {
  ssr: false,
  loading: () => <div className="h-52 animate-pulse rounded-2xl bg-slate-100" />,
});

interface Props { userInfo: UserInfoType | null; isAuthenticated: boolean; isAuthLoading: boolean }
interface GithubUser {
  login: string; name: string | null; bio: string | null; avatar_url: string;
  html_url: string; followers: number; public_repos: number; created_at: string;
}
interface GithubRepo {
  id: number; name: string; html_url: string; description: string | null;
  language: string | null; stargazers_count: number; forks_count: number;
  size: number; fork: boolean; archived: boolean; pushed_at: string;
}
interface GithubEvent {
  id: string; type: string; repo: { name: string }; created_at: string;
  payload: {
    size?: number; commits?: { message: string }[];
    pull_request?: { title: string }; issue?: { title: string };
  };
}
interface GithubData { profile: GithubUser; repos: GithubRepo[]; events: GithubEvent[] }
interface ContributionData {
  total: number;
  days: { date: string; count: number; level: number }[];
}

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};
const card = 'overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm';
const languageColors: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572a5',
  Java: '#b07219', Go: '#00add8', Rust: '#dea584', Kotlin: '#a97bff',
  Swift: '#f05138', Ruby: '#701516', 'C++': '#f34b7d', C: '#555555', Vue: '#41b883',
};
const eventConfig: Record<string, { label: string; color: string }> = {
  PushEvent: { label: '커밋 푸시', color: 'bg-emerald-400' },
  PullRequestEvent: { label: '풀 리퀘스트', color: 'bg-violet-400' },
  IssuesEvent: { label: '이슈', color: 'bg-amber-400' },
  CreateEvent: { label: '브랜치 생성', color: 'bg-sky-400' },
  WatchEvent: { label: '저장소 Star', color: 'bg-yellow-300' },
  ForkEvent: { label: '저장소 Fork', color: 'bg-slate-400' },
};

const fetchGithub = async (username: string): Promise<GithubData> => {
  const id = encodeURIComponent(username);
  const [profile, repos, events] = await Promise.all([
    fetch(`https://api.github.com/users/${id}`, { headers }),
    fetch(`https://api.github.com/users/${id}/repos?per_page=100&type=owner&sort=pushed`, { headers }),
    fetch(`https://api.github.com/users/${id}/events/public?per_page=100`, { headers }),
  ]);
  if (profile.status === 404) throw new Error('not_found');
  if ([profile, repos, events].some(response => response.status === 403)) throw new Error('rate_limit');
  if (!profile.ok || !repos.ok || !events.ok) throw new Error('failed');
  const [profileData, reposData, eventsData] = await Promise.all([
    profile.json(), repos.json(), events.json(),
  ]);
  return { profile: profileData, repos: reposData, events: eventsData };
};

const fetchContributions = async (username: string): Promise<ContributionData> => {
  const response = await fetch(`/api/github/contributions?username=${encodeURIComponent(username)}`);
  if (!response.ok) throw new Error('contributions_failed');
  return response.json();
};

const compact = (value: number) => new Intl.NumberFormat('ko-KR', { notation: 'compact' }).format(value);
const ago = (date: string) => {
  const days = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000));
  if (!days) return '오늘';
  if (days < 30) return `${days}일 전`;
  if (days < 365) return `${Math.floor(days / 30)}개월 전`;
  return `${Math.floor(days / 365)}년 전`;
};

const SearchBox = ({ value, onChange, onSubmit, dark = false }: {
  value: string; onChange: (value: string) => void; onSubmit: () => void; dark?: boolean;
}) => (
  <form
    className={`flex items-center gap-2 rounded-xl border p-1.5 ${dark ? 'border-ftBlue/20 bg-white' : 'border-slate-200 bg-white'}`}
    onSubmit={event => { event.preventDefault(); onSubmit(); }}
  >
    <FiSearch className="ml-3 h-4 w-4 text-slate-400" />
    <label htmlFor="github-username" className="sr-only">GitHub 아이디</label>
    <input
      id="github-username" value={value} onChange={event => onChange(event.target.value)}
      placeholder="GitHub ID를 입력하세요" autoComplete="off"
      className="min-w-0 flex-1 px-1 py-2 text-sm text-ftBlack placeholder:text-slate-400"
    />
    <button type="submit" className="rounded-lg bg-ftBlue px-4 py-2 text-sm font-semibold text-white transition hover:bg-ftBlue/90 focus-visible:ring-2 focus-visible:ring-ftBlue/30">탐색</button>
  </form>
);

const GuestHero = ({ draft, setDraft, search }: {
  draft: string; setDraft: (value: string) => void; search: (name?: string) => void;
}) => (
  <section className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white px-5 py-7 shadow-sm mobile:px-7 tablet:px-9 tablet:py-9">
    <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-ftBlue/5" />
    <div className="relative grid gap-10 tablet:grid-cols-[1.2fr_0.8fr] tablet:items-center">
      <div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-ftBlue/8 px-3 py-1 text-xs font-semibold text-ftBlue"><FiGithub /> GitHub 둘러보기</div>
        <h1 className="mb-3 max-w-2xl text-2xl font-extrabold leading-tight tracking-tight text-ftBlack mobile:text-3xl">
          개발자의 잔디와 프로젝트를
          <span className="block text-ftBlue">한눈에 둘러보세요</span>
        </h1>
        <p className="mb-6 max-w-xl text-sm leading-6 text-ftGray">GitHub 아이디만 입력하면 실제 1년 기여 기록과 저장소, 기술 언어, 최근 공개 활동을 확인할 수 있어요.</p>
        <div className="max-w-xl">
          <SearchBox value={draft} onChange={setDraft} onSubmit={() => search()} />
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ftGray">
            <span className="font-semibold text-ftBlue">이렇게 사용해요</span>
            <span>아이디 입력</span><FiChevronRight className="h-3 w-3" />
            <span>1년 잔디 확인</span><FiChevronRight className="h-3 w-3" />
            <span>대표 저장소 탐색</span>
          </div>
        </div>
      </div>
      <div className="hidden tablet:block">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-semibold text-ftBlack"><span className="h-2.5 w-2.5 rounded-full bg-ftBlue" />기여 활동 미리보기</div><FiGithub className="text-ftGray" /></div>
          <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1">{Array.from({ length: 91 }).map((_, index) => {
            const level = (index * 7 + Math.floor(index / 4)) % 6;
            return <span key={index} className={`aspect-square rounded-[3px] ${level < 2 ? 'bg-slate-200' : level < 3 ? 'bg-blue-200' : level < 5 ? 'bg-ftBlue' : 'bg-blue-800'}`} />;
          })}</div>
          <div className="mt-5 grid grid-cols-3 gap-2">{['1. 아이디 입력', '2. 잔디 확인', '3. 저장소 탐색'].map(label => <div key={label} className="rounded-xl bg-white px-3 py-3 text-center text-[11px] font-medium text-ftGray">{label}</div>)}</div>
        </div>
      </div>
    </div>
  </section>
);

const Profile = ({ data }: { data: GithubData }) => {
  const active = data.repos.filter(repo => !repo.fork && !repo.archived);
  const stars = active.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const years = Math.max(1, new Date().getFullYear() - new Date(data.profile.created_at).getFullYear());
  return (
    <section className={`${card} p-5 mobile:p-6`}>
      <div className="flex flex-col gap-6 tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Image src={data.profile.avatar_url} alt={`${data.profile.login} 프로필`} width={80} height={80} priority className="h-16 w-16 rounded-2xl border border-slate-200 object-cover shadow-md mobile:h-20 mobile:w-20" />
          <div className="min-w-0"><div className="mb-1 flex items-center gap-2"><span className="rounded-full bg-ftBlue/8 px-2.5 py-1 text-[10px] font-semibold text-ftBlue">공개 프로필</span><span className="text-xs text-ftGray">GitHub 활동 {years}년</span></div>
            <h2 className="mb-0 truncate text-2xl font-extrabold tracking-tight text-ftBlack">{data.profile.name || data.profile.login}</h2><p className="text-sm font-medium text-ftBlue">@{data.profile.login}</p>
            {data.profile.bio ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{data.profile.bio}</p> : null}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 tablet:min-w-[310px]">{[
          ['저장소', data.profile.public_repos], ['받은 Star', stars], ['팔로워', data.profile.followers],
        ].map(([label, value]) => <div key={String(label)} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-center"><div className="text-xl font-bold text-ftBlack">{compact(Number(value))}</div><div className="mt-1 text-[10px] font-medium text-ftGray">{label}</div></div>)}</div>
      </div>
    </section>
  );
};

const EmptyProfile = () => (
  <section className={`${card} p-5 mobile:p-6`}>
    <div className="flex flex-col gap-6 tablet:flex-row tablet:items-center tablet:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <Image src="/assets/default-profile.svg" alt="기본 프로필" width={80} height={80} className="h-16 w-16 rounded-2xl border border-slate-100 object-cover mobile:h-20 mobile:w-20" />
        <div className="min-w-0">
          <span className="rounded-full bg-ftBlue/8 px-2.5 py-1 text-[10px] font-semibold text-ftBlue">GitHub 프로필</span>
          <h2 className="mb-0 mt-2 text-2xl font-extrabold tracking-tight text-ftBlack">GitHub 개발자</h2>
          <p className="text-sm font-medium text-ftGray">@github-id</p>
          <p className="mt-2 text-sm text-ftGray">아이디를 검색하면 공개 프로필과 활동이 여기에 표시됩니다.</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 tablet:min-w-[310px]">
        {['저장소', '받은 Star', '팔로워'].map(label => <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-center"><div className="text-xl font-bold text-slate-300">—</div><div className="mt-1 text-[10px] font-medium text-ftGray">{label}</div></div>)}
      </div>
    </div>
  </section>
);

const Heatmap = ({ contributions }: { contributions: ContributionData }) => {
  const summary = useMemo(() => {
    const cells = contributions.days.map(day => ({ ...day, dateValue: new Date(`${day.date}T00:00:00`) }));
    let streak = 0;
    for (let index = cells.length - 1; index >= 0; index -= 1) {
      if (!cells[index].count) { if (index === cells.length - 1) continue; break; }
      streak += 1;
    }
    return { cells, streak, total: contributions.total, active: cells.filter(item => item.count).length };
  }, [contributions]);
  return (
    <section className={`${card} p-5 mobile:p-6`}>
      <div className="mb-5 flex flex-col gap-3 mobile:flex-row mobile:items-end mobile:justify-between"><div><div className="mb-2 inline-flex items-center gap-2 rounded-full bg-ftBlue/8 px-3 py-1 text-xs font-semibold text-ftBlue"><FiZap /> 기여 캘린더</div><h3 className="text-xl font-extrabold text-ftBlack">1년의 개발 리듬</h3><p className="mt-1 text-sm text-ftGray">GitHub에 기록된 실제 일별 기여를 표시해요.</p></div>
        <div className="flex gap-5 text-right">{[[summary.total,'활동'],[summary.active,'활성일'],[summary.streak,'연속일']].map(([value,label]) => <div key={String(label)}><strong className="block text-lg text-slate-950">{value}</strong><span className="text-[11px] text-slate-400">{label}</span></div>)}</div>
      </div>
      <div className="relative overflow-x-auto overflow-y-hidden rounded-2xl bg-slate-50/50 p-2" aria-label="1년 GitHub 기여 그래프">
        <GithubEChart variant="calendar" days={contributions.days} />
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400"><span>1년 전</span><div className="flex items-center gap-1.5"><span>Less</span>{['bg-slate-100','bg-blue-200','bg-blue-400','bg-blue-600','bg-cyan-400'].map(item => <span key={item} className={`h-2.5 w-2.5 rounded-[3px] ${item}`} />)}<span>More</span></div><span>오늘</span></div>
    </section>
  );
};

const RepositoryLandscape = ({ repos }: { repos: GithubRepo[] }) => (
  <section className={`${card} p-5 mobile:p-7`}>
    <div className="mb-3 flex flex-col gap-2 mobile:flex-row mobile:items-end mobile:justify-between">
      <div>
        <div className="inline-flex rounded-full bg-ftBlue/8 px-3 py-1 text-xs font-semibold text-ftBlue">저장소 지도</div>
        <h3 className="mt-2 text-xl font-extrabold text-ftBlack">프로젝트 구성 한눈에 보기</h3>
        <p className="mt-1 text-sm text-slate-500">언어별 프로젝트 생태계예요. 블록을 눌러 저장소까지 탐색해보세요.</p>
      </div>
      <div className="flex gap-3 text-[11px] text-slate-400"><span>색 · 주력 언어</span><span>면적 · 프로젝트 영향력</span></div>
    </div>
    <GithubEChart variant="repos" repos={repos} />
  </section>
);

const Languages = ({ repos }: { repos: GithubRepo[] }) => {
  const items = useMemo(() => {
    const totals = new Map<string, number>();
    repos.filter(repo => !repo.fork && !repo.archived && repo.language).forEach(repo => totals.set(repo.language as string, (totals.get(repo.language as string) || 0) + Math.max(repo.size, 1)));
    const sorted = Array.from(totals.entries()).sort((a,b) => b[1]-a[1]).slice(0,5); const total = sorted.reduce((sum,[,value]) => sum+value,0) || 1;
    return sorted.map(([name,value]) => ({ name, percent: Math.round(value / total * 100) }));
  }, [repos]);
  let cursor = 0; const gradient = items.map(item => { const from=cursor; cursor += item.percent; return `${languageColors[item.name] || '#64748b'} ${from}% ${cursor}%`; }).join(',');
  return (
    <section className={`${card} p-5 mobile:p-6`}><div className="mb-6 flex items-center justify-between"><div><div className="text-xs font-semibold text-ftBlue">주력 기술</div><h3 className="mt-1 text-lg font-bold text-ftBlack">기술 지문</h3></div><FiCode className="text-ftBlue" /></div>
      {items.length ? <div className="flex items-center gap-7"><div className="relative h-28 w-28 flex-none rounded-full" style={{ background: `conic-gradient(${gradient})` }}><div className="absolute inset-[18px] flex items-center justify-center rounded-full bg-white text-center text-xs font-bold leading-4 text-slate-600">TOP<br/>{items[0].name}</div></div><div className="min-w-0 flex-1 space-y-3">{items.map(item => <div key={item.name} className="flex items-center gap-2 text-sm"><span className="h-2.5 w-2.5 rounded-full" style={{backgroundColor: languageColors[item.name] || '#64748b'}}/><span className="min-w-0 flex-1 truncate font-medium text-slate-700">{item.name}</span><b>{item.percent}%</b></div>)}</div></div> : <div className="py-10 text-center text-sm text-slate-400">언어 데이터가 없어요.</div>}
      <p className="mt-5 text-[11px] leading-5 text-slate-400">공개 저장소 크기와 대표 언어를 기준으로 산출한 추정치예요.</p>
    </section>
  );
};

const Repositories = ({ repos }: { repos: GithubRepo[] }) => {
  const featured = useMemo(() => [...repos].filter(repo => !repo.fork && !repo.archived).sort((a,b) => b.stargazers_count*3+b.forks_count-(a.stargazers_count*3+a.forks_count)).slice(0,5), [repos]);
  return <section className={`${card} p-5 mobile:p-6`}><div className="mb-5 flex items-center justify-between"><div><div className="text-xs font-semibold text-ftBlue">프로젝트</div><h3 className="mt-1 text-lg font-bold text-ftBlack">대표 저장소</h3></div><span className="rounded-full bg-ftBlue/8 px-2.5 py-1 text-[11px] font-semibold text-ftBlue">{featured.length}개</span></div>
    <div className="space-y-2">{featured.map((repo,index) => <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" className="group flex items-start gap-3 rounded-2xl border border-transparent p-3 transition hover:border-blue-100 hover:bg-blue-50/50"><span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500 group-hover:bg-blue-600 group-hover:text-white">{index+1}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><strong className="truncate text-sm text-slate-900 group-hover:text-blue-700">{repo.name}</strong>{repo.language ? <span className="rounded-full bg-slate-100 px-2 py-.5 text-[9px] text-slate-500">{repo.language}</span>:null}</div><p className="mt-1 truncate text-xs text-slate-500">{repo.description || '저장소 설명이 아직 없어요.'}</p><div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400"><span className="flex items-center gap-1"><FiStar/>{repo.stargazers_count}</span><span>⑂ {repo.forks_count}</span><span className="ml-auto">{ago(repo.pushed_at)}</span></div></div><FiArrowUpRight className="mt-1 flex-none text-slate-300 group-hover:text-blue-600"/></a>)}</div>
  </section>;
};

const Activity = ({ events }: { events: GithubEvent[] }) => {
  const visible = events.filter(event => eventConfig[event.type]).slice(0,8);
  const text = (event: GithubEvent) => event.type === 'PushEvent' ? event.payload.commits?.[0]?.message?.split('\n')[0] || '새 커밋을 푸시했습니다.' : event.type === 'PullRequestEvent' ? event.payload.pull_request?.title || '풀 리퀘스트를 업데이트했습니다.' : event.type === 'IssuesEvent' ? event.payload.issue?.title || '이슈를 업데이트했습니다.' : eventConfig[event.type].label;
  return <section className={card}><div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 mobile:px-6"><div><div className="text-xs font-semibold text-ftBlue">공개 활동</div><h3 className="mt-1 text-lg font-bold text-ftBlack">최근 활동</h3></div><FiClock className="text-ftBlue"/></div>
    {visible.length ? <div className="divide-y divide-slate-100">{visible.map(event => <div key={event.id} className="flex gap-3 px-5 py-4 transition hover:bg-slate-50 mobile:px-6"><span className={`mt-1.5 h-2.5 w-2.5 flex-none rounded-full ${eventConfig[event.type].color}`}/><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="text-[11px] font-bold uppercase text-slate-400">{eventConfig[event.type].label}</span><span className="truncate text-[11px] text-blue-600">{event.repo.name}</span><span className="ml-auto flex-none text-[10px] text-slate-400">{ago(event.created_at)}</span></div><p className="mt-1 truncate text-sm font-medium text-slate-700">{text(event)}</p></div></div>)}</div> : <div className="px-6 py-14 text-center text-sm text-slate-400">최근 공개 활동이 없어요.</div>}
  </section>;
};

const LoginBridge = () => <section className={`${card} border-ftBlue/10 bg-ftBlue/[.03] p-6`}><span className="inline-flex items-center gap-1.5 rounded-full bg-ftBlue/8 px-3 py-1 text-[11px] font-semibold text-ftBlue"><FiGithub/> LOGME + GitHub</span><h3 className="mt-4 text-xl font-extrabold leading-snug text-ftBlack">내 GitHub 활동을<br/>LOGME 기록으로 연결해보세요.</h3><p className="mt-3 text-sm leading-6 text-ftGray">대표 저장소를 글과 이력서 프로젝트로 이어갈 수 있어요.</p><div className="mt-5 space-y-2 text-sm text-slate-600">{[[<FiBookOpen key="a"/>,'기술 언어와 LOGME 글 연결'],[<FiGitPullRequest key="b"/>,'저장소를 이력서 프로젝트로 활용'],[<FiGitCommit key="c"/>,'작성한 글 GitHub 자동 백업']].map(([icon,text]) => <div key={String(text)} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5"><span className="text-ftBlue">{icon}</span>{text}</div>)}</div><Link href="/login" className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-ftBlue px-4 py-3 text-sm font-semibold text-white transition hover:bg-ftBlue/90">GitHub으로 시작하기 <FiChevronRight/></Link></section>;

const Loading = () => <div className="space-y-4" aria-label="GitHub 데이터 로딩 중"><div className={`${card} h-48 animate-pulse bg-slate-100`}/><div className="grid gap-4 tablet:grid-cols-3"><div className={`${card} h-72 animate-pulse bg-slate-100 tablet:col-span-2`}/><div className={`${card} h-72 animate-pulse bg-slate-100`}/></div></div>;

const GithubStudio = ({ userInfo, isAuthenticated, isAuthLoading }: Props) => {
  const connected = isAuthenticated ? userInfo?.github_id || '' : '';
  const [username, setUsername] = useState(connected);
  const [draft, setDraft] = useState(connected);
  const loggedIn = isAuthenticated;

  // 로그인 직후에는 토큰이 먼저 복원되고 사용자 정보(github_id)는 비동기로 도착한다.
  // 최초 빈 값이 화면 상태에 고정되지 않도록 실제 연결 계정이 확인되는 즉시 동기화한다.
  useEffect(() => {
    if (!connected) return;
    setUsername(connected);
    setDraft(connected);
  }, [connected]);
  const query = useQuery({ queryKey: ['github-studio', username], queryFn: () => fetchGithub(username), enabled: Boolean(username), staleTime: 600_000, retry: false });
  const contributionQuery = useQuery({ queryKey: ['github-contributions', username], queryFn: () => fetchContributions(username), enabled: Boolean(username), staleTime: 1_800_000, retry: false });
  const search = (name?: string) => { const normalized = (name || draft).trim().replace(/^@/, ''); if (normalized) { setDraft(normalized); setUsername(normalized); } };
  const topLanguages = useMemo(() => {
    const counts = new Map<string,number>(); query.data?.repos.forEach(repo => { if (repo.language) counts.set(repo.language,(counts.get(repo.language)||0)+1); });
    return Array.from(counts.entries()).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name])=>name);
  }, [query.data]);
  if (isAuthLoading) return <main className="space-y-4 pb-16"><Loading /></main>;

  return <main className="space-y-4 pb-16">
    {!loggedIn ? <GuestHero draft={draft} setDraft={setDraft} search={search}/> : <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm mobile:flex-row mobile:items-center mobile:justify-between mobile:p-5"><div><div className="text-xs font-semibold text-ftBlue">GitHub 활동</div><h1 className="mb-0 mt-1 text-2xl font-extrabold text-ftBlack">GitHub과 기록을 한 곳에서</h1></div><div className="w-full mobile:max-w-sm"><SearchBox value={draft} onChange={setDraft} onSubmit={() => search()}/></div></div>}
    {loggedIn && !connected ? <section className={card}><GithubConnectPrompt compact title="내 GitHub 계정을 연결해보세요" description="연결이 끝나면 이 페이지에서 내 잔디와 저장소를 바로 확인할 수 있어요." /></section> : null}
    {query.isLoading ? <Loading/> : null}
    {!username && !query.isLoading ? <EmptyProfile /> : null}
    {!query.isLoading && query.error ? <section className={`${card} px-6 py-16 text-center`}><FiGithub className="mx-auto h-10 w-10 text-slate-300"/><h2 className="mb-0 mt-5 text-xl font-black text-slate-900">{query.error instanceof Error && query.error.message === 'not_found' ? '해당 GitHub 사용자를 찾지 못했어요.' : 'GitHub 정보를 불러오지 못했어요.'}</h2><p className="mt-2 text-sm text-slate-500">{query.error instanceof Error && query.error.message === 'rate_limit' ? '공개 API 호출 한도입니다. 잠시 후 다시 시도해주세요.' : '아이디를 확인하고 다시 탐색해주세요.'}</p></section> : null}
    {query.data && !query.isLoading ? <><Profile data={query.data}/>{contributionQuery.data ? <Heatmap contributions={contributionQuery.data}/> : <div className={`${card} h-72 animate-pulse bg-slate-100`} />}<RepositoryLandscape repos={query.data.repos}/><div className="grid gap-4 tablet:grid-cols-3"><div className="space-y-4 tablet:col-span-2"><Activity events={query.data.events}/></div><div className="space-y-4"><Languages repos={query.data.repos}/><Repositories repos={query.data.repos}/>{!loggedIn ? <LoginBridge/> : null}{loggedIn && userInfo ? <RelatedPostsCard userId={userInfo.id} topLanguages={topLanguages}/> : null}</div></div><a href={query.data.profile.html_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-4 text-sm font-semibold text-slate-500 transition hover:text-blue-600">@{query.data.profile.login} GitHub 프로필에서 전체 활동 보기 <FiArrowUpRight/></a></> : null}
  </main>;
};

export default GithubStudio;
