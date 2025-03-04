import React, { memo } from 'react';

export interface IntroduceProps {
  Element: IntroduceData;
}

export interface IntroduceData {
  id: number;
  src: string;
  title: string;
  message: string;
  messageBr: string;
}

const Introduce = memo(({ Element }: { Element: IntroduceData }) => {
  return (
    <>
      <section className="bg-white dark:bg-gray-900 rounded-lg">
        <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6 ">
          <video
            src={Element.src}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            className="inset-0 w-full h-full rounded-xl shadow-xl object-cover"
          />
          <div className="mt-4 md:mt-0">
            <h2 className="flex mb-4 text-3xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              <div className="hidden tablet:flex items-center justify-center w-10 h-10  text-2xl font-medium text-white rounded-full bg-ftBlue mr-2">
                {Element.id + 1}
              </div>
              {Element.title}
            </h2>
            <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
              <div className="flex flex-col">
                <div className="text-lg tablet:text-base text-gray-700">
                  {Element.message}
                </div>
                <p className="hidden tablet:block text-lg text-gray-600">
                  {Element.messageBr}
                </p>
              </div>
            </p>
          </div>
        </div>
      </section>
    </>
  );
});

Introduce.displayName = 'Introduce';

export default Introduce;
