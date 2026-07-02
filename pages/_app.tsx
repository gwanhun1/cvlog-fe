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
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';

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

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || '';
  // GA4 측정 ID(G-XXXX). Vercel 환경변수에만 설정 → 로컬/미설정 환경에선 로드 안 됨.
  const gaId = process.env.NEXT_PUBLIC_GA_ID || '';

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
          {gtmId && <GoogleTagManager gtmId={gtmId} />}
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
