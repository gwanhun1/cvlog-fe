import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

//클라이언트 사이드에서만 로드하도록 설정
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

  if (!animationData) {
    return (
      <div className="w-60 h-60 animate-pulse bg-gray-200 rounded-full"></div>
    );
  }

  return (
    <LottieWithNoSSR
      animationData={animationData}
      loop={true}
      className="w-60 h-60"
    />
  );
};

export default LoaderAnimation;
