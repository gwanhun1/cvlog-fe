import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import ListView from './components/ListView';
import SideView from './components/SideView';

const Article: NextPage = () => {
  return (
    <div className="flex items-start justify-center min-h-screen bg-white">
      <Head>
        <title>CVLOG</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto flex flex-col tablet:flex-row gap-8 p-4 tablet:p-8">
        <div className="hidden tablet:block w-72 desktop:w-80 shrink-0">
          <SideView />
        </div>
        <div className="flex-1 max-w-4xl mx-auto">
          <ListView />
        </div>
      </div>
    </div>
  );
};

export default Article;
