import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import axios from 'axios';
import Link from 'next/link';
import LocalStorage from 'public/utils/Localstorage';
import * as Shared from 'components/Shared';
import Introduce from './components/introduce';

const About: NextPage = () => {
  const [aboutData, setAboutData] = useState<IntroduceInterface[]>();
  const accessToken = LocalStorage.getItem('CVtoken') as string;

  useEffect(() => {
    const response = axios
      .get('/mockData/aboutMockData.json')
      .then(res => setAboutData(res.data.data));
  }, []);

  return (
    <section className=" flex flex-col items-center justify-center">
      <article className="flex flex-col items-center justify-center w-full p-8 text-center ">
        <h1 className="mb-1 text-2xl tablet:mb-5 tablet:text-4xl text-ftBlue font-jost-medium">
          Write. Preview. Publish. Repeat.
        </h1>
        <div className="text-xs text-gray-400 tablet:text-sm desktop:px-24 desktop:px-0  flex justify-center flex-col">
          <p>The Ultimate Developer Blogging Platform powered by Markdown.</p>
          <div className="hidden tablet:block">
            <p>Experience the New world of Markdown.</p>
          </div>
          <div className="justify-center flex">
            <Shared.LogmeIcon.SymbolLogoIcon
              alt="logo"
              width={200}
              height={120}
              cn="object-none object-bottom h-[80px] "
            />
          </div>
        </div>
      </article>
      <div className="bg-white rounded-xl">
        {aboutData &&
          aboutData.map((element: IntroduceInterface) => (
            <Introduce key={element.id} Element={element} />
          ))}
      </div>
      <section className="w-full pt-4 pb-2 md:pb-20 ">
        <div className="flex flex-col items-center justify-center w-full">
          <h2 className="p-3 my-10 text-sm font-light text-center text-gray-400 md:text-lg">
            You are now all ready.
            <p>Let&lsquo;s go for try.</p>
          </h2>
          <div className="flex items-center justify-center w-full ">
            <Link href={'/article/new'} className="mr-1 md:w-1/4 ">
              <button
                type="submit"
                className="w-full h-full p-3 text-center rounded-full md:p-4 md:text-2xl bg-ftBlue hover:bg-blue-800"
              >
                Try Markdown
              </button>
            </Link>
            <Link href={accessToken ? '/article' : '/'} className="md:w-1/4 ">
              <button
                type="submit"
                className="w-full h-full p-3 text-center text-gray-400 bg-white rounded-full shadow-md md:p-4 md:text-2xl hover:bg-ftBlue shadow-gray-500"
                onClick={() => !accessToken && alert('로그인 먼저 해주세요.')}
              >
                List Page
              </button>
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
};

export default About;

export interface IntroduceType {
  Element: IntroduceInterface;
}

export interface IntroduceInterface {
  id: number;
  src: string;
  title: string;
  message: string;
  messageBr: string;
}
