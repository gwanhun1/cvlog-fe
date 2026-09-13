import Link from 'next/link';
import { RecordSkeleton } from 'components/pages/design/LoadingShapes';
import s from 'styles/logmeDesign.module.scss';
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
  if (isPending) return <RecordSkeleton kind="utility" />;
  return (
    <div>
      <p role="status">
        {isError
          ? '백업 상태를 불러오지 못했습니다.'
          : data
            ? statusLabels[data.status]
            : '백업 상태를 확인해주세요.'}
      </p>
      {data && !isError && data.repoName && (
        <p>
          {data.repoName}
          {data.pendingPostCount != null && data.pendingPostCount > 0
            ? ` · 미반영 ${data.pendingPostCount}개`
            : ''}
        </p>
      )}
      <div className={s.actions}>
        <Link href="/workspace/github" className={s.textLink}>
          백업 설정 →
        </Link>
        {isError && (
          <button
            type="button"
            disabled={isFetching}
            onClick={() => refetch()}
            className={s.textLink}
          >
            {isFetching ? '확인 중…' : '다시 확인'}
          </button>
        )}
      </div>
    </div>
  );
}
