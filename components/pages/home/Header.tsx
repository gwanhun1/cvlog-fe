import React from 'react';
import * as Shared from 'components/Shared';

const Header = () => {
  return (
    <article className="flex flex-col items-center justify-center w-full p-8 text-center">
      <h1 className="mb-1 text-2xl tablet:mb-5 tablet:text-4xl text-ftBlue font-jost-medium">
        Write. Preview. Publish. Repeat.
      </h1>
      <div className="text-xs text-gray-400 tablet:text-sm tablet:px-0 flex justify-center flex-col">
        <p>The Ultimate Developer Blogging Platform powered by Markdown.</p>
        <div className="hidden tablet:block">
          <p>Experience the New world of Markdown.</p>
        </div>
        <div className="justify-center flex">
          <Shared.LogmeIcon.SymbolLogoIcon
            alt="logo"
            width={300}
            height={160}
          />
        </div>
      </div>
    </article>
  );
};

export default Header;
