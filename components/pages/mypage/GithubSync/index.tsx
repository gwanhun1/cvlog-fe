import { useState, useCallback, useEffect } from 'react';
import { FiGithub } from 'react-icons/fi';
import { useToast } from 'components/Shared';
import DisconnectedState from './DisconnectedState';
import ConnectedState from './ConnectedState';
import ErrorState from './ErrorState';
import {
  useGithubSyncSettings,
  useCreateGithubRepo,
  useDisconnectGithubSync,
} from 'service/hooks/useGithubSync';

type ConnectionStatus = 'disconnected' | 'connected' | 'error' | 'loading';

const GithubSyncSettings = () => {
  const { data: syncSettings, isLoading } = useGithubSyncSettings();
  const createRepoMutation = useCreateGithubRepo();
  const disconnectMutation = useDisconnectGithubSync();
  const { showToast, showConfirm } = useToast();

  const [isEnabled, setIsEnabled] = useState(false);
  const [repoName, setRepoName] = useState('');
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  // 서버 데이터로 상태 초기화
  useEffect(() => {
    if (syncSettings) {
      setIsEnabled(syncSettings.enabled);
      setRepoName(syncSettings.repoName || '');
      setConnectionStatus(syncSettings.repoId ? 'connected' : 'disconnected');
    } else if (!isLoading) {
      setConnectionStatus('disconnected');
    }
  }, [syncSettings, isLoading]);

  // 토글 핸들러
  const handleToggle = useCallback(() => {
    if (isEnabled) {
      showConfirm(
        'GitHub 동기화를 비활성화하시겠습니까? GitHub의 저장소와 파일도 함께 삭제됩니다.',
        () => {
          disconnectMutation.mutate(undefined, {
            onSuccess: () => {
              setIsEnabled(false);
              setConnectionStatus('disconnected');
              setRepoName('');
            },
          });
        }
      );
    } else {
      setIsEnabled(true);
    }
  }, [isEnabled, disconnectMutation, showConfirm]);

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

    setError(null);

    createRepoMutation.mutate(repoName, {
      onSuccess: () => {
        setConnectionStatus('connected');
      },
      onError: (err: any) => {
        const apiMessage =
          err?.response?.data?.message ?? '저장소 생성에 실패했습니다.';
        setError(apiMessage);
        setConnectionStatus('error');
        showToast(apiMessage, 'error');
      },
    });
  }, [repoName, createRepoMutation, showToast]);

  // 연결 해제
  const handleDisconnect = useCallback(() => {
    showConfirm(
      '저장소 연결을 해제하시겠습니까? GitHub의 저장소와 파일도 함께 삭제됩니다.',
      () => {
        disconnectMutation.mutate(undefined, {
          onSuccess: () => {
            setRepoName('');
            setConnectionStatus('disconnected');
          },
        });
      }
    );
  }, [disconnectMutation, showConfirm]);

  // 권한 재인증
  const handleReauthorize = useCallback(() => {
    // GitHub OAuth 재인증 페이지로 이동
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/github/callback`;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo delete_repo`;
  }, []);

  // 로딩 중
  if (isLoading || connectionStatus === 'loading') {
    return (
      <section className="p-8 bg-white rounded-xl border border-blue-100 shadow-sm">
        <div className="flex gap-2 items-center mb-6">
          <FiGithub className="w-5 h-5 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">GitHub 동기화</h2>
        </div>
        <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
      </section>
    );
  }

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
              isCreating={createRepoMutation.isLoading}
              onCreateRepo={handleCreateRepo}
            />
          )}

          {connectionStatus === 'connected' && (
            <ConnectedState
              repoName={repoName}
              syncedPostCount={syncSettings?.syncedPostCount || 0}
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
