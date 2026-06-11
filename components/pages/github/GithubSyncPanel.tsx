import { useState } from 'react';
import {
  useGithubSyncSettings,
  useCreateGithubRepo,
  useDisconnectGithubSync,
} from 'service/hooks/useGithubSync';

const cardBase =
  'relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm';

const SyncIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const RepoIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const GithubSyncPanel = () => {
  const [repoName, setRepoName] = useState('');
  const [inputError, setInputError] = useState('');

  const { data: settings, isLoading } = useGithubSyncSettings();
  const { mutate: createRepo, isPending: isCreating, error: createError } = useCreateGithubRepo();
  const { mutate: disconnect, isPending: isDisconnecting } = useDisconnectGithubSync();

  const handleCreate = () => {
    const trimmed = repoName.trim();
    if (!trimmed) { setInputError('저장소 이름을 입력해주세요.'); return; }
    if (!/^[a-zA-Z0-9_.-]+$/.test(trimmed)) {
      setInputError('영문, 숫자, -, _, . 만 사용 가능합니다.');
      return;
    }
    setInputError('');
    createRepo(trimmed, { onSuccess: () => setRepoName('') });
  };

  if (isLoading) {
    return (
      <section className={`${cardBase} p-5`}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl animate-pulse bg-slate-100" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 w-40 rounded animate-pulse bg-slate-100" />
            <div className="h-3 w-64 rounded animate-pulse bg-slate-100" />
          </div>
        </div>
      </section>
    );
  }

  const isConnected = settings?.enabled && settings.repoName;

  return (
    <section className={cardBase}>
      <div className="p-5">
        <div className="flex flex-col gap-4 mobile:flex-row mobile:items-center mobile:justify-between">
          {/* 좌측 정보 */}
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl ${
              isConnected ? 'bg-green-50 text-green-600' : 'bg-ftBlue/10 text-ftBlue'
            }`}>
              <SyncIcon />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-ftBlack">GitHub 블로그 동기화</span>
                {isConnected ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-green-50 text-green-600 border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    활성
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 text-slate-500">
                    미연결
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-ftGray">
                {isConnected
                  ? `${settings.repoName} · ${settings.syncedPostCount ?? 0}개의 게시글이 동기화됨`
                  : 'LOGME 게시글을 GitHub 저장소에 자동으로 백업하세요.'}
              </p>
            </div>
          </div>

          {/* 우측 액션 */}
          {isConnected ? (
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={`https://github.com/${settings!.repoName}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-ftGray hover:text-ftBlack hover:border-slate-300 transition-colors"
              >
                <RepoIcon />
                저장소 보기
              </a>
              <button
                type="button"
                onClick={() => disconnect()}
                disabled={isDisconnecting}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {isDisconnecting ? '해제 중...' : '연결 해제'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 mobile:items-end">
              <div className="flex gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={repoName}
                      onChange={e => { setRepoName(e.target.value); setInputError(''); }}
                      onKeyDown={e => e.key === 'Enter' && handleCreate()}
                      placeholder="my-logme-blog"
                      className="h-8 px-3 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-ftBlue/50 focus:ring-1 focus:ring-ftBlue/20 w-44"
                    />
                    <button
                      type="button"
                      onClick={handleCreate}
                      disabled={isCreating}
                      className="h-8 px-3 text-xs font-semibold rounded-lg bg-ftBlue text-white hover:bg-[#1c3f7a] transition-colors disabled:opacity-60 flex-shrink-0"
                    >
                      {isCreating ? '생성 중...' : '저장소 만들기'}
                    </button>
                  </div>
                  {(inputError || createError) && (
                    <p className="text-[11px] text-red-500">
                      {inputError || '저장소 생성에 실패했습니다. 이름을 확인해주세요.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GithubSyncPanel;
