import { useCallback, useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import { IoPricetagsOutline } from 'react-icons/io5';
import FilterBox from 'components/Shared/LogmeFilterBox/FilterBox';
import PopularPosts from 'components/Shared/PopularPosts';
import { PostListView } from 'components/pages/article/postList';
import FeaturedPost from 'components/pages/article/postList/FeaturedPost';
import MenuTab from 'components/pages/article/sideView/MenuTab';
import SideView from 'components/pages/article/sideView/SideView';
import TagDrawer from 'components/pages/article/sideView/TagDrawer';
import LocalStorage from 'public/utils/Localstorage';
import { BlogType, ListDataType } from 'service/api/tag/type';
import { useStore } from 'service/store/useStore';

type ArticleProps = {
  initialList?: ListDataType;
};

const Article: NextPage<ArticleProps> = ({ initialList }) => {
  const router = useRouter();
  const { view } = router.query;
  const [isClient, setIsClient] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const keyword = useStore(state => state.tagAtom);
  const setTagAtom = useStore(state => state.setTagAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);
  const menu = view === 'my' ? 'list' : 'all';
  const openTagDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeTagDrawer = useCallback(() => setDrawerOpen(false), []);

  const setKeyword = (value: React.SetStateAction<string>) => {
    setTagAtom(typeof value === 'function' ? value(keyword) : value);
  };

  const setMenu = (value: React.SetStateAction<'list' | 'all'>) => {
    const nextMenu = typeof value === 'function' ? value(menu) : value;
    const { tagKeyword: _tagKeyword, ...remainingQuery } = router.query;
    setKeyword('');
    setDrawerOpen(false);
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...remainingQuery,
          view: nextMenu === 'list' ? 'my' : 'all',
        },
      },
      undefined,
      { shallow: true },
    );
  };

  useEffect(() => {
    if (!router.isReady || hasInitialized.current) return;
    hasInitialized.current = true;

    setTagAtom('');
    setIsClient(true);
    const token = LocalStorage.getItem('LogmeToken');
    setAccessToken(token);

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
  }, [router.isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  const featuredPost =
    menu === 'all' && !keyword ? initialList?.posts[0] : undefined;
  const showMyWorkspace = isClient && Boolean(accessToken) && menu === 'list';

  return (
    <div className="mx-auto min-h-screen min-h-[100dvh] w-full max-w-[1248px] text-slate-950">
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
        <meta property="og:url" content="https://logme.cloud/article" />
        <meta
          property="og:image"
          content="https://logme.cloud/assets/logo.png"
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
          content="https://logme.cloud/assets/logo.png"
        />

        <link rel="canonical" href="https://logme.cloud/article" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: 'LOGME - 모든 게시물 목록',
              url: 'https://logme.cloud/article',
              description: 'LOGME의 모든 개발 관련 게시물을 확인하세요.',
              inLanguage: 'ko-KR',
              isPartOf: {
                '@type': 'WebSite',
                name: 'LOGME',
                url: 'https://logme.cloud',
              },
            }),
          }}
        />
      </Head>

      <h1 className="sr-only">LOGME 게시글</h1>

      {showMyWorkspace && (
        <TagDrawer open={drawerOpen} onClose={closeTagDrawer} />
      )}

      <main className="w-full">
        {featuredPost && (
          <section
            aria-label="최신 공개 글과 인기 글"
            className="hidden pb-8 tablet:block tablet:pb-10 desktop:pb-12"
          >
            <div className="grid grid-cols-1 gap-10 desktop:grid-cols-[minmax(0,1.95fr)_minmax(350px,1fr)] desktop:gap-10">
              <FeaturedPost post={featuredPost} />
              <PopularPosts limit={3} />
            </div>
          </section>
        )}

        <section
          aria-label="글 탐색"
          className="grid grid-cols-1 gap-4 border-b border-slate-300 pb-5 tablet:grid-cols-[minmax(0,1fr)_auto] tablet:items-center tablet:gap-7"
        >
          <FilterBox
            keyword={keyword}
            setKeyword={setKeyword}
            inputRef={inputRef}
          />

          <div className="flex items-center justify-between gap-4 tablet:justify-end">
            <MenuTab setMenu={setMenu} activeMenu={menu} />
            {showMyWorkspace && (
              <button
                type="button"
                onClick={openTagDrawer}
                className="flex min-h-[44px] items-center gap-2 rounded-[10px] border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 transition-colors hover:border-ftBlue hover:text-ftBlue focus-visible:ring-2 focus-visible:ring-ftBlue focus-visible:ring-offset-2 desktop:hidden"
                aria-label="내 태그 정리 열기"
                aria-controls="article-tag-drawer"
                aria-expanded={drawerOpen}
              >
                <IoPricetagsOutline aria-hidden className="h-4 w-4" />
                태그 정리
              </button>
            )}
          </div>
        </section>

        <section
          aria-labelledby="article-list-title"
          className="pb-14 pt-9 tablet:pb-16 tablet:pt-11"
        >
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2
                id="article-list-title"
                className="m-0 text-[24px] font-bold tracking-[-0.035em] text-slate-950"
              >
                {keyword ? '검색 결과' : menu === 'all' ? '최신 글' : '내 기록'}
              </h2>
              {keyword && (
                <p className="mb-0 mt-1 text-xs text-slate-500">
                  <strong className="font-bold text-ftBlue">{keyword}</strong>{' '}
                  검색 결과입니다.
                </p>
              )}
            </div>
            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword('')}
                className="min-h-[44px] px-1 text-xs font-bold text-slate-500 hover:text-ftBlue focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ftBlue focus-visible:ring-offset-2"
              >
                검색 지우기
              </button>
            )}
          </div>

          <div
            className={
              showMyWorkspace
                ? 'desktop:grid desktop:grid-cols-[208px_minmax(0,1fr)] desktop:items-start desktop:gap-6'
                : ''
            }
          >
            <AnimatePresence initial={false}>
              {showMyWorkspace && (
                <motion.aside
                  key="tag-sidebar"
                  className="hidden desktop:block"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                >
                  <SideView className="sticky top-[calc(var(--header-height,64px)+16px)] flex max-h-[calc(100vh-var(--header-height,64px)-32px)] w-full flex-col overflow-hidden border-t-2 border-slate-900 bg-transparent" />
                </motion.aside>
              )}
            </AnimatePresence>

            {menu === 'list' ? (
              showMyWorkspace ? (
                <PostListView
                  key="my-posts"
                  inputRef={inputRef}
                  setKeyword={setKeyword}
                  mode="my"
                />
              ) : null
            ) : (
              <PostListView
                key="public-posts"
                inputRef={inputRef}
                setKeyword={setKeyword}
                mode="public"
                initialList={initialList}
                featuredPostId={featuredPost?.id}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

const sanitizePublicPost = (post: any): BlogType | null => {
  if (!post?.id || !post?.public_status) return null;

  const safeUser = post.user
    ? {
        id: Number(post.user.id),
        username:
          typeof post.user.username === 'string' ? post.user.username : null,
        name: typeof post.user.name === 'string' ? post.user.name : null,
        profile_image:
          typeof post.user.profile_image === 'string'
            ? post.user.profile_image
            : null,
      }
    : undefined;

  return {
    id: Number(post.id),
    title: String(post.title ?? ''),
    content: String(post.content ?? ''),
    public_status: true,
    created_at: String(post.created_at ?? ''),
    updated_at: String(post.updated_at ?? post.created_at ?? ''),
    tags: Array.isArray(post.tags)
      ? post.tags.map((tag: any) => ({
          id: Number(tag.id),
          name: String(tag.name ?? ''),
        }))
      : [],
    ...(safeUser ? { user: safeUser } : {}),
  };
};

export const getStaticProps = async () => {
  try {
    const API_URL =
      process.env.API_SERVER_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'http://158.179.174.170:8000';

    const response = await fetch(`${API_URL}/posts/public/page/1`, {
      next: { revalidate: 60 },
    } as RequestInit);

    if (!response.ok) {
      return { props: {}, revalidate: 60 };
    }

    const responseData = await response.json();
    const list = responseData?.data;
    const posts = Array.isArray(list?.posts)
      ? list.posts
          .map(sanitizePublicPost)
          .filter((post: BlogType | null): post is BlogType => post !== null)
      : [];

    return {
      props: {
        initialList: {
          posts,
          maxPage: Math.max(1, Number(list?.maxPage) || 1),
        },
      },
      revalidate: 60,
    };
  } catch {
    return { props: {}, revalidate: 60 };
  }
};

export default Article;
