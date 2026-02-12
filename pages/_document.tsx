import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <meta charSet="utf-8" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="LogMe" />

        {/* 파비콘 설정 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* 검색 엔진에 표시되는 아이콘 설정 */}
        <meta name="application-name" content="LogMe" />
        <meta
          name="msapplication-TileImage"
          content="https://logme.shop/assets/logo.png"
        />

        {/* 기본 OG 이미지 - 각 페이지에서 개별 설정으로 덮어씀 */}
        <meta
          property="og:image"
          content="https://logme.shop/assets/logo.png"
        />
        <meta property="og:locale" content="ko_KR" />

        {/* Google Search Console 인증용 */}
        <meta
          name="google-site-verification"
          content="ZOHJ3gbgRZgnkzpT6EYDWaCe1oY7ExTZyvtzpr4S2-E"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
