import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { getDiscoveryFilters } from 'service/api/discovery';
export default function DiscoveryFilters({
  onSearch,
}: {
  onSearch: (value: string) => void;
}) {
  const router = useRouter();
  const selected = typeof router.query.q === 'string' ? router.query.q : '';
  const filters = useQuery({
    queryKey: ['discoveryFilters'],
    queryFn: getDiscoveryFilters,
    staleTime: 300000,
    retry: 1,
  });
  return (
    <section
      aria-label="주제와 정렬"
      className="my-5 space-y-3 rounded-xl border border-slate-200 bg-white p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-800">
          관심 있는 기록 찾기
        </p>
        <label className="text-sm text-slate-700">
          정렬{' '}
          <select
            value={router.query.sort === 'popular' ? 'popular' : 'latest'}
            onChange={e =>
              router.push(
                {
                  pathname: '/article',
                  query: { ...router.query, view: 'all', sort: e.target.value },
                },
                undefined,
                { shallow: true },
              )
            }
            className="ml-2 rounded-lg border border-slate-300 p-2"
          >
            <option value="latest">최신순</option>
            <option value="popular">많이 읽은 순</option>
          </select>
        </label>
      </div>
      {filters.data?.tags.length ? (
        <div className="flex flex-wrap gap-2" aria-label="주제 검색">
          {filters.data.tags.map(tag => (
            <button
              type="button"
              key={tag.name}
              aria-pressed={selected === tag.name}
              onClick={() => onSearch(selected === tag.name ? '' : tag.name)}
              className={`rounded-full border px-3 py-2 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-ftBlue ${selected === tag.name ? 'border-ftBlue bg-ftBlue text-white' : 'border-blue-100 bg-blue-50 text-ftBlue hover:border-ftBlue/40'}`}
            >
              {selected === tag.name ? '✓ ' : ''}#{tag.name} · {tag.count}
            </button>
          ))}
          {selected && (
            <button
              type="button"
              onClick={() => onSearch('')}
              className="px-2 text-xs text-slate-500"
            >
              필터 해제
            </button>
          )}
        </div>
      ) : null}
      {filters.data?.series.length ? (
        <label className="block text-sm text-slate-700">
          시리즈 검색{' '}
          <select
            value=""
            onChange={e => {
              if (e.target.value) onSearch(e.target.value);
            }}
            className="ml-2 max-w-full rounded-lg border border-slate-300 p-2"
          >
            <option value="">시리즈 선택</option>
            {filters.data.series.map(series => (
              <option key={series.name} value={series.name}>
                {series.name} ({series.count})
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {filters.isError && (
        <button
          className="text-sm text-blue-700"
          onClick={() => filters.refetch()}
        >
          주제 목록 다시 불러오기
        </button>
      )}
    </section>
  );
}
