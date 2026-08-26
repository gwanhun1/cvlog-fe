const DEFAULT_API_BASE_URL = 'http://localhost:8000';

const trimTrailingSlash = (url: string) => url.replace(/\/$/, '');

/**
 * 서버 렌더링에서는 백엔드에 직접 연결한다.
 * 상대 경로(/api)는 서버에서 자기 자신을 다시 호출할 수 있으므로 사용하지 않는다.
 */
export const getServerApiBaseUrl = () =>
  trimTrailingSlash(
    process.env.API_SERVER_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      DEFAULT_API_BASE_URL,
  );

/**
 * HTTPS 브라우저에서는 Vercel의 동일 출처 프록시를 사용해 mixed content를 피한다.
 * 로컬 HTTP 개발 환경에서는 기존 백엔드 주소를 그대로 사용한다.
 */
export const getApiBaseUrl = () => {
  if (
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:'
  ) {
    return '/api';
  }

  return getServerApiBaseUrl();
};
