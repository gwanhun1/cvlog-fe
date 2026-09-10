import { useState } from 'react';
import { FiGithub } from 'react-icons/fi';
import { useToast } from 'components/Shared';
import DisconnectedState from './DisconnectedState';
import {
  useGithubSyncSettings,
  useCreateGithubRepo,
  useDisconnectGithubSync,
  useRetryGithubSync,
} from 'service/hooks/useGithubSync';
import { buildLinkUrl, GITHUB_SYNC_SCOPE } from 'utils/oauth';

const GithubSyncSettings = () => {
  const {
    data: settings,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGithubSyncSettings();
  const createRepo = useCreateGithubRepo();
  const disconnect = useDisconnectGithubSync();
  const retry = useRetryGithubSync();
  const { showToast, showConfirm } = useToast();
  const [repoName, setRepoName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const needsAuth =
    settings?.status === 'reauth_required' ||
    settings?.status === 'permission_required';
  const ready = settings?.status === 'ready';
  const pending = settings?.status === 'pending';
  const reauthorize = () => {
    const url = buildLinkUrl('github', GITHUB_SYNC_SCOPE);
    if (url) window.location.href = url;
    else showToast('GitHub 연동 설정을 확인해주세요.', 'error');
  };

  const handleCreate = () => {
    const name = repoName.trim();
    if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
      setError(
        '저장소 이름은 영문, 숫자, 점, 하이픈, 밑줄만 사용할 수 있습니다.',
      );
      return;
    }
    setError(null);
    createRepo.mutate(name, {
      onError: (err: any) =>
        setError(err?.response?.data?.message ?? '저장소 생성에 실패했습니다.'),
    });
  };

  return (
    <section className="p-8 bg-white rounded-xl border border-blue-100 shadow-sm">
      <div className="flex gap-2 items-center mb-6">
        <FiGithub className="w-5 h-5 text-gray-700" />
        <h2 className="text-xl font-semibold text-gray-900">GitHub 동기화</h2>
      </div>
      {isLoading ? (
        <div
          className="h-20 bg-gray-100 rounded-lg animate-pulse"
          aria-label="동기화 상태 확인 중"
        />
      ) : (
        <div className="space-y-4">
          <p
            role="status"
            className={`text-sm font-medium ${ready ? 'text-green-600' : 'text-amber-700'}`}
          >
            {isError
              ? '동기화 상태를 확인하지 못했습니다.'
              : ready
                ? '동기화 정상'
                : pending
                  ? '동기화 누락 있음'
                  : needsAuth
                    ? 'GitHub 쓰기 권한 연결 필요'
                    : settings?.status === 'disabled'
                      ? '동기화 미연결'
                      : '동기화 확인 필요'}
          </p>
          {settings?.message ? (
            <p className="text-sm text-gray-600">{settings.message}</p>
          ) : null}
          {settings?.repoUrl ? (
            <div className="p-4 space-y-2 bg-gray-50 rounded-lg text-sm">
              <a
                href={settings.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {settings.repoName} ↗
              </a>
              <p>
                저장소의 글 파일:{' '}
                {settings.syncedPostCount === null
                  ? '확인 불가'
                  : `${settings.syncedPostCount}개`}
              </p>
              {settings.pendingPostCount !== null ? (
                <p>미반영 공개 글: {settings.pendingPostCount}개</p>
              ) : null}
            </div>
          ) : null}
          {needsAuth ? (
            <button
              onClick={reauthorize}
              className="px-4 py-2 text-sm text-white bg-gray-900 rounded-lg"
            >
              GitHub 쓰기 권한 연결
            </button>
          ) : settings?.status === 'disabled' ? (
            <DisconnectedState
              repoName={repoName}
              setRepoName={setRepoName}
              error={error}
              clearError={() => setError(null)}
              isCreating={createRepo.isPending}
              onCreateRepo={handleCreate}
            />
          ) : null}
          {pending ? (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">
                저장소 생성 이후 공개 글을 확인합니다. 누락 글은 원래 작성일로
                복구하고, 수정된 글은 최신 내용으로 반영합니다.
              </p>
              <button
                disabled={retry.isPending}
                onClick={() =>
                  retry.mutate(undefined, {
                    onSuccess: () =>
                      showToast('GitHub 동기화를 완료했습니다.', 'success'),
                    onError: (err: any) =>
                      showToast(
                        err?.response?.data?.message ??
                          '동기화에 실패했습니다. 상태를 다시 확인해주세요.',
                        'error',
                      ),
                  })
                }
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg disabled:opacity-50"
              >
                {retry.isPending ? '동기화 중…' : '미반영 글 동기화'}
              </button>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <button
              disabled={isFetching || retry.isPending}
              onClick={() => refetch()}
              className="px-4 py-2 text-sm bg-gray-100 rounded-lg disabled:opacity-50"
            >
              상태 다시 확인
            </button>
            {settings?.enabled ? (
              <button
                disabled={disconnect.isPending || retry.isPending}
                onClick={() =>
                  showConfirm(
                    '동기화를 해제하시겠습니까? GitHub 저장소와 기존 커밋은 보존됩니다.',
                    () =>
                      disconnect.mutate(undefined, {
                        onError: () =>
                          showToast('연결 해제에 실패했습니다.', 'error'),
                      }),
                  )
                }
                className="px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg disabled:opacity-50"
              >
                연결 해제
              </button>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
};

export default GithubSyncSettings;
