import type { GetStaticProps, NextPage } from 'next';
import Introduce from '../../components/pages/about/introduce';
import Header from '../../components/pages/about/Header';
import Footer from '../../components/pages/about/Footer';

export interface IntroduceData {
  id: number;
  src: string;
  title: string;
  message: string;
  messageBr: string;
}

interface AboutProps {
  aboutData: IntroduceData[];
}

const About: NextPage<AboutProps> = ({ aboutData }) => {
  return (
    <section className="flex flex-col items-center justify-center">
      <Header />
      <div className="tablet:px-20">
        {aboutData?.map((element: IntroduceData) => (
          <Introduce key={element.id} Element={element} />
        ))}
      </div>
      <Footer />
    </section>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const response = await import('../../public/mockData/aboutMockData.json');
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

export default About;
