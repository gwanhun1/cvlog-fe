import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Loader from './Loader';

// 클라이언트 사이드에서만 로드
const LottieWithNoSSR = dynamic(() => import('lottie-react'), {
  ssr: false,
});

const LoaderAnimation = () => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    import('../../../public/assets/LoaderAnimation.json').then(data => {
      setAnimationData(data.default);
    });
  }, []);

  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-md">
      {animationData ? (
        <LottieWithNoSSR
          animationData={animationData}
          loop={true}
          className="w-72 h-72 tablet:w-128 tablet:h-128"
        />
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default LoaderAnimation;
