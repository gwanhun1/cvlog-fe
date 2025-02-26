import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import AllView from '../../components/pages/article/allView/AllView';
import ListView from '../../components/pages/article/listView/ListView';
import SideView from '../../components/pages/article/sideView/SideView';
import LocalStorage from 'public/utils/Localstorage';

const Article: NextPage = () => {
  const accessToken = LocalStorage.getItem('CVtoken');

  return (
    <>
      {accessToken && (
        <div className="flex items-start justify-center ">
          <Head>
            <title>CVLOG</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <div className="container mx-auto flex flex-col tablet:flex-row gap-4 pt-3 tablet:p-8 ">
            <div className="hidden tablet:block w-40 desktop:w-48 shrink-0 ">
              <SideView />
            </div>
            <div className="flex-1">
              <ListView />
            </div>
          </div>
        </div>
      )}
      <div className="w-full">
        <AllView />
      </div>
    </>
  );
};

export default Article;
