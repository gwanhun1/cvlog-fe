import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';
import { useEffect, useState } from 'react';
import { useToast } from 'components/Shared';
import { FcGoogle } from 'react-icons/fc';
import { SiNaver } from 'react-icons/si';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FaGithub } from 'react-icons/fa';
import { trackEvent } from 'utils/analytics';
import { buildLoginUrl, isProviderConfigured } from 'utils/oauth';
import type { AuthProvider } from 'service/api/login/type';

interface LoginMethod {
  provider: AuthProvider;
  label: string;
  icon: JSX.Element;
  className: string;
}

const LOGIN_METHODS: LoginMethod[] = [
  {
    provider: 'github',
    label: 'GitHub으로 로그인',
    icon: <FaGithub className="w-5 h-5 text-white flex-shrink-0" />,
    className: 'bg-[#24292e] hover:bg-[#1a1e22] text-white',
  },
  {
    provider: 'google',
    label: 'Google로 로그인',
    icon: <FcGoogle className="w-5 h-5 flex-shrink-0" />,
    className:
      'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200',
  },
  {
    provider: 'kakao',
    label: '카카오로 로그인',
    icon: <RiKakaoTalkFill className="w-5 h-5 text-[#191919] flex-shrink-0" />,
    className: 'bg-[#FEE500] hover:bg-[#f2da00] text-[#191919]',
  },
  {
    provider: 'naver',
    label: '네이버로 로그인',
    icon: <SiNaver className="w-4 h-4 text-white flex-shrink-0" />,
    className: 'bg-[#03C75A] hover:bg-[#02b350] text-white',
  },
];

const Spinner = () => (
  <svg
    className="w-5 h-5 animate-spin flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

const LoginButtonGroup = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<AuthProvider | null>(
    null
  );
  const token = LocalStorage.getItem('LogmeToken');
  const { showToast, showConfirm } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const provider = urlParams.get('provider') || 'github';

    const errorMessages: Record<string, string> = {
      auth_failed: '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.',
      gateway_timeout:
        '서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.',
      service_unavailable:
        '서비스가 일시적으로 이용 불가능합니다. 잠시 후 다시 시도해주세요.',
      timeout:
        '요청 시간이 초과되었습니다. 네트워크 연결을 확인하고 다시 시도해주세요.',
      connection_refused:
        '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
      dns_error: 'DNS 오류가 발생했습니다. 네트워크 연결을 확인해주세요.',
      api_not_found: 'API 서버를 찾을 수 없습니다. 관리자에게 문의해주세요.',
      unauthorized: '인증에 실패했습니다. 다시 시도해주세요.',
      user_info_failed:
        '사용자 정보를 불러오지 못했습니다. 다시 로그인해주세요.',
      missing_code: '인증 정보가 누락되었습니다. 다시 시도해주세요.',
      invalid_state: '잘못된 로그인 요청입니다. 다시 시도해주세요.',
    };

    if (error && errorMessages[error]) {
      // GA4 퍼널: login_start → login_failed | sign_up/login.
      // reason은 GSSP/join에서 내려주는 고정된 에러 코드라 카디널리티 안전.
      trackEvent('login_failed', { method: provider, reason: error });
      showToast(errorMessages[error], 'error');
      console.error('OAuth 인증 실패:', error);

      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      url.searchParams.delete('provider');
      window.history.replaceState({}, '', url.toString());
    }
  }, [showToast]);

  useEffect(() => {
    setMounted(true);
    token && setAccessToken(token);
  }, [token]);

  if (!mounted) return null;

  const proceedLogin = (provider: AuthProvider) => {
    const url = buildLoginUrl(provider);

    if (!url) {
      console.error('OAuth 설정이 누락되었습니다:', provider);
      showToast(
        `${provider} 로그인 설정이 잘못되었습니다. 관리자에게 문의하세요.`,
        'error'
      );
      return;
    }

    setLoadingProvider(provider);

    // GA4 퍼널 시작점: 실제 OAuth 리다이렉트가 확정된 직후에만 발화.
    // (설정 누락/미지원 provider에서 발화하면 퍼널 분모가 부풀려짐)
    trackEvent('login_start', { method: provider });

    window.location.href = url;
  };

  const handleLogin = (provider: AuthProvider, event: React.MouseEvent) => {
    if (loadingProvider) return;

    if (accessToken) {
      showConfirm('기존 로그인 기록이 있습니다. 다시 로그인하시겠습니까?', () => {
        LocalStorage.removeItem('LogmeToken');
        Cookie.removeItem('refreshToken');
        proceedLogin(provider);
      });
      event.preventDefault();
      return;
    }

    proceedLogin(provider);
  };

  // 환경변수가 설정된 provider만 노출한다.
  // 승인 심사 대기 중인 provider를 미리 배포해도 버튼이 뜨지 않는다.
  const available = LOGIN_METHODS.filter(m => isProviderConfigured(m.provider));

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {available.map(method => {
        const isLoading = loadingProvider === method.provider;

        return (
          <button
            key={method.provider}
            type="button"
            onClick={event => handleLogin(method.provider, event)}
            disabled={!!loadingProvider}
            className={`w-full flex items-center justify-center gap-2.5 h-11 px-4 rounded-xl shadow-sm transition-all duration-200 font-semibold text-sm hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 ${method.className}`}
          >
            {isLoading ? <Spinner /> : method.icon}
            <span>{isLoading ? '연결 중...' : method.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LoginButtonGroup;
