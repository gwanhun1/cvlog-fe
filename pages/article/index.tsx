import { useRef, useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { PostListView } from '../../components/pages/article/postList';
import SideView from '../../components/pages/article/sideView/SideView';
import LocalStorage from 'public/utils/Localstorage';
import MenuTab from 'components/pages/article/sideView/MenuTab';
import FilterBox from 'components/Shared/LogmeFilterBox.tsx/FilterBox';
import { useRecoilState } from 'recoil';
import { tagAtom } from 'service/atoms/atoms';
import { BlogType } from 'service/api/tag/type';

type ArticleProps = {
  initialPosts?: BlogType[];
};

const Article: NextPage<ArticleProps> = ({ initialPosts }) => {
  // SSR/CSR 불일치 방지: 클라이언트에서만 토큰 확인
  const [isClient, setIsClient] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [menu, setMenu] = useState<'list' | 'all'>('all');
  const [keyword, setKeyword] = useRecoilState(tagAtom);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    const token = LocalStorage.getItem('LogmeToken');
    setAccessToken(token);
    if (token) {
      setMenu('list');
    }
  }, []);

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

        <meta property="og:title" content="LOGME - 모든 게시물 목록" />
        <meta
          property="og:description"
          content="LOGME의 다양한 개발 관련 게시물을 확인하세요."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://logme.shop/article" />
        <meta
          property="og:image"
          content="https://logme.shop/assets/NavLogo.svg"
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
          content="https://logme.shop/assets/NavLogo.svg"
        />

        <link rel="canonical" href="https://logme.shop/article" />
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
