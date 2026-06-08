/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';

interface ContributionChartProps {
  githubId: string;
}

const cardBase =
  'relative overflow-hidden rounded-2xl border border-slate-100 bg-white/85 shadow-lg backdrop-blur transition-transform duration-200 hover:-translate-y-0.5';

const primarySrc = (githubId: string) =>
  `https://ghchart.rshah.org/2657A6/${githubId}`;

const fallbackSrc = (githubId: string) =>
  `https://github-readme-activity-graph.vercel.app/graph?username=${githubId}&theme=github-compact&hide_border=true&bg_color=ffffff00&color=0f172a&line=2563eb&point=2563eb`;

const ContributionChart = ({ githubId }: ContributionChartProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [source, setSource] = useState<'primary' | 'fallback'>('primary');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
    setSource('primary');
  }, [githubId]);

  const src =
    source === 'primary' ? primarySrc(githubId) : fallbackSrc(githubId);

  return (
    <section className={cardBase}>
      <div className="absolute inset-0 bg-gradient-to-br via-white to-blue-50 from-slate-50" />
      <div className="relative p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Activity
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              연간 기여 그래프
            </h2>
            <p className="text-sm text-slate-600">
              1년 동안의 GitHub 활동을 한눈에 확인할 수 있습니다.
            </p>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            graph
          </span>
        </div>

        <div
          className={`relative rounded-xl border border-slate-100 bg-slate-50/60 ${
            !isLoaded || isError ? 'min-h-[180px]' : ''
          }`}
        >
          {!isLoaded && !isError && (
            <div className="absolute inset-0 bg-gradient-to-r via-white rounded-xl animate-pulse from-slate-100 to-slate-100" />
          )}

          {!isError ? (
            <img
              src={src}
              alt={`${githubId}의 GitHub 연간 기여 그래프`}
              className="relative z-10 w-full rounded-xl"
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                if (source === 'primary') {
                  setSource('fallback');
                  setIsLoaded(false);
                } else {
                  setIsError(true);
                  setIsLoaded(false);
                }
              }}
            />
          ) : (
            <div className="p-6 text-center text-slate-600 min-h-[180px] flex flex-col items-center justify-center">
              <p className="text-sm font-medium">
                기여 그래프를 불러오지 못했습니다.
              </p>
              <p className="mt-2 text-xs">
                GitHub ID를 확인하거나 잠시 후 다시 시도해주세요.
              </p>
              <a
                href={`https://github.com/${githubId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex mt-4 text-sm text-blue-600 underline hover:text-blue-700"
              >
                내 GitHub 프로필 바로가기
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContributionChart;
