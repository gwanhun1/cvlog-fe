import { useRouter } from 'next/router';

export default function DiscoveryFilters() {
  const router = useRouter();

  return (
    <label className="mb-3 flex min-h-[44px] items-center justify-end gap-2 text-sm text-slate-600">
      정렬
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
        className="min-h-[40px] rounded-lg border border-slate-300 bg-white px-3 text-sm"
      >
        <option value="latest">최신순</option>
        <option value="popular">많이 읽은 순</option>
      </select>
    </label>
  );
}
