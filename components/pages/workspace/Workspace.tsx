import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useQuery } from '@tanstack/react-query';
import { useGetUserInfo } from 'service/hooks/Login';
import { useGetList } from 'service/hooks/List';
import { getMyResumes } from 'service/api/resume';
import { useLocalDrafts } from 'hooks/useLocalDrafts';
import { getDisplayName, hasCapability } from 'utils/user';
import { RecordSkeleton } from 'components/pages/design/LoadingShapes';
import WorkspaceView from './WorkspaceView';
import GithubBackupSummary from './GithubBackupSummary';

export default function Workspace() {
  const user = useGetUserInfo();
  const userError = user.isError || (!user.isPending && !user.data?.id);
  const { drafts, error } = useLocalDrafts();
  const [draftsReady, setDraftsReady] = useState(false);
  useEffect(() => setDraftsReady(true), []);
  const resumes = useQuery({
    queryKey: ['workspaceResumes'],
    queryFn: getMyResumes,
    enabled: !!user.data?.id,
  });
  const posts = useGetList(1, undefined, !!user.data?.id);
  return (
    <>
      <Head>
        <title>내 작업실 · LOGME</title>
        <meta name="robots" content="noindex" />
      </Head>
      <WorkspaceView
        displayName={getDisplayName(user.data)}
        username={user.data?.username}
        userState={user.isPending ? 'loading' : userError ? 'error' : 'ready'}
        retryUser={() => {
          void user.refetch();
        }}
        userFetching={user.isFetching}
        drafts={drafts}
        draftState={!draftsReady ? 'loading' : error ? 'error' : 'ready'}
        posts={posts.data?.posts.slice(0, 5) ?? []}
        postState={
          posts.isError ? 'error' : posts.isPending ? 'loading' : 'ready'
        }
        retryPosts={() => {
          void posts.refetch();
        }}
        postsFetching={posts.isFetching}
        resumes={resumes.data?.slice(0, 3) ?? []}
        resumeState={
          resumes.isError ? 'error' : resumes.isPending ? 'loading' : 'ready'
        }
        retryResumes={() => {
          void resumes.refetch();
        }}
        resumesFetching={resumes.isFetching}
        backup={
          user.isPending ? (
            <RecordSkeleton kind="utility" />
          ) : userError ? null : hasCapability(user.data, 'githubStats') ? (
            <GithubBackupSummary />
          ) : (
            <p>백업은 GitHub 연결 후 사용할 수 있습니다.</p>
          )
        }
      />
    </>
  );
}
