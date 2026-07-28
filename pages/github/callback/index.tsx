import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import LoaderAnimation from 'components/Shared/common/LoaderAnimation';
import { useToast } from 'components/Shared';
import { linkProvider } from 'service/api/link';
import {
  getLinkRedirectUri,
  LINK_STATE_KEY,
  parseProviderFromState,
} from 'utils/oauth';

/**
 * 소셜 계정 "연동" 콜백.
 *
 * 예전에는 여기서 code를 /join으로 넘겼는데, /join은 전체 로그인 교환을 수행해
 * 새 세션을 만든다. 그래서 구글로 가입한 유저가 GitHub 연동을 누르면 GitHub 계정으로
 * 갈아타 버리고, 원래 계정의 글이 사라진 것처럼 보였다.
 *
 * 지금은 기존 accessToken을 유지한 채 /users/link/:provider 만 호출한다.
 */
const OAuthLinkCallbackPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const handledRef = useRef(false);

  useEffect(() => {
    if (!router.isReady || handledRef.current) return;
    handledRef.current = true;

    const { code, state, error } = router.query;

    const finish = (message: string, type: 'success' | 'error') => {
      showToast(message, type);
      router.replace('/mypage');
    };

    if (error || !code || typeof code !== 'string') {
      finish('연동이 취소되었거나 인증 정보가 없습니다.', 'error');
      return;
    }

    const expectedState = sessionStorage.getItem(LINK_STATE_KEY);
    const provider = parseProviderFromState(state);

    sessionStorage.removeItem(LINK_STATE_KEY);

    // CSRF 방지: 우리가 시작한 연동 요청인지 확인한다
    if (!provider || !expectedState || expectedState !== state) {
      finish('잘못된 연동 요청입니다. 다시 시도해주세요.', 'error');
      return;
    }

    linkProvider({
      provider,
      code,
      redirectUri: getLinkRedirectUri(),
      state: typeof state === 'string' ? state : undefined,
    })
      .then(async () => {
        // capabilities가 바뀌므로 유저 정보를 다시 받아온다
        await queryClient.invalidateQueries({ queryKey: ['userInfo'] });
        finish('계정이 연동되었습니다.', 'success');
      })
      .catch((err: any) => {
        const status = err?.response?.status;
        finish(
          status === 409
            ? '이미 다른 계정에 연결된 소셜 계정입니다.'
            : err?.response?.data?.message ?? '연동에 실패했습니다.',
          'error'
        );
      });
  }, [router.isReady, router.query]); // eslint-disable-line react-hooks/exhaustive-deps

  return <LoaderAnimation />;
};

export default OAuthLinkCallbackPage;
