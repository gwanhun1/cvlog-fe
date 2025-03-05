import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import Layout from 'components/Layout/layout';
import Nav from 'components/Shared/LogmeNav';
import 'styles/globals.css';
import type { AppProps } from 'next/app';
import 'styles/globals.css';
import 'styles/markdown.module.scss';
import dynamic from 'next/dynamic';
import ErrorBoundary from 'components/Shared/common/ErrorPage';
import { SafeHydrate } from './SafeHydrate';

// Nav 컴포넌트를 클라이언트 사이드에서만 렌더링
const ClientNav = dynamic(() => Promise.resolve(Nav), { ssr: false });


export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5분
        cacheTime: 1000 * 60 * 30, // 30분
        useErrorBoundary: true,
      },
    },
  });
  const router = useRouter();

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <SafeHydrate>
          {router.pathname === '/login' ||
          router.pathname === '/article/new' ||
          router.pathname.startsWith('/article/modify/') ? null : (
            <ClientNav />
          )}
          <Layout>
            <ErrorBoundary>
              <Component {...pageProps} />
            </ErrorBoundary>
          </Layout>
        </SafeHydrate>
      </QueryClientProvider>
    </RecoilRoot>
  );
}
