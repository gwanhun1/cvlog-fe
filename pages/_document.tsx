import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
<<<<<<< HEAD
    <Html lang="ko">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="description" content="개발 블로그" />
        <meta name="keywords" content="개발, 블로그, 프로그래밍" />
        <meta name="author" content="작성자 이름" />
        
        {/* Open Graph 태그 */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="블로그 제목" />
        <meta property="og:description" content="블로그 설명" />
        <meta property="og:image" content="대표 이미지 URL" />
        
        {/* 네이버 웹마스터 도구 인증 */}
        <meta name="naver-site-verification" content="네이버 웹마스터 인증 코드" />
=======
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
>>>>>>> eb3dd71bc9025702f4bd551a3c46aa124f0273b3
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
