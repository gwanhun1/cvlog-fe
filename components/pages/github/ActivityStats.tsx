/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';

interface ActivityStatsProps {
  githubId: string;
}

const cardBase =
  'relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 min-h-[320px]';

// ── Streak Card ────────────────────────────────────────────────────────────

const StatImage = ({
  src, alt, dark = false,
}: { src: string; alt: string; dark?: boolean }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => { setLoading(true); setError(false); }, [src]);

  return (
    <div className={`relative rounded-xl border ${dark ? 'border-slate-800 bg-slate-900' : 'bg-gray-50 border-gray-100'} min-h-[200px] flex items-center justify-center overflow-hidden`}>
      {loading && !error && (
        <div className={`absolute inset-0 animate-pulse ${dark ? 'bg-slate-800' : 'bg-gray-100'}`} />
      )}
      {!error ? (
        <img
          src={src} alt={alt}
          className="object-contain relative z-10 w-full h-full"
          onLoad={() => setLoading(false)}
          onError={() => { setError(true); setLoading(false); }}
        />
      ) : (
        <div className={`relative z-10 p-4 text-center text-sm ${dark ? 'text-slate-200' : 'text-slate-500'}`}>
          이미지를 불러오지 못했습니다.
        </div>
      )}
    </div>
  );
};

export const StreakStats = ({ githubId }: ActivityStatsProps) => {
  if (!githubId) return null;
  return (
    <div className={`${cardBase} h-full flex flex-col`}>
      <div className="p-4 space-y-3 flex flex-col flex-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-slate-400 mb-0.5">Streak</div>
            <div className="text-lg font-semibold text-slate-900">연속 기여 현황</div>
            <div className="text-sm text-slate-500 mt-0.5">연속 기여일수와 최장 기록입니다.</div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">live</span>
        </div>
        <StatImage
          src={`https://github-readme-streak-stats.herokuapp.com/?user=${githubId}&theme=transparent&hide_border=true&ring=2563eb&fire=2563eb&currStreakNum=0ea5e9`}
          alt={`${githubId} 연속 기여`}
        />
      </div>
    </div>
  );
};

// ── Activity Timeline ─────────────────────────────────────────────────────

interface EventPayload {
  commits?: { sha: string; message: string }[];
  pull_request?: { title: string; number: number; html_url: string };
  issue?: { title: string; number: number; html_url: string };
  ref?: string;
  ref_type?: string;
  action?: string;
}

interface EventItem {
  id: string;
  type: string;
  repo: { name: string; url: string };
  payload: EventPayload;
  created_at: string;
}

const EVENT_CONFIG: Record<string, { label: string; color: string; dot: string; icon: React.ReactNode }> = {
  PushEvent: {
    label: '커밋 푸시',
    color: 'text-green-400',
    dot: 'bg-green-400',
    icon: (
      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 1a1.993 1.993 0 0 0-1 3.72V6H6.5a3.5 3.5 0 1 0 0 7H7v1.28A1.993 1.993 0 1 0 9 13V13h-.5a1.5 1.5 0 0 1 0-3H8v1.28A1.993 1.993 0 0 0 8 1z"/>
      </svg>
    ),
  },
  PullRequestEvent: {
    label: 'PR',
    color: 'text-purple-400',
    dot: 'bg-purple-400',
    icon: (
      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16">
        <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354z"/>
      </svg>
    ),
  },
  IssuesEvent: {
    label: '이슈',
    color: 'text-yellow-400',
    dot: 'bg-yellow-400',
    icon: (
      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0z"/>
      </svg>
    ),
  },
  CreateEvent: {
    label: '생성',
    color: 'text-blue-400',
    dot: 'bg-blue-400',
    icon: (
      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  WatchEvent: {
    label: 'Star',
    color: 'text-yellow-300',
    dot: 'bg-yellow-300',
    icon: (
      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/>
      </svg>
    ),
  },
  ForkEvent: {
    label: 'Fork',
    color: 'text-slate-300',
    dot: 'bg-slate-400',
    icon: (
      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16">
        <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0zM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0z"/>
      </svg>
    ),
  },
};

const getEventDetail = (event: EventItem): { detail: string; href?: string } => {
  const p = event.payload;
  switch (event.type) {
    case 'PushEvent':
      return { detail: p.commits?.[0]?.message?.split('\n')[0] ?? '' };
    case 'PullRequestEvent':
      return {
        detail: p.pull_request?.title ?? '',
        href: p.pull_request?.html_url,
      };
    case 'IssuesEvent':
      return {
        detail: `#${p.issue?.number} ${p.issue?.title ?? ''}`,
        href: p.issue?.html_url,
      };
    case 'CreateEvent':
      return { detail: `${p.ref_type ?? ''} ${p.ref ? `"${p.ref}"` : ''}`.trim() };
    default:
      return { detail: '' };
  }
};

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
};

const ActivityTimeline = ({ githubId }: { githubId: string }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `https://api.github.com/users/${encodeURIComponent(githubId)}/events/public?per_page=15`,
          { headers: { Accept: 'application/vnd.github+json' } },
        );
        if (!res.ok) throw new Error('failed');
        const data: EventItem[] = await res.json();
        if (!cancelled) setEvents(data.slice(0, 12));
      } catch {
        if (!cancelled) setError('최근 활동을 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchEvents();
    return () => { cancelled = true; };
  }, [githubId]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
      {loading && (
        <div className="relative min-h-[200px] animate-pulse bg-slate-800" />
      )}
      {!loading && error && (
        <div className="min-h-[160px] flex items-center justify-center px-4 text-sm text-slate-400">
          {error}
        </div>
      )}
      {!loading && !error && events.length === 0 && (
        <div className="min-h-[160px] flex items-center justify-center text-sm text-slate-400">
          최근 공개 활동이 없습니다.
        </div>
      )}
      {!loading && !error && events.length > 0 && (
        <div className="divide-y divide-slate-800">
          {events.map((ev, idx) => {
            const cfg = EVENT_CONFIG[ev.type] ?? {
              label: ev.type.replace('Event', ''),
              color: 'text-slate-400',
              dot: 'bg-slate-500',
              icon: null,
            };
            const { detail, href } = getEventDetail(ev);
            const repoName = ev.repo.name.split('/')[1] ?? ev.repo.name;
            const repoUrl = `https://github.com/${ev.repo.name}`;

            return (
              <div key={ev.id} className="flex gap-3 px-4 py-3 group hover:bg-slate-800/50 transition-colors">
                {/* 타임라인 dot */}
                <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${cfg.color} bg-slate-800 border border-slate-700`}>
                    {cfg.icon}
                  </div>
                  {idx < events.length - 1 && (
                    <div className="w-px flex-1 mt-1 bg-slate-800 min-h-[8px]" />
                  )}
                </div>

                {/* 내용 */}
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                    {ev.payload.action && (
                      <span className="text-[10px] text-slate-500">{ev.payload.action}</span>
                    )}
                    <a
                      href={repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors truncate max-w-[120px]"
                      onClick={e => e.stopPropagation()}
                    >
                      {repoName}
                    </a>
                    <span className="text-[10px] text-slate-600 ml-auto flex-shrink-0">
                      {timeAgo(ev.created_at)}
                    </span>
                  </div>
                  {detail && (
                    href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-0.5 block text-xs text-slate-300 hover:text-white truncate transition-colors"
                      >
                        {detail}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-xs text-slate-400 truncate">{detail}</p>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
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
            <div className="text-sm text-slate-300 mt-0.5">커밋, PR, 이슈 등 최근 공개 활동입니다.</div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-slate-200 border border-white/20 flex-shrink-0">
            live
          </span>
        </div>
        <ActivityTimeline githubId={githubId} />
      </div>
    </div>
  );
};
