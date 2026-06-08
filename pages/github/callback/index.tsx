import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LoaderAnimation from 'components/Shared/common/LoaderAnimation';

/**
 * GitHub OAuth callback redirect page.
 *
 * GitHub redirects here after the user authorises the app (re-auth flow from
 * GithubSyncSettings). We simply forward the `code` query param to /join which
 * already contains the full OAuth exchange logic (getServerSideProps + client
 * token storage).
 *
 * If no code is present we redirect to /settings so the user can retry.
 */
const GithubCallbackPage = () => {
  const router = useRouter();

  useEffect(() => {
    // router.query is populated after hydration; wait until it is ready
    if (!router.isReady) return;

    const { code } = router.query;

    if (code && typeof code === 'string') {
      router.replace(`/join?code=${encodeURIComponent(code)}`);
    } else {
      router.replace('/settings?error=github_oauth_missing_code');
    }
  }, [router.isReady, router.query]); // eslint-disable-line react-hooks/exhaustive-deps

  return <LoaderAnimation />;
};

export default GithubCallbackPage;
