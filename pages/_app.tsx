import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import Layout from 'components/Layout/layout';
import Nav from 'components/Shared/LogmeNav';
import 'styles/globals.css';
import type { AppProps } from 'next/app';
import 'styles/globals.css';
import 'styles/markdown.scss';
import dynamic from 'next/dynamic';

// Nav 컴포넌트를 클라이언트 사이드에서만 렌더링
const ClientNav = dynamic(() => Promise.resolve(Nav), { ssr: false });

function SafeHydrate({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div suppressHydrationWarning className="bg-[#fafaff]">
      {children}
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5분
      },
    },
  });
  const router = useRouter();

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <SafeHydrate>
          {router.pathname === '/' ||
          router.pathname === '/article/new' ||
          router.pathname.startsWith('/article/modify/') ? null : (
            <ClientNav />
          )}
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SafeHydrate>
      </QueryClientProvider>
    </RecoilRoot>
  );
}
