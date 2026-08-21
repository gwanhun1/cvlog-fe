import React from 'react';
import { useRouter } from 'next/router';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const { pathname } = useRouter();
  const isArticleContent = pathname.startsWith('/article/content/');
  const isEditor =
    pathname === '/article/new' || pathname.startsWith('/article/modify/');
  const isStandalone = pathname === '/login' || isEditor;

  // 로그인은 뷰포트 중앙, 에디터는 전체 폭을 페이지 자체에서 관리한다.
  // 글 상세는 좁은 독서 폭을, 그 외 화면은 헤더의 max-w-7xl과 같은
  // 1280px 내부 기준선(container 1440px - 좌우 80px)을 사용한다.
  const layoutClassName = isStandalone
    ? undefined
    : isArticleContent
      ? 'mx-auto w-full px-5 pb-6 pt-16 tablet:container tablet:px-20 desktop:px-[17.5rem]'
      : 'mx-auto w-full px-2 pb-8 pt-20 tablet:container tablet:px-20 tablet:pt-24';

  return (
    <div className={layoutClassName}>{children}</div>
  );
};

export default Layout;
