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
      <Head>
        <title>모든 게시물 | CVLog</title>
        <meta name="description" content="개발자들의 다양한 기술 블로그 게시물을 만나보세요. 프로그래밍, 웹 개발, 모바일 개발 등 다양한 주제의 게시물이 있습니다." />
        <meta name="keywords" content="개발 블로그, 프로그래밍, 기술 블로그, 개발자, 코딩, 웹개발, 프론트엔드, 백엔드" />
        
        {/* Open Graph */}
        <meta property="og:title" content="모든 게시물 | CVLog" />
        <meta property="og:description" content="개발자들의 다양한 기술 블로그 게시물을 만나보세요." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://[your-domain]/article" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="모든 게시물 | CVLog" />
        <meta name="twitter:description" content="개발자들의 다양한 기술 블로그 게시물을 만나보세요." />
      </Head>
      {accessToken && (
        <div className="flex items-start justify-center ">
<<<<<<< Updated upstream
          <Head>
            <title>CVLOG</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <div className="container mx-auto flex flex-col tablet:flex-row gap-8 pt-3 tablet:p-8">
            <div className="hidden tablet:block w-72 desktop:w-80 shrink-0">
=======
          <div className="container mx-auto flex flex-col tablet:flex-row gap-4 pt-3 tablet:p-8 ">
            <div className="hidden tablet:block w-40 desktop:w-48 shrink-0 ">
>>>>>>> Stashed changes
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
