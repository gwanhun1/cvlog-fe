import type { GetStaticProps } from 'next';
import Introduce from '../components/pages/home/introduce';
import Header from '../components/pages/home/Header';
import Footer from '../components/pages/home/Footer';
import HomeData from '../public/mockData/aboutMockData.json';
import Head from 'next/head';
export interface IntroduceData {
  id: number;
  src: string;
  title: string;
  message: string;
  messageBr: string;
}

const Home = () => {
  return (
    <section className="flex flex-col items-center justify-center">
      <Head>
        <title>LogMe - 개발자를 위한 기술 블로그 플랫폼</title>
        <meta name="description" content="LogMe는 개발자를 위한 기술 블로그 플랫폼입니다. 프로그래밍, 개발, 리액트, 자바스크립트 등 다양한 기술 글을 작성하고 공유하세요." />
        <meta name="keywords" content="기술블로그, 개발자, 프로그래밍, 리액트, 자바스크립트, 웹개발" />
        
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        
        <meta property="og:title" content="LogMe - 개발자를 위한 기술 블로그 플랫폼" />
        <meta property="og:description" content="프로그래밍, 개발, 리액트, 자바스크립트 등 다양한 기술 글을 작성하고 공유하는 플랫폼입니다." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://logme.shop" />
        <meta property="og:image" content="/assets/NavLogo.svg" />
        <meta property="og:site_name" content="LogMe" />
        
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://logme.shop" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "LogMe",
            "url": "https://logme.shop",
            "description": "LogMe는 개발자를 위한 기술 블로그 플랫폼입니다.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://logme.shop/article?tagKeyword={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Head>
      <Header />
      <div className="tablet:px-20">
        {HomeData?.data.map((element: IntroduceData) => (
          <Introduce key={element.id} Element={element} />
        ))}
      </div>
      <Footer />
    </section>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const response = await import('../public/mockData/aboutMockData.json');
    return {
      props: {
        aboutData: response.data,
      },
      revalidate: 60 * 60,
    };
  } catch (error) {
    console.error('Failed to fetch about data:', error);
    return {
      props: {
        aboutData: [],
      },
    };
  }
};

export default Home;
