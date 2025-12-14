import React, { useRef, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import AllView from '../../components/pages/article/allView/AllView';
import ListView from '../../components/pages/article/listView/ListView';
import SideView from '../../components/pages/article/sideView/SideView';
import LocalStorage from 'public/utils/Localstorage';
import MenuTab from 'components/pages/article/sideView/MenuTab';
import FilterBox from 'components/Shared/LogmeFilterBox.tsx/FilterBox';
import { useRecoilState } from 'recoil';
import { tagAtom } from 'service/atoms/atoms';

const Article: NextPage = () => {
  const accessToken = LocalStorage.getItem('LogmeToken');
  const [menu, setMenu] = useState<'list' | 'all'>(
    accessToken ? 'list' : 'all'
  );
  const [keyword, setKeyword] = useRecoilState(tagAtom);
  const inputRef = useRef<HTMLInputElement>(null);

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
        <meta property="og:site_name" content="LOGME" />
        <link rel="canonical" href="https://logme.shop/article" />
      </Head>

      <main className="w-full">
        <div className="relative px-4 pt-10 pb-16 mx-auto max-w-5xl tablet:px-6 desktop:px-8">
          {accessToken && menu === 'list' && (
            <div className="hidden absolute top-0 right-full h-full desktop:block">
              <aside className="sticky top-32 z-30 w-64">
                <SideView />
              </aside>
            </div>
          )}
          <div className="rounded-3xl border border-ftBlue/25 bg-white/90 backdrop-blur p-4 tablet:p-6 space-y-4">
            <FilterBox
              keyword={keyword}
              setKeyword={setKeyword}
              inputRef={inputRef}
            />

            <MenuTab setMenu={setMenu} activeMenu={menu} />

            {menu === 'list' ? (
              <>
                {accessToken && (
                  <div className="w-full">
                    <ListView inputRef={inputRef} setKeyword={setKeyword} />
                  </div>
                )}
              </>
            ) : (
              <div className="w-full">
                <AllView inputRef={inputRef} setKeyword={setKeyword} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Article;
