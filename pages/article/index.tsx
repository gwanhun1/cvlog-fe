import { useRef, useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { AnimatePresence, motion } from 'framer-motion';
import { PostListView } from '../../components/pages/article/postList';
import TagDrawer from '../../components/pages/article/sideView/TagDrawer';
import SideView from '../../components/pages/article/sideView/SideView';
import LocalStorage from 'public/utils/Localstorage';
import MenuTab from 'components/pages/article/sideView/MenuTab';
import FilterBox from 'components/Shared/LogmeFilterBox/FilterBox';
import { useStore } from 'service/store/useStore';
import { BlogType } from 'service/api/tag/type';

type ArticleProps = {
  initialPosts?: BlogType[];
};

const Article: NextPage<ArticleProps> = ({ initialPosts }) => {
  // SSR/CSR 불일치 방지: 클라이언트에서만 토큰 확인
  const router = useRouter();
  const { view } = router.query;
  const [isClient, setIsClient] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // URL query 파라미터와 state 동기화
  const menu = view === 'my' ? 'list' : 'all';
  const setMenu = (value: React.SetStateAction<'list' | 'all'>) => {
    const newMenu = typeof value === 'function' ? value(menu) : value;
    setKeyword(''); // 탭 전환 시 검색어 초기화
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, view: newMenu === 'list' ? 'my' : 'all' },
      },
      undefined,
      { shallow: true },
    );
  };
  const keyword = useStore(state => state.tagAtom);
  const setTagAtom = useStore(state => state.setTagAtom);
  const inputRef = useRef<HTMLInputElement>(null);

  const setKeyword = (value: React.SetStateAction<string>) => {
    if (typeof value === 'function') {
      setTagAtom(value(keyword));
    } else {
      setTagAtom(value);
    }
  };

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // SPA 네비게이션 간 검색어 잔존 방지
    setTagAtom('');

    setIsClient(true);
    const token = LocalStorage.getItem('LogmeToken');
    setAccessToken(token);

    // 초기 로드 시 토큰이 있고 파라미터가 없으면 'my'로 설정
    if (token && !router.query.view) {
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, view: 'my' },
        },
        undefined,
        { shallow: true },
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full min-h-screen">
      <Head>
        <title>LOGME - 게시물 목록</title>
        <meta
          name="description"
          content="LOGME의 모든 게시물 목록입니다. 프로그래밍, 개발, 기술 관련 다양한 게시물을 확인하세요."
        />
        <meta
          name="keywords"
          content="게시물, 블로그, 프로그래밍, 개발, 기술, 글목록"
        />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />

        <meta property="og:title" content="LOGME - 모든 게시물 목록" />
        <meta
          property="og:description"
          content="LOGME의 다양한 개발 관련 게시물을 확인하세요."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://logme-io.vercel.app/article" />
        <meta
          property="og:image"
          content="https://logme-io.vercel.app/assets/logo.png"
        />
        <meta property="og:site_name" content="LOGME" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LOGME - 모든 게시물 목록" />
        <meta
          name="twitter:description"
          content="LOGME의 다양한 개발 관련 게시물을 확인하세요."
        />
        <meta
          name="twitter:image"
          content="https://logme-io.vercel.app/assets/logo.png"
        />

        <link rel="canonical" href="https://logme-io.vercel.app/article" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: 'LOGME - 모든 게시물 목록',
              url: 'https://logme-io.vercel.app/article',
              description: 'LOGME의 모든 개발 관련 게시물을 확인하세요.',
              inLanguage: 'ko-KR',
              isPartOf: {
                '@type': 'WebSite',
                name: 'LOGME',
                url: 'https://logme-io.vercel.app',
              },
            }),
          }}
        />
      </Head>

      <main className="w-full">
        {/* 모바일/태블릿: 드로어 + 플로팅 버튼 */}
        {isClient && accessToken && menu === 'list' && (
          <>
            <TagDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <button
              onClick={() => setDrawerOpen(true)}
              className="desktop:hidden fixed bottom-6 left-6 z-30 flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-ftBlue rounded-full shadow-lg shadow-ftBlue/30 hover:bg-[#1f4a8c] transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="태그 관리 열기"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              태그
            </button>
          </>
        )}

        <div className="relative mx-auto">
          {/* 데스크톱: 사이드바 + 메인 2컬럼 */}
          <div className="flex items-start gap-4">
            {/* 사이드바 (데스크톱 전용) */}
            <AnimatePresence initial={false}>
              {isClient && accessToken && menu === 'list' && (
                <motion.aside
                  key="sidebar"
                  className="hidden desktop:block flex-shrink-0 self-stretch overflow-clip"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.15, ease: 'easeInOut' }}
                >
                  <div className="w-[200px] h-full">
                    <SideView />
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* 메인 콘텐츠 */}
            <div className="flex-1 min-w-0">
              <div className="p-4 space-y-3 rounded-2xl bg-white shadow-sm">
                <FilterBox
                  keyword={keyword}
                  setKeyword={setKeyword}
                  inputRef={inputRef}
                />

                <MenuTab setMenu={setMenu} activeMenu={menu} />

                {menu === 'list' ? (
                  <>
                    {isClient && accessToken && (
                      <div className="w-full">
                        <PostListView
                          inputRef={inputRef}
                          setKeyword={setKeyword}
                          mode="my"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full">
                    <PostListView
                      inputRef={inputRef}
                      setKeyword={setKeyword}
                      mode="public"
                      initialPosts={
                        initialPosts && initialPosts.length > 0
                          ? initialPosts
                          : undefined
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export const getStaticProps = async () => {
  try {
    // NEXT_PUBLIC_API_BASE_URL 과 동일한 이름을 사용 (.env.production 기준)
    const API_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://158.179.174.170:8000';

    const response = await fetch(`${API_URL}/posts/public/page/1`, {
      next: { revalidate: 60 },
    } as RequestInit);

    if (!response.ok) {
      return {
        props: { initialPosts: [] },
        revalidate: 60,
      };
    }

    const responseData = await response.json();
    const posts = (responseData?.data?.posts || []) as BlogType[];
    const initialPosts = posts.filter(post => post?.id && post?.public_status);

    return {
      props: { initialPosts },
      revalidate: 60,
    };
  } catch {
    return {
      props: { initialPosts: [] },
      revalidate: 60,
    };
  }
};

export default Article;
