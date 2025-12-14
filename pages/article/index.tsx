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
    <div className="flex justify-center w-full min-h-screen bg-gradient-to-b via-white to-white from-slate-50">
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

      {accessToken && menu === 'list' && (
        <div className="hidden fixed left-4 top-32 z-40 w-52 desktop:block desktop:left-16 desktop:w-56">
          <SideView />
        </div>
      )}

      <div className="flex justify-center pt-6 pb-12 mx-auto w-full max-w-screen-xl tablet:px-8 tablet:py-10">
        <div className="px-4 w-full max-w-4xl tablet:px-0">
          <div className="rounded-3xl border border-slate-100 bg-white/80 backdrop-blur shadow-[0_20px_60px_-28px_rgba(15,23,42,0.35)] p-4 tablet:p-6 space-y-4">
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
      </div>
    </div>
  );
};

export default Article;
