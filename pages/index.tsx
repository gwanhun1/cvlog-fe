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
    <div className="min-h-screen bg-gradient-to-b from-bgWhite via-white to-[#e7edf5]">
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
        <meta property="og:url" content="https://logme.shop" />
        <meta
          property="og:image"
          content="https://logme.shop/assets/NavLogo.svg"
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
          content="https://logme.shop/assets/NavLogo.svg"
        />

        <link rel="canonical" href="https://logme.shop" />
      </Head>

      <main className="px-4 py-10 mx-auto space-y-8 max-w-5xl tablet:px-6 desktop:px-8">
        <Header />

        <section className="space-y-8">
          <div className="overflow-hidden relative p-8 bg-gradient-to-br from-white via-white rounded-3xl border shadow-lg backdrop-blur border-ftBlue/20 to-ftBlue/5 shadow-ftBlue/10 tablet:p-10">
            {/* 배경 장식 */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br to-transparent rounded-full blur-3xl from-ftBlue/20" />
            <div className="absolute -bottom-10 left-1/4 w-32 h-32 bg-gradient-to-tr to-transparent rounded-full blur-2xl from-ftBlue/10" />

            <div className="flex relative flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
              <div className="space-y-3">
                <div className="flex gap-3 items-center">
                  <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-ftBlue via-[#2a5298] to-[#1c3f7a] tablet:text-3xl">
                    주요 기능
                  </h2>
                  <span className="px-4 py-1.5 text-xs font-bold text-white rounded-full bg-gradient-to-r from-ftBlue to-[#1c3f7a] shadow-md shadow-ftBlue/30">
                    {HomeData?.data.length}개 기능
                  </span>
                </div>
                <p className="max-w-xl text-base leading-relaxed text-ftGray tablet:text-lg">
                  LOGME는 개발자의 글쓰기 경험을 혁신합니다.
                  <br className="hidden tablet:block" />
                  아래에서 핵심 기능들을 확인해보세요.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full border-2 text-ftBlue bg-white/80 border-ftBlue/30">
                  📝 Markdown
                </span>
                <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full border-2 text-ftBlue bg-white/80 border-ftBlue/30">
                  🎨 Preview
                </span>
              </div>
            </div>
          </div>

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
