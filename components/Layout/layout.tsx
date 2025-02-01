import React, { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const router = useRouter();
  const isNavVisible = !(
    router.pathname === '/' ||
    router.pathname === '/article/new' ||
    router.pathname.startsWith('/article/modify/')
  );

  return (
    <div
      className={`${
        router.pathname === '/article/new' ||
        router.pathname.startsWith('/article/modify/')
          ? ''
          : cn('container', 'mx-auto', 'px-20')
      } ${isNavVisible ? 'pt-24' : ''}`}
    >
      {children}
    </div>
  );
};

export default Layout;
