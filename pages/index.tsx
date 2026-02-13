import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Introduce from '../components/pages/home/introduce';
import Header from '../components/pages/home/Header';
import Footer from '../components/pages/home/Footer';
import HomeData from '../public/mockData/aboutMockData.json';
export interface IntroduceData {
  id: number;
  src: string;
  title: string;
  message: string;
  messageBr: string;
}

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b via-white">
      <Head>
        <title>LOGME - 개발자를 위한 마크다운 블로그</title>
        <meta
          name="description"
          content="개발자를 위한 궁극의 마크다운 블로그 플랫폼. 깔끔한 프리뷰와 안정적인 퍼블리시로 작성 흐름을 경험하세요."
        />
        <meta
          name="keywords"
          content="마크다운, 블로그, 개발자, 프로그래밍, 기술 블로그, LOGME"
        />
        <meta
          property="og:title"
          content="LOGME - 개발자를 위한 마크다운 블로그"
        />
        <meta
          property="og:description"
          content="개발자를 위한 궁극의 마크다운 블로그 플랫폼"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://logme-io.vercel.app" />
        <meta
          property="og:image"
          content="https://logme-io.vercel.app/assets/logo.png"
        />
        <meta property="og:site_name" content="LOGME" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="LOGME - 개발자를 위한 마크다운 블로그"
        />
        <meta
          name="twitter:description"
          content="개발자를 위한 궁극의 마크다운 블로그 플랫폼"
        />
        <meta
          name="twitter:image"
          content="https://logme-io.vercel.app/assets/logo.png"
        />

        <link rel="canonical" href="https://logme-io.vercel.app" />
      </Head>

      <main className="px-4 py-10 mx-auto space-y-8 max-w-6xl tablet:px-6 desktop:px-8">
        <Header />

        <section className="space-y-8">
          {HomeData?.data.map((element: IntroduceData) => (
            <Introduce key={element.id} Element={element} />
          ))}
        </section>

        <Footer />
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const response = await import('../public/mockData/aboutMockData.json');
    return {
      props: {
        aboutData: response.data,
      },
      revalidate: 60 * 60, // 1시간마다 재생성
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
