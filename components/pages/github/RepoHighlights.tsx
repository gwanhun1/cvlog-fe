import { useEffect, useMemo, useState } from 'react';

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
  topics?: string[];
}

const cardBase =
  'relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
  Java: '#b07219', Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516',
  'C++': '#f34b7d', C: '#555555', Swift: '#FA7343', Kotlin: '#A97BFF',
  Dart: '#00B4AB', Vue: '#41b883', Svelte: '#ff3e00',
};

const getLangColor = (lang: string) => LANG_COLORS[lang] ?? '#6e7681';

const RepoHighlights = ({ githubId }: RepoHighlightsProps) => {
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterLang, setFilterLang] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);
    setFilterLang(null);
    setShowAll(false);

    const fetchRepos = async () => {
      try {
        const res = await fetch(
          `https://api.github.com/users/${encodeURIComponent(githubId)}/repos?sort=updated&per_page=30&type=owner`,
          { headers: { Accept: 'application/vnd.github+json' } },
        );
        if (!res.ok) {
          const remaining = res.headers.get('x-ratelimit-remaining');
          if (res.status === 403 && remaining === '0') throw new Error('rate_limit');
          throw new Error('failed');
        }
        const data: RepoItem[] = await res.json();
        if (isCancelled) return;
        setRepos(data.filter(r => !r.language || true)); // keep all
      } catch (e) {
        if (isCancelled) return;
        setError(e instanceof Error && e.message === 'rate_limit'
          ? 'GitHub API 호출 제한입니다. 잠시 후 다시 시도해주세요.'
          : '레포지토리를 불러오지 못했습니다.');
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchRepos();
    return () => { isCancelled = true; };
  }, [githubId]);

  const languages = useMemo(() => {
    const langs = repos
      .map(r => r.language)
      .filter((l): l is string => !!l);
    return Array.from(new Set(langs)).slice(0, 6);
  }, [repos]);

  const sortedRepos = useMemo(() =>
    [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count),
    [repos],
  );

  const filtered = filterLang
    ? sortedRepos.filter(r => r.language === filterLang)
    : sortedRepos;

  const PAGE_SIZE = 4;
  const displayed = showAll ? filtered : filtered.slice(0, PAGE_SIZE);
  const hasMore = filtered.length > PAGE_SIZE && !showAll;

  return (
    <section className={`${cardBase}`}>
      <div className="p-5 space-y-4">
        {/* 헤더 */}
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-slate-400 mb-0.5">Highlight</div>
            <div className="text-lg font-semibold text-slate-900">저장소</div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
            {repos.length} repos
          </span>
        </div>

        {/* 언어 필터 */}
        {!loading && !error && languages.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => { setFilterLang(null); setShowAll(false); }}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-full border transition-colors ${
                filterLang === null
                  ? 'bg-ftBlue text-white border-ftBlue'
                  : 'bg-white text-ftGray border-slate-200 hover:border-ftBlue/40'
              }`}
            >
              전체
            </button>
            {languages.map(lang => (
              <button
                key={lang}
                type="button"
                onClick={() => { setFilterLang(lang); setShowAll(false); }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full border transition-colors ${
                  filterLang === lang
                    ? 'bg-ftBlue text-white border-ftBlue'
                    : 'bg-white text-ftGray border-slate-200 hover:border-ftBlue/40'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getLangColor(lang) }}
                />
                {lang}
              </button>
            ))}
          </div>
        )}

        {/* 목록 */}
        {loading && (
          <div className="grid grid-cols-1 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl animate-pulse bg-gray-100" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="px-4 py-3 text-sm text-red-500 bg-red-50 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="py-8 text-center text-sm text-slate-400">
            {filterLang ? `${filterLang} 저장소가 없어요.` : '표시할 저장소가 없습니다.'}
          </div>
        )}

        {!loading && !error && displayed.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {displayed.map(repo => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col gap-1.5 p-3 bg-white rounded-xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 group hover:border-ftBlue/20 hover:shadow-md"
                >
                  <div className="flex gap-2 justify-between items-start">
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-ftBlue transition-colors truncate">
                      {repo.name}
                    </span>
                    {repo.language && (
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: `${getLangColor(repo.language)}18`,
                          color: getLangColor(repo.language),
                          border: `1px solid ${getLangColor(repo.language)}30`,
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getLangColor(repo.language) }} />
                        {repo.language}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                    {repo.description || '설명 없음'}
                  </p>
                  <div className="flex gap-3 items-center text-xs text-slate-400">
                    <span>★ {repo.stargazers_count}</span>
                    <span>⑂ {repo.forks_count}</span>
                    <span className="ml-auto">{new Date(repo.updated_at).toLocaleDateString()}</span>
                  </div>
                </a>
              ))}
            </div>

            {hasMore && (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="w-full py-2 text-xs font-medium text-ftBlue bg-ftBlue/5 rounded-xl border border-ftBlue/15 hover:bg-ftBlue/10 transition-colors"
              >
                {filtered.length - PAGE_SIZE}개 더 보기
              </button>
            )}
            {showAll && filtered.length > PAGE_SIZE && (
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="w-full py-2 text-xs font-medium text-ftGray bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                접기
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default RepoHighlights;
