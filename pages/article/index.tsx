import { useRef, useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { PostListView } from '../../components/pages/article/postList';
import SideView from '../../components/pages/article/sideView/SideView';
import LocalStorage from 'public/utils/Localstorage';
import MenuTab from 'components/pages/article/sideView/MenuTab';
import FilterBox from 'components/Shared/LogmeFilterBox.tsx/FilterBox';
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

        <link
          rel="canonical"
          href="https://logme-io.vercel.app/article"
        />
      </Head>

      <main className="w-full">
        <div className="relative px-4 pt-10 pb-16 mx-auto max-w-5xl tablet:px-6 desktop:px-8">
          {isClient && accessToken && menu === 'list' && (
            <div className="hidden absolute top-0 right-full h-full desktop:block">
              <aside className="sticky top-[8.5rem] z-30 w-64 pl-16">
                <SideView />
              </aside>
            </div>
          )}
          <div className="p-4 space-y-4 rounded-3xl border backdrop-blur border-ftBlue/25 bg-white/90 tablet:p-6">
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
                  initialPosts={initialPosts}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export const getStaticProps = async () => {
  try {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL ||
      'https://port-0-cvlog-be-m708xf650a274e01.sel4.cloudtype.app';

    const response = await fetch(`${API_URL}/posts/public/page/1`);
    if (!response.ok) {
      return {
        props: {
          initialPosts: [],
        },
        revalidate: 60,
      };
    }

    const responseData = await response.json();
    const posts = (responseData?.data?.posts || []) as BlogType[];

    const initialPosts = posts.filter(post => post?.id && post?.public_status);

    return {
      props: {
        initialPosts,
      },
      revalidate: 60,
    };
  } catch {
    return {
      props: {
        initialPosts: [],
      },
      revalidate: 60,
    };
  }
};

export default Article;
