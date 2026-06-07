/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';

interface ActivityStatsProps {
  githubId: string;
}

const cardBase =
  'relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 min-h-[320px]';

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
    <div className={dark ? `${cardBase} !bg-slate-900 border-slate-800` : cardBase}>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <div className={`text-[11px] uppercase tracking-widest mb-0.5 ${dark ? 'text-slate-400' : 'text-slate-400'}`}>{badge}</div>
            <div className={`text-lg font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</div>
            <div className={`text-sm mt-0.5 ${dark ? 'text-slate-300' : 'text-slate-500'}`}>{subtitle}</div>
          </div>
          <span className={`text-[10px] px-2 py-1 rounded-full border flex-shrink-0 ${dark ? 'bg-white/10 text-slate-200 border-white/20' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
            live
          </span>
        </div>

        <div className={`relative rounded-xl border ${dark ? 'border-slate-800 bg-slate-900' : 'bg-gray-50 border-gray-100'} min-h-[220px] flex items-center justify-center overflow-hidden`}>
          {loading && !error && (
            <div className={`absolute inset-0 animate-pulse ${dark ? 'bg-slate-800' : 'bg-gray-100'} rounded-xl`} />
          )}
          {!error ? (
            <img
              src={imgSrc}
              alt={alt}
              className="relative z-10 w-full rounded-xl"
              onLoad={() => setLoading(false)}
              onError={() => { setError(true); setLoading(false); }}
            />
          ) : (
            <div className={`relative z-10 p-6 text-center ${dark ? 'text-slate-300' : 'text-slate-500'}`}>
              <div className="text-sm font-medium">이미지를 불러오지 못했습니다.</div>
              <div className="mt-1 text-xs">잠시 후 다시 시도하거나 GitHub ID를 확인해주세요.</div>
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
          { headers: { Accept: 'application/vnd.github+json' } }
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
    return () => { cancelled = true; };
  }, [githubId]);

  if (loading) {
    return (
      <div className="min-h-[180px] rounded-xl border border-slate-800 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 animate-pulse bg-slate-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[180px] rounded-xl border border-slate-800 bg-slate-900 text-slate-300 flex items-center justify-center px-4 text-sm">
        {error}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="min-h-[180px] rounded-xl border border-slate-800 bg-slate-900 text-slate-300 flex items-center justify-center px-4 text-sm">
        최근 공개 활동이 없습니다.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 divide-y bg-slate-900 text-slate-100 divide-slate-800">
      {events.map(ev => (
        <div key={ev.id} className="px-4 py-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="font-medium text-slate-100">{ev.type.replace('Event', '')}</span>
            <span className="text-xs text-slate-400">{new Date(ev.created_at).toLocaleDateString()}</span>
          </div>
          <div className="mt-0.5 text-xs text-slate-400">{ev.repo.name}</div>
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
    <div className={`${cardBase} !bg-slate-900 border-slate-800`}>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-slate-400 mb-0.5">Activity</div>
            <div className="text-lg font-semibold text-white">최근 활동</div>
            <div className="text-sm text-slate-300 mt-0.5">최근 공개 활동을 최대 5개까지 보여줍니다.</div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-slate-200 border border-white/20 flex-shrink-0">
            live
          </span>
        </div>
        <ActivityList githubId={githubId} />
      </div>
    </div>
  );
};
