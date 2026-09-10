import AuthGuard from 'components/Shared/common/AuthGuard';
import Workspace from 'components/pages/workspace/Workspace';
export default function WorkspacePage() { return <AuthGuard><Workspace /></AuthGuard>; }
