import { useEffect, useState } from 'react';

interface RepoHighlightsProps {
  githubId: string;
}

interface RepoItem {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

const cardBase =
  'relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5';

const RepoHighlights = ({ githubId }: RepoHighlightsProps) => {
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchRepos = async () => {
      setLoading(true);
      setError(null);
      try {
        const encodedGithubId = encodeURIComponent(githubId);
        const res = await fetch(
          `https://api.github.com/users/${encodedGithubId}/repos?sort=updated&per_page=8&type=owner`,
          { headers: { Accept: 'application/vnd.github+json' } }
        );

        if (!res.ok) {
          const remaining = res.headers.get('x-ratelimit-remaining');
          if (res.status === 403 && remaining === '0') throw new Error('rate_limit');
          throw new Error('failed');
        }

        const data: RepoItem[] = await res.json();
        if (isCancelled) return;

        const sorted = [...data]
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 4);

        setRepos(sorted);
      } catch (e) {
        if (isCancelled) return;
        if (e instanceof Error && e.message === 'rate_limit') {
          setError('GitHub API 호출 제한에 걸렸습니다. 잠시 후 다시 시도해주세요.');
          return;
        }
        setError('레포지토리를 불러오지 못했습니다.');
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchRepos();
    return () => { isCancelled = true; };
  }, [githubId]);

  const hasData = !loading && !error && repos.length > 0;

  return (
    <section className={`${cardBase} min-h-[420px]`}>
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-slate-400 mb-0.5">Highlight</div>
            <div className="text-lg font-semibold text-slate-900">최근 주목할 저장소</div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">repos</span>
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-28 rounded-xl animate-pulse bg-gray-100" />
            ))}
          </div>
        )}

        {!loading && !error && !hasData && (
          <div className="flex flex-col gap-2 justify-center items-center p-6 rounded-xl border border-gray-100 bg-gray-50 text-slate-400 min-h-[280px] text-center">
            <div className="text-sm font-medium">표시할 저장소가 없습니다.</div>
            <div className="text-xs">별이 있거나 최근 수정된 저장소가 나타납니다.</div>
          </div>
        )}

        {!loading && error && (
          <div className="px-4 py-3 text-sm text-red-500 bg-red-50 rounded-xl border border-red-100 min-h-[280px] flex items-center justify-center text-center">
            {error}
          </div>
        )}

        {!loading && !error && hasData && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {repos.map(repo => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col gap-2 p-3.5 bg-white rounded-xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 group hover:border-ftBlue/20 hover:shadow-md"
              >
                <div className="flex gap-2 justify-between items-start">
                  <div className="text-sm font-semibold text-slate-900 group-hover:text-ftBlue transition-colors truncate">{repo.name}</div>
                  {repo.language && (
                    <span className="px-2 py-0.5 text-[11px] text-blue-600 bg-blue-50 rounded-full border border-blue-100 flex-shrink-0">{repo.language}</span>
                  )}
                </div>
                <div className="text-xs text-slate-500 line-clamp-2 min-h-[32px] leading-relaxed">
                  {repo.description || '설명이 없는 저장소입니다.'}
                </div>
                <div className="flex gap-3 items-center mt-auto text-xs text-slate-400">
                  <span>★ {repo.stargazers_count}</span>
                  <span>⑂ {repo.forks_count}</span>
                  <span className="ml-auto">{new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RepoHighlights;
