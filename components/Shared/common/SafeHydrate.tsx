import React from 'react';

// 서버에서도 children을 렌더링해야 SEO 메타태그/본문이 HTML에 포함된다.
// (mounted 가드로 null을 반환하면 SSR/SSG 결과물이 빈 페이지가 되어 검색엔진에 노출되지 않음)
export const SafeHydrate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div suppressHydrationWarning className="bg-[#fafaff] min-h-screen">
      {children}
    </div>
  );
};
export default SafeHydrate;
