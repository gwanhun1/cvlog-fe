import DiscoveryFilters from 'components/pages/article/DiscoveryFilters';
import dynamic from 'next/dynamic';
import { trackEvent } from 'utils/analytics';
import { useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import FilterBox from 'components/Shared/LogmeFilterBox/FilterBox';
import PopularPosts from 'components/Shared/PopularPosts';
import { PostListView } from 'components/pages/article/postList';
import FeaturedPost from 'components/pages/article/postList/FeaturedPost';
import MenuTab from 'components/pages/article/sideView/MenuTab';
import LocalStorage from 'public/utils/Localstorage';
import { ListDataType } from 'service/api/tag/type';
import { useStore } from 'service/store/useStore';
import { publicArticlePagePath } from 'utils/articlePagination';

type ArticleProps = {
  initialList: ListDataType;
  initialPage?: number;
};

const InlineTagOrganizer = dynamic(
  () => import('components/pages/article/InlineTagOrganizer'),
  { ssr: false },
);

const Article: NextPage<ArticleProps> = ({ initialList, initialPage = 1 }) => {
  const router = useRouter();
  const { view } = router.query;
  const [isClient, setIsClient] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const keyword = useStore(state => state.tagAtom);
  const setTagAtom = useStore(state => state.setTagAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);
  const menu = view === 'my' ? 'list' : 'all';

  const setKeyword = (value: React.SetStateAction<string>) => {
    const next = (typeof value === 'function' ? value(keyword) : value)
      .trim()
      .slice(0, 100);
    setTagAtom(next);
    if (next !== (router.query.q || '')) {
      const { tagKeyword: _, page: _page, ...query } = router.query;
      router.push(
        { pathname: '/article', query: { ...query, q: next } },
        undefined,
        { shallow: true, scroll: false },
      );
      trackEvent('search_submit', { query_length: next.length });
    }
  };

  const setMenu = (value: React.SetStateAction<'list' | 'all'>) => {
    const nextMenu = typeof value === 'function' ? value(menu) : value;
    const {
      tagKeyword: _tagKeyword,
      q: _q,
      page: _page,
      ...remainingQuery
    } = router.query;
    setTagAtom('');
    router.push(
      {
        pathname: '/article',
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

    setTagAtom(typeof router.query.q === 'string' ? router.query.q : '');
    setIsClient(true);
    const token = LocalStorage.getItem('LogmeToken');
    setAccessToken(token);
  }, [router.isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (router.isReady)
      setTagAtom(
        typeof router.query.q === 'string'
          ? router.query.q
          : typeof router.query.tagKeyword === 'string'
            ? router.query.tagKeyword
            : '',
      );
  }, [router.isReady, router.query.q, router.query.tagKeyword, setTagAtom]);

  const featuredPost =
    initialPage === 1 &&
    menu === 'all' &&
    !keyword &&
    router.query.sort !== 'popular'
      ? initialList?.posts[0]
      : undefined;
  const showMyWorkspace = isClient && Boolean(accessToken) && menu === 'list';
  const suggestedTags = Array.from(
    new Map(
      (initialList?.posts ?? [])
        .flatMap(post => post.tags ?? [])
        .map(tag => [tag.name, tag.name]),
    ).values(),
  );

  const canonicalUrl = `https://logme.cloud${publicArticlePagePath(initialPage)}`;
  const pageTitle =
    initialPage === 1
      ? 'LOGME - 게시물 목록'
      : `LOGME - 게시물 목록 ${initialPage}페이지`;

  return (
    <div className="min-h-viewport mx-auto w-full text-slate-950">
      <Head>
        <title>{pageTitle}</title>
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
        <meta property="og:url" content={canonicalUrl} />
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

        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: 'LOGME - 모든 게시물 목록',
              url: canonicalUrl,
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

      <h1 className="sr-only">{pageTitle}</h1>

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

        {menu === 'all' && <DiscoveryFilters />}
        {showMyWorkspace && (
          <InlineTagOrganizer
            keyword={keyword}
            onSearch={value => setKeyword(value)}
          />
        )}
        <section
          aria-label="글 탐색"
          className="grid grid-cols-1 gap-4 border-b border-slate-300 pb-5 tablet:grid-cols-[minmax(0,1fr)_auto] tablet:items-center tablet:gap-7"
        >
          <FilterBox
            keyword={keyword}
            setKeyword={setKeyword}
            inputRef={inputRef}
            suggestedTags={suggestedTags}
          />

          <div className="flex items-center justify-between gap-4 tablet:justify-end">
            <MenuTab setMenu={setMenu} activeMenu={menu} />
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
                {keyword
                  ? '검색 결과'
                  : menu === 'all'
                    ? router.query.sort === 'popular'
                      ? '많이 읽은 글'
                      : initialPage === 1
                        ? '최신 글'
                        : `이전 글 · ${initialPage}페이지`
                    : '내 기록'}
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

          <div>
            {menu === 'list' ? (
              showMyWorkspace ? (
                <PostListView
                  key={`${initialPage}-${menu}-${keyword}-${router.query.sort || 'latest'}`}
                  inputRef={inputRef}
                  setKeyword={setKeyword}
                  mode="my"
                />
              ) : null
            ) : (
              <PostListView
                key={`${initialPage}-${menu}-${keyword}-${router.query.sort || 'latest'}`}
                inputRef={inputRef}
                setKeyword={setKeyword}
                mode="public"
                initialList={initialList}
                initialPage={initialPage}
                featuredPostId={featuredPost?.id}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Article;
