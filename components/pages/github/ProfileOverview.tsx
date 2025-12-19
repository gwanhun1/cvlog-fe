import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

interface ProfileOverviewProps {
  githubId: string;
  fallbackName?: string;
  fallbackAvatar?: string | null;
}

interface GithubUserResponse {
  login: string;
  name: string | null;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
  avatar_url: string;
  html_url: string;
  updated_at: string;
}

interface RepoItem {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  archived: boolean;
  fork: boolean;
}

const cardBase =
  'relative overflow-hidden rounded-2xl border border-slate-100 bg-white/85 shadow-lg backdrop-blur transition-transform duration-200 hover:-translate-y-0.5';

const StatPill = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-col gap-1 px-3 py-2.5 rounded-2xl border border-ftBlue/10 bg-bgWhite">
      <span className="text-[11px] tracking-[0.18em] uppercase text-ftGray">
        {label}
      </span>
      <span className="text-base font-extrabold text-ftBlack">{value}</span>
    </div>
  );
};

const ProfileOverview = ({
  githubId,
  fallbackName,
  fallbackAvatar,
}: ProfileOverviewProps) => {
  const [user, setUser] = useState<GithubUserResponse | null>(null);
  const [repoStats, setRepoStats] = useState<{
    stars: number;
    forks: number;
    issues: number;
    topLangs: { name: string; count: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      setUser(null);
      setRepoStats(null);

      try {
        const headers = {
          Accept: 'application/vnd.github+json',
        };

        const encodedGithubId = encodeURIComponent(githubId);

        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${encodedGithubId}`, { headers }),
          fetch(
            `https://api.github.com/users/${encodedGithubId}/repos?per_page=100&type=owner&sort=updated`,
            { headers }
          ),
        ]);

        if (!userRes.ok || !reposRes.ok) {
          const res = !userRes.ok ? userRes : reposRes;
          const remaining = res.headers.get('x-ratelimit-remaining');
          if (res.status === 403 && remaining === '0') {
            throw new Error('rate_limit');
          }
          throw new Error('failed');
        }

        const userData: GithubUserResponse = await userRes.json();
        const reposData: RepoItem[] = await reposRes.json();
        if (cancelled) return;

        const activeRepos = reposData.filter(r => !r.archived && !r.fork);

        const stars = activeRepos.reduce(
          (acc, cur) => acc + (cur.stargazers_count || 0),
          0
        );
        const forks = activeRepos.reduce(
          (acc, cur) => acc + (cur.forks_count || 0),
          0
        );
        const issues = activeRepos.reduce(
          (acc, cur) => acc + (cur.open_issues_count || 0),
          0
        );

        const langCounter = activeRepos.reduce<Record<string, number>>(
          (acc, cur) => {
            if (cur.language) {
              acc[cur.language] = (acc[cur.language] || 0) + 1;
            }
            return acc;
          },
          {}
        );

        const topLangs = Object.entries(langCounter)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setUser(userData);
        setRepoStats({ stars, forks, issues, topLangs });
      } catch (e) {
        if (cancelled) return;
        if (e instanceof Error && e.message === 'rate_limit') {
          setError(
            'GitHub API 호출 제한에 걸렸습니다. 잠시 후 다시 시도해주세요.'
          );
          return;
        }
        setError('GitHub 정보를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();

    return () => {
      cancelled = true;
    };
  }, [githubId]);

  const displayName = useMemo(() => {
    if (user?.name) return user.name;
    if (fallbackName) return fallbackName;
    return githubId;
  }, [fallbackName, githubId, user?.name]);

  const displayAvatar = user?.avatar_url || fallbackAvatar || '';

  if (loading) {
    return (
      <section className={`${cardBase} min-h-[220px]`}>
        <div className="absolute inset-0 bg-gradient-to-br via-white to-blue-50 from-slate-50" />
        <div className="relative p-5">
          <div className="h-20 rounded-2xl animate-pulse bg-gray-100" />
          <div className="grid grid-cols-2 gap-3 mt-6 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-16 rounded-2xl animate-pulse bg-gray-100"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`${cardBase} min-h-[220px]`}>
        <div className="absolute inset-0 bg-gradient-to-br via-white to-blue-50 from-slate-50" />
        <div className="relative p-5 min-h-[220px] flex items-center">
          <div className="p-4 text-sm text-red-500 rounded-2xl border border-red-100 bg-red-50">
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (!user) return null;

  return (
    <section className={`${cardBase} min-h-[220px]`}>
      <div className="absolute inset-0 bg-gradient-to-br via-white to-blue-50 from-slate-50" />
      <div className="relative p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3 items-center">
            {displayAvatar ? (
              <div className="overflow-hidden relative w-14 h-14 rounded-full border border-ftBlue/20">
                <Image
                  src={displayAvatar}
                  alt={`${displayName} avatar`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-100" />
            )}

            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.25em] text-ftGray">
                GitHub Dashboard
              </p>
              <h1 className="text-xl font-extrabold text-ftBlack">
                {displayName}
              </h1>
              <p className="text-sm text-ftGray">
                @{user.login}
                <span className="mx-2 text-gray-300">|</span>
                업데이트 {new Date(user.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <a
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex gap-2 items-center px-3.5 py-2 text-sm font-semibold rounded-xl border-2 transition-all duration-300 text-ftBlue border-ftBlue/30 bg-white hover:bg-ftBlue hover:text-white"
            >
              GitHub 프로필
              <span className="text-base">↗</span>
            </a>
          </div>
        </div>

        {user.bio && (
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ftGray">
            {user.bio}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-4">
          <StatPill label="Followers" value={String(user.followers)} />
          <StatPill label="Following" value={String(user.following)} />
          <StatPill label="Repos" value={String(user.public_repos)} />
          <StatPill
            label="Stars"
            value={repoStats ? String(repoStats.stars) : '-'}
          />
        </div>

        {repoStats?.topLangs?.length ? (
          <div className="flex flex-wrap gap-2 mt-4">
            {repoStats.topLangs.map(lang => (
              <span
                key={lang.name}
                className="px-3 py-1 text-xs font-semibold rounded-full border bg-white/80 text-ftBlue border-ftBlue/20"
              >
                {lang.name}
                <span className="ml-2 text-ftGray">{lang.count}</span>
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ProfileOverview;
