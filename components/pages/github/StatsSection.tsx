/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from 'react';

interface StatsSectionProps {
  githubId: string;
}

const cardBase =
  'relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5';

// ── 네이티브 GitHub 통계 카드 ─────────────────────────────────────────────

interface GithubUser {
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
}

interface RepoStat {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  fork: boolean;
  archived: boolean;
}

const STAT_ITEMS = [
  { key: 'repos', label: 'Repositories', icon: '📁' },
  { key: 'stars', label: 'Total Stars', icon: '⭐' },
  { key: 'forks', label: 'Total Forks', icon: '⑂' },
  { key: 'followers', label: 'Followers', icon: '👥' },
  { key: 'following', label: 'Following', icon: '➜' },
  { key: 'issues', label: 'Open Issues', icon: '🔴' },
] as const;

const NativeStatsCard = ({ githubId }: StatsSectionProps) => {
  // h-full so it stretches to match sibling card height
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchStats = async () => {
      try {
        const headers = { Accept: 'application/vnd.github+json' };
        const encoded = encodeURIComponent(githubId);
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${encoded}`, { headers }),
          fetch(`https://api.github.com/users/${encoded}/repos?per_page=100&type=owner`, { headers }),
        ]);

        if (!userRes.ok || !reposRes.ok) {
          const failing = !userRes.ok ? userRes : reposRes;
          if (failing.status === 403 && failing.headers.get('x-ratelimit-remaining') === '0')
            throw new Error('rate_limit');
          throw new Error('failed');
        }

        const user: GithubUser = await userRes.json();
        const repos: RepoStat[] = await reposRes.json();
        if (cancelled) return;

        const active = repos.filter(r => !r.fork && !r.archived);
        setStats({
          repos: user.public_repos,
          stars: active.reduce((s, r) => s + r.stargazers_count, 0),
          forks: active.reduce((s, r) => s + r.forks_count, 0),
          followers: user.followers,
          following: user.following,
          issues: active.reduce((s, r) => s + r.open_issues_count, 0),
        });
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error && e.message === 'rate_limit'
            ? 'API 호출 제한입니다. 잠시 후 다시 시도해주세요.'
            : '통계를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();
    return () => { cancelled = true; };
  }, [githubId]);

  return (
    <div className={`${cardBase} h-full flex flex-col`}>
      <div className="p-4 space-y-3 flex flex-col flex-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-slate-400 mb-0.5">Overview</div>
            <div className="text-lg font-semibold text-slate-900">GitHub 통계</div>
            <div className="text-sm text-slate-500 mt-0.5">커밋, PR, 이슈 등 활동 지표를 살펴보세요.</div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">stats</span>
        </div>

        {loading && (
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl animate-pulse bg-gray-100" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center justify-center min-h-[160px] text-sm text-slate-400 text-center px-4">
            {error}
          </div>
        )}

        {!loading && !error && stats && (
          <div className="grid grid-cols-2 gap-2">
            {STAT_ITEMS.map(({ key, label, icon }) => (
              <div key={key} className="flex flex-col gap-1 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-base">{icon}</span>
                <span className="text-xl font-bold text-ftBlack leading-none">
                  {stats[key].toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── 기존 StatImage (StreakStats 등 이미지 기반 카드에서 사용) ─────────────

const StatImage = ({ src, alt, dark = false }: { src: string; alt: string; dark?: boolean }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [src]);

  return (
    <div className={`relative rounded-xl border ${dark ? 'border-slate-800 bg-slate-900' : 'bg-gray-50 border-gray-100'} min-h-[200px] flex items-center justify-center overflow-hidden`}>
      {loading && !error && (
        <div className={`absolute inset-0 animate-pulse ${dark ? 'bg-slate-800' : 'bg-gray-100'}`} />
      )}
      {!error ? (
        <img
          src={src}
          alt={alt}
          className="object-contain relative z-10 w-full h-full"
          onLoad={() => setLoading(false)}
          onError={() => { setError(true); setLoading(false); }}
        />
      ) : (
        <div className={`relative z-10 p-4 text-center text-sm ${dark ? 'text-slate-200' : 'text-slate-500'}`}>
          이미지를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </div>
      )}
    </div>
  );
};

interface LangItem {
  name: string;
  count: number;
}

const LanguageList = ({ githubId }: { githubId: string }) => {
  const [languages, setLanguages] = useState<LangItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchLangs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.github.com/users/${githubId}/repos?per_page=50&type=owner&sort=updated`,
          { headers: { Accept: 'application/vnd.github+json' } }
        );
        if (!res.ok) throw new Error('failed');
        const data: { language: string | null }[] = await res.json();
        if (cancelled) return;
        const counter = data.reduce<Record<string, number>>((acc, cur) => {
          if (cur.language) acc[cur.language] = (acc[cur.language] || 0) + 1;
          return acc;
        }, {});
        const sorted = Object.entries(counter)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);
        setLanguages(sorted);
      } catch {
        if (!cancelled) setError('언어 데이터를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchLangs();
    return () => { cancelled = true; };
  }, [githubId]);

  const maxCount = useMemo(
    () => (languages.length ? Math.max(...languages.map(l => l.count)) : 0),
    [languages]
  );

  if (loading) {
    return (
      <div className="min-h-[200px] rounded-xl border border-slate-800 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 animate-pulse bg-slate-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[200px] rounded-xl border border-slate-800 bg-slate-900 text-slate-300 flex items-center justify-center px-4 text-sm">
        {error}
      </div>
    );
  }

  if (!languages.length) {
    return (
      <div className="min-h-[200px] rounded-xl border border-slate-800 bg-slate-900 text-slate-300 flex items-center justify-center px-4 text-sm">
        공개 저장소 기준 언어 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3 rounded-xl border border-slate-800 bg-slate-900">
      {languages.map(lang => (
        <div key={lang.name}>
          <div className="flex justify-between text-xs text-slate-200 mb-1">
            <span className="font-medium">{lang.name}</span>
            <span className="text-slate-400">{lang.count}</span>
          </div>
          <div className="overflow-hidden w-full h-1.5 rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full"
              style={{ width: maxCount ? `${(lang.count / maxCount) * 100}%` : '0%' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const CardHeader = ({ label, title, subtitle, badge }: { label: string; title: string; subtitle: string; badge: string }) => (
  <div className="flex justify-between items-start">
    <div>
      <div className="text-[11px] uppercase tracking-widest text-slate-400 mb-0.5">{label}</div>
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      <div className="text-sm text-slate-500 mt-0.5">{subtitle}</div>
    </div>
    <span className="text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">{badge}</span>
  </div>
);

export const GithubStatsCard = ({ githubId }: StatsSectionProps) => (
  <div className="h-full">
    <NativeStatsCard githubId={githubId} />
  </div>
);

export const GithubLanguagesCard = ({ githubId }: StatsSectionProps) => (
  <div className={cardBase}>
    <div className="p-4 space-y-3">
      <CardHeader label="Languages" title="주요 사용 언어" subtitle="프로젝트에서 가장 많이 사용된 언어 분포입니다." badge="top-langs" />
      <LanguageList githubId={githubId} />
    </div>
  </div>
);

const StatsSection = ({ githubId }: StatsSectionProps) => (
  <section className="grid grid-cols-1 gap-4 tablet:gap-6 tablet:grid-cols-2">
    <GithubStatsCard githubId={githubId} />
    <GithubLanguagesCard githubId={githubId} />
  </section>
);

export default StatsSection;
