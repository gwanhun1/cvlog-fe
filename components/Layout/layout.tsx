import React from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const { pathname } = useRouter();
  const isNavVisible =
    !['/', '/article/new'].includes(pathname) &&
    !pathname.startsWith('/article/modify/');
  const isArticleContent = pathname.startsWith('/article/content/');

  return (
    <div
      className={cn(
        {
          'px-2 tablet:px-20 tablet:container pt-20 tablet:pt-24 pb-8':
            pathname !== '/login' &&
            !pathname.startsWith('/article/new') &&
            !pathname.startsWith('/article/modify/'),
        },
        { 'desktop:px-[17.5rem]': isArticleContent },
        { 'pt-16': pathname !== '/login' && isNavVisible && pathname !== '/' }
      )}
    >
      {children}
    </div>
  );
};

export default Layout;
