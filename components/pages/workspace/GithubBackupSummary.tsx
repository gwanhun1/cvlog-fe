import Link from 'next/link';
import { useGithubSyncSettings } from 'service/hooks/useGithubSync';
import type { GithubSyncSettings } from 'service/api/github-sync/type';

const statusLabels: Record<GithubSyncSettings['status'], string> = {
  disabled: '백업 저장소를 연결해보세요',
  ready: '공개 글이 백업되어 있습니다',
  pending: '아직 반영되지 않은 공개 글이 있습니다',
  reauth_required: 'GitHub에 다시 연결해주세요',
  permission_required: 'GitHub 쓰기 권한이 필요합니다',
  repository_unavailable: '백업 저장소를 확인해주세요',
  error: '백업 상태를 확인해주세요',
};

export default function GithubBackupSummary() {
  const { data, isPending, isError, refetch, isFetching } =
    useGithubSyncSettings();
  return (
    <div className="space-y-3">
      <p role="status" className="text-sm text-slate-600">
        {isPending
          ? '백업 상태 확인 중…'
          : isError
            ? '백업 상태를 불러오지 못했습니다.'
            : data
              ? statusLabels[data.status]
              : '백업 상태를 확인해주세요'}
      </p>
      {data && !isError && (
        <p className="break-words text-sm text-slate-600">
          {data.repoName}
          {data.pendingPostCount != null && data.pendingPostCount > 0
            ? ` · 미반영 ${data.pendingPostCount}개`
            : ''}
        </p>
      )}
      <div className="flex flex-wrap gap-4">
        <Link
          href="/workspace/github"
          className="inline-flex min-h-[44px] items-center text-sm font-semibold text-ftBlue hover:underline"
        >
          백업 관리 →
        </Link>
        {isError && (
          <button
            type="button"
            disabled={isFetching}
            onClick={() => refetch()}
            className="min-h-[44px] text-sm text-slate-600 underline disabled:opacity-50"
          >
            다시 확인
          </button>
        )}
      </div>
    </div>
  );
}
