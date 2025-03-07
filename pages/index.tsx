import type { GetStaticProps, NextPage } from 'next';
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
    <section className="flex flex-col items-center justify-center">
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
