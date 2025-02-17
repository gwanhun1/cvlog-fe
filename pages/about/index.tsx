import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import axios from 'axios';
import Introduce from '../../components/pages/about/introduce';
import Header from '../../components/pages/about/Header';
import Footer from '../../components/pages/about/Footer';

const About: NextPage = () => {
  const [aboutData, setAboutData] = useState<IntroduceData[]>();

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axios.get('/mockData/aboutMockData.json');
        setAboutData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch about data:', error);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <section className="flex flex-col items-center justify-center">
      <Header />
      <div className="bg-white rounded-xl">
        {aboutData?.map((element: IntroduceData) => (
          <Introduce key={element.id} Element={element} />
        ))}
      </div>
      <Footer />
    </section>
  );
};

export default About;

export interface IntroduceData {
  id: number;
  src: string;
  title: string;
  message: string;
  messageBr: string;
}
