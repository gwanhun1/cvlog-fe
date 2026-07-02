import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Layout from 'components/Layout/layout';
import { ToastProvider, ErrorBoundary, SafeHydrate } from 'components/Shared';
import 'styles/globals.css';
import type { AppProps } from 'next/app';
import 'styles/markdown.module.scss';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { GoogleAnalytics } from '@next/third-parties/google';

const ClientNav = dynamic(() => import('components/Shared/LogmeNav'), {
  ssr: true,
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
          },
        },
      }),
  );

  // GA4(logme 전용 속성). 기존 GTM(cvlog G-7WVP5XN87G) 중복을 없애기 위해 GTM은 제거하고
  // logme 측정 ID를 단일 소스로 사용. 환경변수로 덮어쓸 수 있게 기본값 지정.
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-JD2NS6CQGN';

  useEffect(() => {
    const handleStart = () => NProgress.start();
    const handleComplete = () => NProgress.done();

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <SafeHydrate>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          {gaId && <GoogleAnalytics gaId={gaId} />}
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
      </ToastProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
