import AuthGuard from 'components/Shared/common/AuthGuard';
import GithubBackup from 'components/pages/workspace/GithubBackup';

export default function GithubBackupPage() {
  return (
    <AuthGuard>
      <GithubBackup />
    </AuthGuard>
  );
}
