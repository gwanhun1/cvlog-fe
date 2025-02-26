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
      {Element && (
        <section
          className={`mt-10 bg-white rounded-xl flex flex-col p-10 tablet:flex-row ${
            Element.id % 2 === 0 ? 'tablet:flex-row-reverse' : ''
          } items-center justify-center w-full gap-8 tablet:gap-12 py-8 tablet:py-16 shadow-lg`}
        >
          <article className="relative flex justify-center w-full h-[300px] tablet:w-3/5 tablet:h-[400px] px-4 tablet:px-8">
            <video
              src={Element.src}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className="absolute inset-0 w-full h-full rounded-xl shadow-xl object-cover"
            />
          </article>

          <article className="flex items-start w-full px-8 tablet:px-5 tablet:w-2/5">
            <div className="flex flex-col w-full gap-4 tablet:gap-6">
              <div className="flex items-center gap-4">
                <div className="hidden tablet:flex items-center justify-center w-20 h-11  text-2xl font-medium text-white rounded-full bg-ftBlue">
                  {Element.id + 1}
                </div>
                <h1 className="text-xl tablet:text-2xl font-medium break-keep text-ftBlue">
                  {Element.title}
                </h1>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-sm tablet:text-base text-gray-700">
                  {Element.message}
                </p>
                <p className="hidden tablet:block text-xs text-gray-600">
                  {Element.messageBr}
                </p>
              </div>
            </div>
          </article>
        </section>
      )}
    </>
  );
});

Introduce.displayName = 'Introduce';

export default Introduce;
