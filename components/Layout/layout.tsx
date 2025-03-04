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
          'px-4 tablet:px-20 tablet:container tablet:mx-auto pt-24':
            pathname !== '/login' &&
            !pathname.startsWith('/article/new') &&
            !pathname.startsWith('/article/modify/'),
        },
        { 'desktop:px-[17.5rem]': isArticleContent },
        { 'pt-16': pathname !== '/login' && isNavVisible }
      )}
    >
      {children}
    </div>
  );
};

export default Layout;
