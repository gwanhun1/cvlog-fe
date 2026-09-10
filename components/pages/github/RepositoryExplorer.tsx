import { useMemo, useState } from 'react';
import { FiExternalLink, FiSearch, FiStar } from 'react-icons/fi';

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
}
export default function RepositoryExplorer({
  repos,
  total,
}: {
  repos: Repo[];
  total: number;
}) {
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('all');
  const [sort, setSort] = useState('recent');
  const [includeForks, setIncludeForks] = useState(false);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [limit, setLimit] = useState(6);
  const languages = useMemo(
    () =>
      [
        ...new Set(
          repos
            .map(repo => repo.language)
            .filter((value): value is string => Boolean(value)),
        ),
      ].sort(),
    [repos],
  );
  const filtered = useMemo(
    () =>
      repos
        .filter(
          repo =>
            (includeForks || !repo.fork) &&
            (includeArchived || !repo.archived) &&
            (language === 'all' || repo.language === language) &&
            `${repo.name} ${repo.description ?? ''}`
              .toLowerCase()
              .includes(search.trim().toLowerCase()),
        )
        .sort((a, b) =>
          sort === 'stars'
            ? b.stargazers_count - a.stargazers_count
            : sort === 'name'
              ? a.name.localeCompare(b.name)
              : Date.parse(b.pushed_at) - Date.parse(a.pushed_at),
        ),
    [repos, search, language, sort, includeForks, includeArchived],
  );
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm mobile:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-extrabold text-slate-950">저장소 탐색</h3>
        <span className="text-xs font-medium text-slate-600">
          {filtered.length}개 일치 · {repos.length}개 조회
        </span>
      </div>
      <div className="flex flex-col gap-3 tablet:flex-row">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-300 px-3">
          <FiSearch className="text-slate-500" />
          <span className="sr-only">저장소 이름 또는 설명 검색</span>
          <input
            value={search}
            onChange={event => {
              setSearch(event.target.value);
              setLimit(6);
            }}
            placeholder="이름 또는 설명으로 검색"
            className="min-w-0 flex-1 py-2 text-sm text-slate-900"
          />
        </label>
        <select
          aria-label="저장소 언어 필터"
          value={language}
          onChange={event => {
            setLanguage(event.target.value);
            setLimit(6);
          }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="all">모든 언어</option>
          {languages.map(value => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <select
          aria-label="저장소 정렬"
          value={sort}
          onChange={event => setSort(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="recent">최근 업데이트</option>
          <option value="stars">Star 많은 순</option>
          <option value="name">이름순</option>
        </select>
      </div>
      <div className="my-4 flex flex-wrap gap-4 text-xs text-slate-700">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeForks}
            onChange={event => setIncludeForks(event.target.checked)}
          />
          Fork 포함
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeArchived}
            onChange={event => setIncludeArchived(event.target.checked)}
          />
          보관된 저장소 포함
        </label>
        {total > repos.length ? (
          <span>
            최근 업데이트된 {repos.length}개 공개 저장소에서 검색합니다.
          </span>
        ) : null}
      </div>
      <div className="grid gap-3 tablet:grid-cols-2">
        {filtered.slice(0, limit).map(repo => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="group rounded-xl border border-slate-200 p-4 transition hover:border-blue-500 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="break-all text-sm font-bold text-blue-800">
                {repo.name}
              </h4>
              <FiExternalLink className="shrink-0 text-slate-500" />
            </div>
            <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-600">
              {repo.description || '설명이 없는 저장소입니다.'}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span>{repo.language || '언어 미지정'}</span>
              <span className="inline-flex items-center gap-1">
                <FiStar />
                {repo.stargazers_count.toLocaleString()}
              </span>
              <span>Fork {repo.forks_count}</span>
              <time className="ml-auto" dateTime={repo.pushed_at}>
                {new Date(repo.pushed_at).toLocaleDateString('ko-KR')}
              </time>
            </div>
            {repo.fork || repo.archived ? (
              <p className="mt-2 text-xs text-slate-600">
                {[repo.fork && 'Fork', repo.archived && '보관됨']
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            ) : null}
          </a>
        ))}
      </div>
      {!filtered.length ? (
        <p role="status" className="py-10 text-center text-sm text-slate-600">
          조건에 맞는 저장소가 없습니다. 검색어나 필터를 바꿔보세요.
        </p>
      ) : null}
      {filtered.length > limit ? (
        <button
          onClick={() => setLimit(value => value + 6)}
          className="mt-4 w-full rounded-lg border border-slate-300 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          더 보기 ({filtered.length - limit}개 남음)
        </button>
      ) : null}
    </section>
  );
}
