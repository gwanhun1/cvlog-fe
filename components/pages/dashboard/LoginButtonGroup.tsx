import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';
import { useEffect, useState } from 'react';
import { useToast } from 'components/Shared';
import { FcGoogle } from 'react-icons/fc';
import { SiNaver } from 'react-icons/si';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FaGithub } from 'react-icons/fa';
import { trackEvent } from 'utils/analytics';

const LoginButtonGroup = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = LocalStorage.getItem('LogmeToken');
  const { showToast, showConfirm } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');

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
    };

    if (error && errorMessages[error]) {
      // GA4 퍼널: login_start → login_failed | sign_up/login.
      // reason은 GSSP/join에서 내려주는 고정된 에러 코드라 카디널리티 안전.
      trackEvent('login_failed', { method: 'github', reason: error });
      showToast(errorMessages[error], 'error');
      console.error('GitHub OAuth 인증 실패:', error);

      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url.toString());
    }
  }, [showToast]);

  useEffect(() => {
    setMounted(true);
    token && setAccessToken(token);
  }, [token]);

  if (!mounted) return null;

  const handleLogin = (loginMethod: string, event: React.MouseEvent) => {
    if (accessToken) {
      showConfirm(
        '기존 로그인 기록이 있습니다. 다시 로그인하시겠습니까?',
        () => {
          LocalStorage.removeItem('LogmeToken');
          Cookie.removeItem('refreshToken');
          proceedLogin(loginMethod);
        }
      );
      event.preventDefault();
      return;
    }
    proceedLogin(loginMethod);
  };

  const proceedLogin = (loginMethod: string) => {
    if (loginMethod === 'Github') {
      const githubId = process.env.NEXT_PUBLIC_GITHUB_ID;
      // 로그인한 도메인 그대로 돌아오도록 현재 origin 사용 (고정 env 대신).
      // OAuth 콜백 경로가 /join 이므로 반드시 /join 을 붙인다.
      // logme.cloud에서 로그인하면 https://logme.cloud/join 으로 복귀.
      const redirectUri = `${window.location.origin}/join`;

      if (!githubId) {
        console.error('GitHub OAuth 설정이 누락되었습니다:', {
          githubId,
          redirectUri,
        });
        showToast(
          'GitHub 로그인 설정이 잘못되었습니다. 관리자에게 문의하세요.',
          'error'
        );
        return;
      }

      setLoading(true);

      const state = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('github_oauth_state', state);

      // GA4 퍼널 시작점: 실제 OAuth 리다이렉트가 확정된 직후에만 발화.
      // (설정 누락/미지원 provider에서 발화하면 퍼널 분모가 부풀려짐)
      trackEvent('login_start', { method: 'github' });

      window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubId}&redirect_uri=${redirectUri}&state=${state}&scope=repo delete_repo`;
    } else {
      showToast('준비 중입니다.', 'info');
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div
        key={loginMethodArr[0].id}
        onClick={event => !loading && handleLogin(loginMethodArr[0].method, event)}
        className={`w-full ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="bg-[#24292e] flex items-center justify-center gap-2.5 h-11 px-4 rounded-xl shadow-sm hover:bg-[#1a1e22] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
          {loading ? (
            <svg className="w-5 h-5 text-white animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <FaGithub className="w-5 h-5 text-white flex-shrink-0" />
          )}
          <span className="font-semibold text-sm text-white">
            {loading ? '연결 중...' : 'GitHub으로 로그인'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginButtonGroup;

const loginMethodArr = [
  {
    id: 1,
    name: 'Github',
    method: 'Github',
    image: <FaGithub className="w-6 h-6 text-white" />,
  },
  {
    id: 2,
    name: 'Google',
    method: 'Google',
    image: <FcGoogle className="w-6 h-6" />,
  },
  {
    id: 3,
    name: 'Naver',
    method: '네이버',
    image: <SiNaver className="w-6 h-6" color="#03c75a" />,
  },
  {
    id: 4,
    name: 'Kakao',
    method: '카카오',
    image: (
      <div className="p-1 bg-yellow-400 rounded-2xl">
        <RiKakaoTalkFill className="w-4 h-4" />
      </div>
    ),
  },
];
