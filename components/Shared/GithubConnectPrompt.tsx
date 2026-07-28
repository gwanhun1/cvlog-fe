import { FaGithub } from 'react-icons/fa';
import { useToast } from 'components/Shared';
import { buildLinkUrl, GITHUB_SYNC_SCOPE } from 'utils/oauth';

interface GithubConnectPromptProps {
  title?: string;
  description?: string;
  /** 저장소 동기화까지 쓸 거면 repo 권한을 요청한다 */
  withRepoScope?: boolean;
  compact?: boolean;
}

/**
 * GitHub 미연동 유저에게 보여주는 안내.
 *
 * 여기서 시작하는 것은 "로그인"이 아니라 "연동"이다.
 * 현재 세션을 유지한 채 /github/callback → /users/link/github 로 이어진다.
 */
const GithubConnectPrompt = ({
  title = 'GitHub이 연동되지 않았습니다',
  description = 'GitHub을 연동하면 기여 통계와 저장소 자동 동기화를 사용할 수 있어요.',
  withRepoScope = false,
  compact = false,
}: GithubConnectPromptProps) => {
  const { showToast } = useToast();

  const handleConnect = () => {
    const url = buildLinkUrl(
      'github',
      withRepoScope ? GITHUB_SYNC_SCOPE : undefined
    );

    if (!url) {
      showToast(
        'GitHub 연동 설정이 없습니다. 관리자에게 문의해주세요.',
        'error'
      );
      return;
    }

    window.location.href = url;
  };

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        compact ? 'py-6 gap-2' : 'min-h-[60vh] gap-3'
      }`}
    >
      <FaGithub
        className={`text-gray-300 ${compact ? 'w-8 h-8' : 'w-12 h-12'}`}
      />
      <p
        className={`font-semibold text-gray-700 ${
          compact ? 'text-sm' : 'text-xl'
        }`}
      >
        {title}
      </p>
      <p className={`text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>
        {description}
      </p>
      <button
        onClick={handleConnect}
        className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#24292e] rounded-xl hover:bg-[#1a1e22] transition-colors"
      >
        <FaGithub className="w-4 h-4" />
        GitHub 연동하기
      </button>
    </div>
  );
};

export default GithubConnectPrompt;
