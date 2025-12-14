/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';

interface ActivityStatsProps {
  githubId: string;
}

const cardBase =
  'relative overflow-hidden rounded-2xl border border-slate-100 bg-white/85 shadow-lg backdrop-blur transition-transform duration-200 hover:-translate-y-0.5';

const ActivityCard = ({
  title,
  subtitle,
  badge,
  imgSrc,
  alt,
  dark = false,
}: {
  title: string;
  subtitle: string;
  badge: string;
  imgSrc: string;
  alt: string;
  dark?: boolean;
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [imgSrc]);

  return (
    <div className={cardBase}>
      <div
        className={`absolute inset-0 ${
          dark
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
            : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
        }`}
      />
      <div className="relative p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {badge}
            </p>
            <h2
              className={`text-xl font-semibold ${
                dark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {title}
            </h2>
            <p
              className={`text-sm ${
                dark ? 'text-slate-200' : 'text-slate-600'
              }`}
            >
              {subtitle}
            </p>
          </div>
          <span
            className={`text-[10px] px-2 py-1 rounded-full border ${
              dark
                ? 'bg-white/10 text-slate-100 border-white/20'
                : 'bg-blue-50 text-blue-700 border-blue-100'
            }`}
          >
            live
          </span>
        </div>

        <div
          className={`relative rounded-xl border ${
            dark ? 'border-white/10 bg-slate-900' : 'border-slate-200 bg-white'
          }`}
        >
          {loading && !error && (
            <div
              className={`absolute inset-0 animate-pulse ${
                dark
                  ? 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800'
                  : 'bg-gradient-to-r from-slate-100 via-white to-slate-100'
              } rounded-xl`}
            />
          )}
          {!error ? (
            <img
              src={imgSrc}
              alt={alt}
              className="relative z-10 w-full rounded-xl"
              onLoad={() => setLoading(false)}
              onError={() => {
                setError(true);
                setLoading(false);
              }}
            />
          ) : (
            <div
              className={`relative z-10 p-6 text-center ${
                dark ? 'text-slate-200' : 'text-slate-600'
              }`}
            >
              <p className="text-sm font-medium">
                이미지를 불러오지 못했습니다.
              </p>
              <p className="text-xs mt-2">
                잠시 후 다시 시도하거나 GitHub ID를 확인해주세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface EventItem {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
}

const ActivityList = ({ githubId }: { githubId: string }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.github.com/users/${githubId}/events/public?per_page=5`,
          {
            headers: { Accept: 'application/vnd.github+json' },
          }
        );
        if (!res.ok) throw new Error('failed');
        const data: EventItem[] = await res.json();
        if (!cancelled) setEvents(data.slice(0, 5));
      } catch {
        if (!cancelled) setError('최근 활동을 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchEvents();
    return () => {
      cancelled = true;
    };
  }, [githubId]);

  if (loading) {
    return (
      <div className="min-h-[180px] rounded-xl border border-white/10 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[180px] rounded-xl border border-white/10 bg-slate-900 text-slate-200 flex items-center justify-center px-4 text-sm">
        {error}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="min-h-[180px] rounded-xl border border-white/10 bg-slate-900 text-slate-200 flex items-center justify-center px-4 text-sm">
        최근 공개 활동이 없습니다.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900 text-slate-100 divide-y divide-white/10">
      {events.map(ev => (
        <div key={ev.id} className="px-4 py-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-semibold">
              {ev.type.replace('Event', '')}
            </span>
            <span className="text-xs text-slate-300">
              {new Date(ev.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">{ev.repo.name}</p>
        </div>
      ))}
    </div>
  );
};

export const StreakStats = ({ githubId }: ActivityStatsProps) => {
  if (!githubId) return null;
  return (
    <ActivityCard
      title="연속 기여 현황"
      subtitle="현재 연속 기여일수와 최장 연속 기여 기록입니다."
      badge="Streak"
      imgSrc={`https://github-readme-streak-stats.herokuapp.com/?user=${githubId}&theme=transparent&hide_border=true&ring=2563eb&fire=2563eb&currStreakNum=0ea5e9`}
      alt={`${githubId}의 GitHub 연속 기여 현황`}
    />
  );
};

export const TrophyStats = ({ githubId }: ActivityStatsProps) => {
  if (!githubId) return null;
  return (
    <div className={cardBase}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="relative p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Activity
            </p>
            <h2 className="text-xl font-semibold text-white">최근 활동</h2>
            <p className="text-sm text-slate-200">
              최근 공개 활동을 최대 5개까지 보여줍니다.
            </p>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-slate-100 border border-white/20">
            live
          </span>
        </div>
        <ActivityList githubId={githubId} />
      </div>
    </div>
  );
};
