import type { AuthProvider } from 'service/api/login/type';

/**
 * 소셜 로그인/연동 진입 URL 생성.
 *
 * 로그인은 /join으로 돌아와 새 세션을 만들고,
 * 연동(link)은 /github/callback으로 돌아와 "기존 세션에 identity만 추가"한다.
 * 이 둘을 섞으면 구글로 가입한 유저가 GitHub 연동을 누르는 순간 다른 계정으로 갈아탄다.
 */

export const LOGIN_STATE_KEY = 'oauth_login_state';
export const LINK_STATE_KEY = 'oauth_link_state';

interface ProviderConfig {
  name: AuthProvider;
  label: string;
  authorizeUrl: string;
  clientId: () => string | undefined;
  /** 로그인 시 요청할 최소 권한 */
  loginScope: string;
  /** 사용 가능 여부 — client id가 설정된 provider만 버튼을 노출한다 */
  extraParams?: Record<string, string>;
}

export const PROVIDERS: Record<AuthProvider, ProviderConfig> = {
  github: {
    name: 'github',
    label: 'GitHub',
    authorizeUrl: 'https://github.com/login/oauth/authorize',
    clientId: () =>
      process.env.NEXT_PUBLIC_GITHUB_ID ||
      process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
    // 로그인 단계에서는 저장소 권한을 요구하지 않는다.
    // repo/delete_repo는 마이페이지에서 동기화를 켤 때 증분 인증으로 받는다.
    loginScope: 'read:user',
  },
  google: {
    name: 'google',
    label: 'Google',
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: () => process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    loginScope: 'openid email profile',
    extraParams: { response_type: 'code', access_type: 'online' },
  },
  kakao: {
    name: 'kakao',
    label: '카카오',
    authorizeUrl: 'https://kauth.kakao.com/oauth/authorize',
    clientId: () => process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
    loginScope: '',
    extraParams: { response_type: 'code' },
  },
  naver: {
    name: 'naver',
    label: '네이버',
    authorizeUrl: 'https://nid.naver.com/oauth2.0/authorize',
    clientId: () => process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
    loginScope: '',
    extraParams: { response_type: 'code' },
  },
};

/** client id가 설정되지 않은 provider는 버튼 자체를 그리지 않는다 */
export const isProviderConfigured = (provider: AuthProvider): boolean =>
  !!PROVIDERS[provider].clientId();

/**
 * state에 provider를 함께 실어 보낸다.
 *
 * /join의 getServerSideProps는 서버에서 돌아 sessionStorage를 볼 수 없는데,
 * 어느 provider로 로그인했는지 알아야 올바른 백엔드 엔드포인트를 호출할 수 있다.
 * provider들이 state를 그대로 돌려주는 성질을 이용한다.
 * 형식: `<provider>.<random>`
 */
const buildState = (provider: AuthProvider) =>
  `${provider}.${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;

/** state에서 provider를 복원한다. 형식이 아니면 null */
export const parseProviderFromState = (
  state: string | string[] | undefined
): AuthProvider | null => {
  if (typeof state !== 'string') return null;

  const [candidate] = state.split('.');

  return candidate === 'github' ||
    candidate === 'google' ||
    candidate === 'kakao' ||
    candidate === 'naver'
    ? candidate
    : null;
};

const buildUrl = (
  config: ProviderConfig,
  clientId: string,
  redirectUri: string,
  state: string,
  scope: string
) => {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    ...(config.extraParams ?? {}),
  });

  if (scope) params.set('scope', scope);

  return `${config.authorizeUrl}?${params.toString()}`;
};

export const getLoginRedirectUri = () => `${window.location.origin}/join`;
export const getLinkRedirectUri = () =>
  `${window.location.origin}/github/callback`;

/** 로그인 시작 — 성공하면 /join에서 새 세션이 만들어진다 */
export const buildLoginUrl = (provider: AuthProvider): string | null => {
  const config = PROVIDERS[provider];
  const clientId = config.clientId();

  if (!clientId) return null;

  const state = buildState(provider);
  sessionStorage.setItem(LOGIN_STATE_KEY, state);

  return buildUrl(
    config,
    clientId,
    getLoginRedirectUri(),
    state,
    config.loginScope
  );
};

/**
 * 계정 연동 시작 — 성공해도 세션은 그대로고 identity만 추가된다.
 * GitHub은 저장소 동기화를 위해 여기서 repo 권한을 받는다.
 */
export const buildLinkUrl = (
  provider: AuthProvider,
  scope?: string
): string | null => {
  const config = PROVIDERS[provider];
  const clientId = config.clientId();

  if (!clientId) return null;

  const state = buildState(provider);
  sessionStorage.setItem(LINK_STATE_KEY, state);

  return buildUrl(
    config,
    clientId,
    getLinkRedirectUri(),
    state,
    scope ?? config.loginScope
  );
};

/** GitHub 동기화에 필요한 권한 */
export const GITHUB_SYNC_SCOPE = 'repo delete_repo';
