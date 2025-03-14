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
    <div className="flex justify-center w-full">
      <Head>
        <title>LOGME</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {accessToken && (
        <div className="hidden tablet:block w-40 desktop:w-48 shrink-0 mt-7">
          <SideView />
        </div>
      )}

      <div className="w-full max-w-screen-md  tablet:px-8 tablet:py-8 pt-3 relative">
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
  );
};

export default Article;
