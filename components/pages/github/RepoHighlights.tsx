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
  'relative overflow-hidden rounded-2xl border border-slate-100 bg-white/85 shadow-lg backdrop-blur transition-transform duration-200 hover:-translate-y-0.5';

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
        const res = await fetch(
          `https://api.github.com/users/${githubId}/repos?sort=updated&per_page=8&type=owner`,
          {
            headers: {
              Accept: 'application/vnd.github+json',
            },
          }
        );

        if (!res.ok) {
          throw new Error('failed');
        }

        const data: RepoItem[] = await res.json();
        if (isCancelled) return;

        const sorted = [...data]
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 4);

        setRepos(sorted);
      } catch {
        if (!isCancelled) {
          setError('레포지토리를 불러오지 못했습니다.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchRepos();

    return () => {
      isCancelled = true;
    };
  }, [githubId]);

  const hasData = !loading && !error && repos.length > 0;

  return (
    <section className={cardBase}>
      <div className="absolute inset-0 bg-gradient-to-br via-white to-blue-50 from-slate-50" />
      <div className="relative p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Highlight
            </p>
            <h3 className="text-xl font-semibold text-slate-900">
              최근 주목할 저장소
            </h3>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            repos
          </span>
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-32 rounded-xl animate-pulse bg-slate-100"
              />
            ))}
          </div>
        )}

        {!loading && !error && !hasData && (
          <div className="flex flex-col gap-2 justify-center items-center p-6 rounded-xl border border-slate-100 bg-slate-50/80 text-slate-500">
            <p className="text-sm font-medium">표시할 저장소가 없습니다.</p>
            <p className="text-xs">
              별이 있거나 최근 수정된 저장소가 나타납니다. 활동 후 다시 확인해
              주세요.
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="px-3 py-2 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {!loading && !error && hasData && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {repos.map(repo => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col gap-2 p-4 bg-white rounded-xl border shadow-sm transition-all duration-200 group border-slate-100 hover:shadow-md"
              >
                <div className="flex gap-2 justify-between items-start">
                  <h4 className="text-base font-semibold transition-colors text-slate-900 group-hover:text-blue-600">
                    {repo.name}
                  </h4>
                  {repo.language && (
                    <span className="px-2 py-1 text-xs text-blue-700 bg-blue-50 rounded-full border border-blue-100">
                      {repo.language}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 min-h-[40px]">
                  {repo.description || '설명이 없는 저장소입니다.'}
                </p>
                <div className="flex gap-4 items-center mt-auto text-sm text-slate-500">
                  <span className="inline-flex gap-1 items-center">
                    ★ {repo.stargazers_count}
                  </span>
                  <span className="inline-flex gap-1 items-center">
                    ⑂ {repo.forks_count}
                  </span>
                  <span className="ml-auto text-xs">
                    업데이트 {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
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
