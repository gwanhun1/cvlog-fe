import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import AllView from './components/AllView';
import ListView from './components/ListView';
import SideView from './components/SideView';
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

          <div className="container mx-auto flex flex-col tablet:flex-row gap-8 pt-3 tablet:p-8">
            <div className="hidden tablet:block w-72 desktop:w-80 shrink-0">
              <SideView />
            </div>
            <div className="flex-1 ">
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
