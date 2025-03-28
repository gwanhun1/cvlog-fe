import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <meta charSet="utf-8" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="CVLog" />

        {/* 파비콘 설정 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* 검색 엔진에 표시되는 아이콘 설정 */}
        <meta name="application-name" content="LogMe" />
        <meta name="msapplication-TileImage" content="/assets/NavLogo.svg" />
        <meta property="og:image" content="/assets/NavLogo.svg" />

        <link rel="canonical" href="https://logme.shop" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
