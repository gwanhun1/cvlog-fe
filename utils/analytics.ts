import { sendGAEvent } from '@next/third-parties/google';

/**
 * GA4 맞춤 이벤트 전송 헬퍼.
 * - 측정 ID는 pages/_app.tsx의 <GoogleAnalytics />에서 설정됨.
 * - GA_ENABLED가 false면 GoogleAnalytics 자체가 마운트되지 않으므로(_app.tsx)
 *   여기서도 전송을 차단해 sendGAEvent의 "GA has not initialized" 경고를 막는다.
 */

// window.dataLayer 타입은 @next/third-parties가 전역 선언함 (Object[] | undefined)

// 로컬 dev(NODE_ENV)와 Vercel preview 트래픽이 프로덕션 GA 속성에 섞이지 않도록 차단.
// NEXT_PUBLIC_VERCEL_ENV가 미노출된 환경(로컬 프로덕션 빌드 등)에서는 통과시킨다.
export const GA_ENABLED =
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'preview';

/** 오타 방지용 이벤트명 유니온. 새 이벤트는 여기에 먼저 추가한다. */
export type GAEventName =
  | 'sign_up'
  | 'login'
  | 'login_start'
  | 'login_failed'
  | 'post_create'
  | 'post_update'
  | 'post_visibility_change';

export type GAEventParams = Record<
  string,
  string | number | boolean | undefined | null
>;

export function trackEvent(name: GAEventName, params: GAEventParams = {}): void {
  if (typeof window === 'undefined') return;
  if (!GA_ENABLED) return;

  // gtag.js 로드 전 호출돼도 유실되지 않도록 큐를 먼저 만든다.
  // (sendGAEvent는 window.dataLayer가 없으면 warn만 찍고 이벤트를 버림.
  //  gtag.js는 로드 시점에 기존 dataLayer 항목을 재생하므로 선점 큐는 안전하다.)
  window.dataLayer = window.dataLayer || [];

  // null/undefined 값이 GA에 "undefined" 문자열로 남지 않게 제거
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value != null)
  );
  sendGAEvent('event', name, clean);
}

/**
 * @deprecated 백엔드 /auth/login 응답의 isNewUser 플래그를 사용할 것.
 * 구버전 백엔드와의 이행기 폴백으로만 남겨둔다. (클라이언트 시계 스큐에 취약)
 */
export function isNewSignup(createdAt?: string | null): boolean {
  if (!createdAt) return false;
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return false;
  return Date.now() - created < 60_000;
}
