import { useEffect, useState } from 'react';

/**
 * 글 상세 페이지 상단에 고정되는 읽기 진행률 바.
 * 페이지 스크롤 위치에 따라 0~100%로 채워진다. 순수 클라이언트 계산(외부 호출 0).
 */
const ReadingProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollable = el.scrollHeight - el.clientHeight;
      const pct = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-ftBlue transition-[width] duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ReadingProgressBar;
