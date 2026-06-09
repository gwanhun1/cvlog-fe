import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/pages/home/Header';
import FeaturesSection from '../components/pages/home/FeaturesSection';
import ResumeFeatureSection from '../components/pages/home/ResumeFeatureSection';
import HowItWorks from '../components/pages/home/HowItWorks';
import Footer from '../components/pages/home/Footer';
import HomeData from '../public/mockData/aboutMockData.json';

export interface IntroduceData {
  id: number;
  src: string;
  title: string;
  message: string;
  messageBr: string;
}

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/50 via-white to-white">
      <Head>
        <title>LOGME - 개발자를 위한 마크다운 블로그 & 무료 이력서 빌더</title>
        <meta
          name="description"
          content="개발자를 위한 마크다운 블로그 플랫폼. 무료 개발자 이력서 작성, 실시간 미리보기, PDF 저장까지 한 곳에서. 이력서 작성이 고민이라면 LOGME를 사용해보세요."
        />
        <meta name="keywords" content="마크다운, 블로그, 개발자, 프로그래밍, 기술 블로그, LOGME, 이력서, 이력서 작성, 개발자 이력서, 무료 이력서, 이력서 빌더, 이력서 템플릿" />
        <meta property="og:title" content="LOGME - 개발자를 위한 마크다운 블로그 & 무료 이력서 빌더" />
        <meta property="og:description" content="개발자를 위한 마크다운 블로그 플랫폼. 무료 개발자 이력서 작성, 실시간 미리보기, PDF 저장까지 한 곳에서." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://logme-io.vercel.app" />
        <meta property="og:image" content="https://logme-io.vercel.app/assets/logo.png" />
        <meta property="og:site_name" content="LOGME" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LOGME - 개발자를 위한 마크다운 블로그 & 무료 이력서 빌더" />
        <meta name="twitter:description" content="개발자를 위한 마크다운 블로그 플랫폼. 무료 개발자 이력서 작성, PDF 저장까지." />
        <meta name="twitter:image" content="https://logme-io.vercel.app/assets/logo.png" />
        <link rel="canonical" href="https://logme-io.vercel.app" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'LOGME',
                url: 'https://logme-io.vercel.app',
                description: '개발자를 위한 마크다운 블로그 & 무료 이력서 빌더',
                inLanguage: 'ko-KR',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate: 'https://logme-io.vercel.app/article?q={search_term_string}',
                  },
                  'query-input': 'required name=search_term_string',
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: 'LOGME 이력서 빌더',
                applicationCategory: 'BusinessApplication',
                operatingSystem: 'Web',
                url: 'https://logme-io.vercel.app/resume',
                description: '개발자 맞춤 무료 이력서 작성 도구. 실시간 미리보기, PDF 저장, 자동저장, 섹션 드래그 지원.',
                inLanguage: 'ko-KR',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'KRW',
                },
              },
            ]),
          }}
        />
      </Head>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 tablet:px-6 desktop:px-8">
        {/* Hero — 헤드라인 + CTA + 브라우저 프레임 비디오 */}
        <Header />

        {/* Features — 탭형 기능 쇼케이스 */}
        <FeaturesSection data={HomeData.data} />

        {/* Resume Builder — 이력서 빌더 소개 */}
        <ResumeFeatureSection />

        {/* How It Works — 3단계 설명 */}
        <HowItWorks />

        {/* Footer CTA */}
        <Footer />
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const response = await import('../public/mockData/aboutMockData.json');
    return {
      props: { aboutData: response.data },
      revalidate: 60 * 60,
    };
  } catch {
    return { props: { aboutData: [] } };
  }
};

export default Home;
