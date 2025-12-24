import { useState } from 'react';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import Layout from 'components/Layout/layout';
import Nav from 'components/Shared/LogmeNav';
import { ToastProvider } from 'components/Shared';
import 'styles/globals.css';
import type { AppProps } from 'next/app';
import 'styles/globals.css';
import 'styles/markdown.module.scss';
import dynamic from 'next/dynamic';
import ErrorBoundary from 'components/Shared/common/ErrorPage';
import { SafeHydrate } from 'components/Shared/common/SafeHydrate';
import AuthGuard from 'components/Shared/common/AuthGuard';
import Head from 'next/head';

const ClientNav = dynamic(() => Promise.resolve(Nav), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
            cacheTime: 1000 * 60 * 30,
            useErrorBoundary: false,
          },
        },
      })
  );
  const router = useRouter();

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <SafeHydrate>
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
              />
            </Head>
            {router.pathname === '/login' ||
            router.pathname === '/article/new' ||
            router.pathname.startsWith('/article/modify/') ? null : (
              <ClientNav />
            )}
            <Layout>
              <ErrorBoundary>
                <AuthGuard>
                  <Component {...pageProps} />
                </AuthGuard>
              </ErrorBoundary>
            </Layout>
          </SafeHydrate>
        </ToastProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}
