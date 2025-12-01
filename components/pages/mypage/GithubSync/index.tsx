import { useState, useCallback } from 'react';
import { FiGithub } from 'react-icons/fi';
import DisconnectedState from './DisconnectedState';
import ConnectedState from './ConnectedState';
import ErrorState from './ErrorState';

type ConnectionStatus = 'disconnected' | 'connected' | 'error';

interface GithubSyncSettingsProps {
  initialEnabled?: boolean;
  initialRepoName?: string;
  initialRepoId?: number | null;
  syncedPostCount?: number;
}

const GithubSyncSettings = ({
  initialEnabled = false,
  initialRepoName = '',
  initialRepoId = null,
  syncedPostCount = 0,
}: GithubSyncSettingsProps) => {
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const [repoName, setRepoName] = useState(initialRepoName);
  const [repoId, setRepoId] = useState<number | null>(initialRepoId);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    initialRepoId ? 'connected' : 'disconnected'
  );
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 토글 핸들러
  const handleToggle = useCallback(() => {
    if (isEnabled) {
      const confirmed = window.confirm(
        'GitHub 동기화를 비활성화하시겠습니까?\n기존에 동기화된 파일은 GitHub에 그대로 유지됩니다.'
      );
      if (confirmed) {
        setIsEnabled(false);
        setConnectionStatus('disconnected');
        // TODO: 백엔드 API 호출
      }
    } else {
      setIsEnabled(true);
    }
  }, [isEnabled]);

  // 저장소 생성
  const handleCreateRepo = useCallback(async () => {
    if (!repoName.trim()) {
      setError('저장소 이름을 입력해주세요.');
      return;
    }

    const repoNameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!repoNameRegex.test(repoName)) {
      setError(
        '저장소 이름은 영문, 숫자, 점(.), 하이픈(-), 언더스코어(_)만 사용 가능합니다.'
      );
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // TODO: 백엔드 API 호출
      await new Promise(resolve => setTimeout(resolve, 1500));
      setRepoId(123456789);
      setConnectionStatus('connected');
    } catch {
      setError('저장소 생성에 실패했습니다. 다시 시도해주세요.');
      setConnectionStatus('error');
    } finally {
      setIsCreating(false);
    }
  }, [repoName]);

  // 연결 해제
  const handleDisconnect = useCallback(() => {
    const confirmed = window.confirm(
      '저장소 연결을 해제하시겠습니까?\nGitHub의 저장소와 파일은 삭제되지 않습니다.'
    );
    if (confirmed) {
      setRepoId(null);
      setRepoName('');
      setConnectionStatus('disconnected');
      // TODO: 백엔드 API 호출
    }
  }, []);

  // 권한 재인증
  const handleReauthorize = useCallback(() => {
    // TODO: GitHub OAuth 재인증
    alert('GitHub 권한 재인증이 필요합니다.\n(백엔드 연동 후 구현 예정)');
  }, []);

  return (
    <section className="p-8 bg-white rounded-xl border border-blue-100 shadow-sm">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2 items-center">
          <FiGithub className="w-5 h-5 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">GitHub 동기화</h2>
        </div>

        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isEnabled ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          aria-label="GitHub 동기화 토글"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* 상태별 UI */}
      {isEnabled ? (
        <div className="space-y-4">
          {connectionStatus === 'disconnected' && (
            <DisconnectedState
              repoName={repoName}
              setRepoName={setRepoName}
              error={error}
              clearError={() => setError(null)}
              isCreating={isCreating}
              onCreateRepo={handleCreateRepo}
            />
          )}

          {connectionStatus === 'connected' && (
            <ConnectedState
              repoName={repoName}
              syncedPostCount={syncedPostCount}
              onDisconnect={handleDisconnect}
            />
          )}

          {connectionStatus === 'error' && (
            <ErrorState
              onReauthorize={handleReauthorize}
              onDisconnect={handleDisconnect}
            />
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          활성화하면 게시글이 GitHub 저장소에 자동으로 백업됩니다.
        </p>
      )}
    </section>
  );
};

export default GithubSyncSettings;
