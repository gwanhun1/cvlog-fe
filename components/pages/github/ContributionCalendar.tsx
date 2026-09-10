import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FiActivity, FiExternalLink, FiRefreshCw } from 'react-icons/fi';
import {
  CONTRIBUTION_COLORS,
  contributionSummary,
  type ContributionData,
} from 'utils/githubContributions';

const GithubEChart = dynamic(() => import('./GithubEChart'), {
  ssr: false,
  loading: () => (
    <div className="h-[210px] animate-pulse rounded-xl bg-slate-100" />
  ),
});

export default function ContributionCalendar({
  username,
  joinedAt,
}: {
  username: string;
  joinedAt: string;
}) {
  const [year, setYear] = useState('last');
  const [selected, setSelected] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [refreshError, setRefreshError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const currentYear = new Date().getFullYear();
  const firstYear = Math.max(2008, new Date(joinedAt).getFullYear());
  const load = async (fresh = false): Promise<ContributionData> => {
    const response = await fetch(
      `/api/github/contributions?username=${encodeURIComponent(username)}&year=${year}${fresh ? '&fresh=1' : ''}`,
    );
    if (!response.ok) throw new Error('contributions_failed');
    return response.json();
  };
  const query = useQuery({
    queryKey: ['github-contributions', username, year],
    queryFn: () => load(),
    staleTime: 300000,
    retry: false,
  });
  const summary = useMemo(
    () => contributionSummary(query.data?.days ?? []),
    [query.data],
  );
  const activeDay = query.data?.days.find(day => day.date === selected);
  const refresh = async () => {
    setRefreshing(true);
    setRefreshError(false);
    try {
      // The one-shot fresh request bypasses the public five-minute response cache.
      const data = await load(true);
      queryClient.setQueryData(['github-contributions', username, year], data);
    } catch {
      setRefreshError(true);
    } finally {
      setRefreshing(false);
    }
  };
  const queryClient = useQueryClient();
  const maxMonth = Math.max(1, ...summary.months.map(month => month.count));
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-5 border-b border-slate-200 p-5 mobile:p-6 tablet:flex-row tablet:items-center tablet:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            <FiActivity /> Contribution calendar
          </div>
          <h3 className="text-xl font-extrabold text-slate-950">
            꾸준함이 쌓이는 곳
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {year === 'last' ? '최근 1년' : `${year}년`}의 실제 GitHub 기여 기록
            · 날짜를 눌러 확인하세요.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="contribution-year" className="sr-only">
            기여 기록 연도
          </label>
          <select
            id="contribution-year"
            value={year}
            onChange={event => {
              setYear(event.target.value);
              setSelected('');
              setRefreshError(false);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <option value="last">최근 1년</option>
            {Array.from(
              { length: currentYear - firstYear + 1 },
              (_, i) => currentYear - i,
            ).map(value => (
              <option key={value} value={value}>
                {value}년
              </option>
            ))}
          </select>
          <button
            onClick={refresh}
            disabled={query.isFetching || refreshing}
            aria-label="기여 기록 새로고침"
            className="rounded-lg border border-slate-300 p-2.5 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      {query.isLoading ? (
        <div
          className="m-6 h-72 animate-pulse rounded-xl bg-slate-100"
          role="status"
          aria-label="기여 기록 불러오는 중"
        />
      ) : query.isError ? (
        <div role="alert" className="p-8 text-center">
          <p className="font-semibold text-slate-900">
            기여 기록을 불러오지 못했습니다.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            일시적인 GitHub 응답 오류일 수 있습니다.
          </p>
          <button
            onClick={() => query.refetch()}
            className="mt-4 rounded-lg bg-blue-700 px-4 py-2 text-sm text-white"
          >
            다시 시도
          </button>
        </div>
      ) : query.data ? (
        <div className="space-y-5 p-5 mobile:p-6">
          <div className="grid grid-cols-2 gap-3 tablet:grid-cols-4">
            {[
              [summary.total.toLocaleString(), '전체 기여'],
              [`${summary.active}일`, '활동한 날'],
              [`${summary.longest}일`, '기간 내 최장 연속'],
              [
                year === 'last' || year === String(currentYear)
                  ? `${summary.current}일`
                  : '—',
                '현재 연속 기여',
              ],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="text-2xl font-extrabold tabular-nums text-slate-950">
                  {value}
                </div>
                <p className="mt-1 text-xs font-medium text-slate-600">
                  {label}
                </p>
              </div>
            ))}
          </div>
          <div
            className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-2"
            aria-label="GitHub 기여 캘린더"
          >
            <GithubEChart
              variant="calendar"
              days={query.data.days}
              onSelect={setSelected}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <span>
              {query.data.days[0]?.date} – {query.data.days.at(-1)?.date}
            </span>
            <div className="flex items-center gap-1.5">
              <span>적음</span>
              {CONTRIBUTION_COLORS.map((color, i) => (
                <span
                  key={color}
                  title={`기여 등급 ${i}`}
                  className="h-3.5 w-3.5 rounded-sm border border-black/10"
                  style={{ backgroundColor: color }}
                />
              ))}
              <span>많음</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 mobile:flex-row mobile:items-center mobile:justify-between">
            <div>
              <label
                htmlFor="contribution-date"
                className="mr-3 text-sm font-semibold text-blue-950"
              >
                날짜별 확인
              </label>
              <input
                id="contribution-date"
                type="date"
                min={query.data.days[0]?.date}
                max={query.data.days.at(-1)?.date}
                value={selected}
                onChange={event => setSelected(event.target.value)}
                className="rounded-md border border-blue-300 bg-white px-2 py-1.5 text-sm text-slate-900"
              />
            </div>
            <div aria-live="polite" className="text-sm text-blue-950">
              {activeDay ? (
                <>
                  <strong>{activeDay.count.toLocaleString()}회 기여</strong>
                  <a
                    className="ml-3 inline-flex items-center gap-1 font-semibold underline"
                    href={`https://github.com/${encodeURIComponent(username)}?tab=overview&from=${activeDay.date}&to=${activeDay.date}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub 활동 보기
                    <FiExternalLink />
                  </a>
                </>
              ) : (
                '셀 또는 날짜 입력으로 하루의 기록을 확인하세요.'
              )}
            </div>
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">월별 기여</h4>
              <button
                onClick={() => setShowTable(value => !value)}
                aria-expanded={showTable}
                className="text-xs font-semibold text-blue-700 underline"
              >
                {showTable ? '일별 표 닫기' : '일별 기록을 표로 보기'}
              </button>
            </div>
            <div
              className="flex h-24 items-end gap-2"
              aria-label="월별 기여 합계"
            >
              {summary.months.map(month => (
                <div
                  key={month.month}
                  className="flex min-w-0 flex-1 flex-col items-center gap-1"
                  title={`${month.month}: ${month.count}회`}
                >
                  <span className="text-[10px] font-semibold text-slate-700">
                    {month.count}
                  </span>
                  <div
                    className="w-full max-w-12 rounded-t bg-blue-700"
                    style={{
                      height: `${Math.max(2, (month.count / maxMonth) * 52)}px`,
                    }}
                  />
                  <span className="text-[10px] text-slate-600">
                    {Number(month.month.slice(5))}월
                  </span>
                </div>
              ))}
            </div>
          </div>
          {showTable ? (
            <div className="max-h-64 overflow-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">일별 GitHub 기여 횟수</caption>
                <thead className="sticky top-0 bg-slate-100">
                  <tr>
                    <th className="p-3">날짜</th>
                    <th className="p-3">기여</th>
                  </tr>
                </thead>
                <tbody>
                  {[...query.data.days].reverse().map(day => (
                    <tr key={day.date} className="border-t border-slate-100">
                      <td className="px-3 py-2">
                        <button
                          onClick={() => setSelected(day.date)}
                          className="text-blue-700 underline"
                        >
                          {day.date}
                        </button>
                      </td>
                      <td className="px-3 py-2">{day.count}회</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {refreshError ? (
            <p role="alert" className="text-sm text-amber-800">
              새로고침에 실패해 이전 기록을 표시하고 있습니다.
            </p>
          ) : null}
          <p className="text-xs leading-5 text-slate-600">
            GitHub 프로필에 공개된 기여 기준입니다. 복구한 커밋은 잔디에
            반영되기까지 최대 24시간이 걸릴 수 있습니다.
          </p>
        </div>
      ) : null}
    </section>
  );
}
