import React, { useRef, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import AllView from '../../components/pages/article/allView/AllView';
import ListView from '../../components/pages/article/listView/ListView';
import SideView from '../../components/pages/article/sideView/SideView';
import LocalStorage from 'public/utils/Localstorage';
import MenuTab from 'components/pages/article/sideView/MenuTab';
import FilterBox from 'components/pages/article/listView/FilterBox';
import { useRecoilState } from 'recoil';
import { tagAtom } from 'service/atoms/atoms';

const Article: NextPage = () => {
  const accessToken = LocalStorage.getItem('LogmeToken');
  const [menu, setMenu] = useState<'list' | 'all'>('list');
  const [keyword, setKeyword] = useRecoilState(tagAtom);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {accessToken && (
        <div className="flex justify-center w-full">
          <Head>
            <title>LOGME</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <div className="w-full max-w-screen-md  tablet:px-8 tablet:py-8 pt-3 relative">
            <FilterBox
              keyword={keyword}
              setKeyword={setKeyword}
              inputRef={inputRef}
            />

            <MenuTab setMenu={setMenu} activeMenu={menu} />

            {menu === 'list' ? (
              <div className="w-full">
                <ListView inputRef={inputRef} setKeyword={setKeyword} />
              </div>
            ) : (
              <div className="w-full">
                <AllView />
              </div>
            )}

            <div className="hidden tablet:block absolute top-8 -left-44 desktop:-left-38 w-40 desktop:w-48">
              <div className="sticky">
                <SideView />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Article;
