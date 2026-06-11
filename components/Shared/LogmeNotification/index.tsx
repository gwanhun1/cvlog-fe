import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { HiBell, HiOutlineBell } from 'react-icons/hi2';
import {
  useGetNotifications,
  useGetUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
} from 'service/hooks/Notification';
import { useToast } from 'components/Shared';
import { cn } from 'styles/utils';

const BellIcon = ({ filled }: { filled: boolean }) =>
  filled ? (
    <HiBell className="w-[18px] h-[18px]" />
  ) : (
    <HiOutlineBell className="w-[18px] h-[18px]" strokeWidth={1.8} />
  );

const CommentIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
      clipRule="evenodd"
    />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
      clipRule="evenodd"
    />
  </svg>
);

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return '방금 전';
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
};

const LogmeNotification = () => {
  const [open, setOpen] = useState(false);
  const [ringing, setRinging] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { showToast } = useToast();

  const { data: unreadCount = 0 } = useGetUnreadCount(open);
  const { data: notifications = [], isLoading } = useGetNotifications(open);
  const { mutate: markRead } = useMarkAsRead();
  const { mutate: markAll } = useMarkAllAsRead();

  // 새 알림 생기면 벨 흔들기
  const prevCountRef = useRef(unreadCount);
  useEffect(() => {
    if (unreadCount > prevCountRef.current) {
      setRinging(true);
      prevCountRef.current = unreadCount;
      const t = setTimeout(() => setRinging(false), 700);
      return () => clearTimeout(t);
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (id: number, postId: number | null) => {
    markRead(id, {
      onError: () => showToast('알림을 읽음 처리하지 못했습니다.', 'error'),
    });
    setOpen(false);
    if (postId) router.push(`/article/content/${postId}`);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'relative flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300',
          ringing && 'bell-ring',
          open
            ? 'text-ftBlue bg-ftBlue/10 border-ftBlue/30'
            : 'text-gray-400 border-slate-200 hover:text-ftBlue hover:border-ftBlue/40 hover:bg-ftBlue/5',
        )}
        aria-label="알림"
      >
        <BellIcon filled={unreadCount > 0} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-in absolute right-0 top-11 z-50 w-[340px] max-w-[calc(100vw-1rem)] rounded-2xl border border-slate-100 bg-white shadow-xl overflow-hidden">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-ftBlack">알림</span>
              {unreadCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-ftBlue rounded-full leading-none">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() =>
                  markAll(undefined, {
                    onError: () => showToast('전체 읽음 처리에 실패했습니다.', 'error'),
                  })
                }
                className="text-xs text-gray-400 hover:text-ftBlue transition-colors"
              >
                전체 읽음
              </button>
            )}
          </div>

          {/* 목록 */}
          <ul className="max-h-[360px] overflow-y-auto divide-y divide-slate-50">
            {isLoading ? (
              <li className="flex justify-center py-8">
                <span className="text-xs text-gray-400">불러오는 중...</span>
              </li>
            ) : notifications.length === 0 ? (
              <li className="flex flex-col items-center gap-2.5 py-10">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-gray-300">
                  <BellIcon filled={false} />
                </div>
                <span className="text-xs text-gray-400">아직 알림이 없어요</span>
              </li>
            ) : (
              notifications.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => handleNotificationClick(n.id, n.post?.id ?? null)}
                    className={cn(
                      'w-full text-left px-4 py-3 hover:bg-slate-50/80 transition-colors flex items-start gap-3',
                      !n.is_read && 'bg-ftBlue/[0.03]',
                    )}
                  >
                    {/* 타입 아이콘 버블 */}
                    <div
                      className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5',
                        n.type === 'comment'
                          ? 'bg-blue-50 text-ftBlue'
                          : 'bg-red-50 text-red-400',
                      )}
                    >
                      {n.type === 'comment' ? <CommentIcon /> : <HeartIcon />}
                    </div>

                    {/* 텍스트 */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-ftBlack leading-snug line-clamp-2 mb-1">
                        {n.message}
                      </p>
                      <p className="text-[11px] text-gray-400">{timeAgo(n.created_at)}</p>
                    </div>

                    {/* 안읽음 dot */}
                    {!n.is_read && (
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-ftBlue mt-1.5" />
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LogmeNotification;
