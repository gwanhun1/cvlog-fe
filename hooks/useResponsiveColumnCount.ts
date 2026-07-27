import { useEffect, useLayoutEffect, useState } from 'react';

// tailwind.config.js의 tablet(1024px)/desktop(1440px) 브레이크포인트와 맞춘 컬럼 수.
// PostListView의 columns-1/tablet:columns-2/desktop:columns-3 과 동일한 값을 반환한다.
const getColumnCount = (width: number) => {
  if (width >= 1440) return 3;
  if (width >= 1024) return 2;
  return 1;
};

// 서버에서는 뷰포트를 알 수 없으므로 useLayoutEffect가 경고를 내지 않도록 분기한다.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * 해결되기 전(SSR·하이드레이션 직전)에는 null을 반환한다.
 * 호출부는 null일 때 CSS 멀티컬럼 레이아웃으로 렌더해야 한다.
 * 서버가 임의의 컬럼 수(예: 1)로 마크업을 뱉으면 데스크톱에서 한 줄로 쌓였다가
 * 하이드레이션 후 3열로 튀는 현상이 생기기 때문이다.
 */
export const useResponsiveColumnCount = () => {
  const [columnCount, setColumnCount] = useState<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    const updateColumnCount = () => {
      setColumnCount(getColumnCount(window.innerWidth));
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  return columnCount;
};
