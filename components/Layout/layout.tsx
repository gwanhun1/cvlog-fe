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
          'tablet:container tablet:mx-auto px-2':
            !pathname.startsWith('/article/new') &&
            !pathname.startsWith('/article/modify/'),
        },
        { 'desktop:px-[17.5rem]': isArticleContent },
        { 'pt-24': isNavVisible }
      )}
    >
      {children}
    </div>
  );
};

export default Layout;
