import Head from 'next/head';
import { useStore } from 'service/store/useStore';
import GithubStudio from 'components/pages/github/GithubStudio';
import useIsLogin from 'hooks/useIsLogin';

const GithubPage = () => {
  const userInfo = useStore(state => state.userIdAtom);
  const { isAuthenticated, isLoading } = useIsLogin();

  return (
    <>
      <Head>
        <title>GitHub Studio | LOGME</title>
        <meta name="description" content="GitHub 공개 활동과 저장소를 탐색하고 LOGME 기록과 연결하세요." />
      </Head>
      <GithubStudio
        userInfo={isAuthenticated ? userInfo : null}
        isAuthenticated={isAuthenticated}
        isAuthLoading={isLoading}
      />
    </>
  );
};

export default GithubPage;
