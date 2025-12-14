'use client';

import * as Shared from 'components/Shared';
import { ReactNode, useState, useEffect } from 'react';

interface Props {
  children: ReactNode;
}

const ErrorBoundary = ({ children }: Props) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error('Uncaught error:', event.error);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  if (!hasError) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6">
      <div className="p-8 space-y-6 w-full max-w-xl text-center rounded-2xl border shadow-lg backdrop-blur bg-white/80 border-slate-100 sm:p-10">
        <div className="inline-flex justify-center items-center w-14 h-14 text-2xl text-blue-600 bg-blue-100 rounded-full shadow-inner">
          !
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            문제가 발생했어요
          </h2>
          <p className="text-sm leading-relaxed sm:text-base text-slate-600">
            예기치 못한 오류가 발생했습니다. 새로고침하거나 홈으로 이동해 다시
            시도해 주세요.
          </p>
        </div>
        <div className="flex flex-col gap-3 justify-center items-center sm:flex-row sm:gap-4">
          <Shared.LogmeButton
            variant="classic"
            size="big"
            onClick={() => handleNavigate('/')}
            style={{ minWidth: '140px' }}
          >
            <Shared.LogmeHeadline
              type="medium"
              fontStyle="semibold"
              style={{ color: '#fff' }}
            >
              홈으로 이동
            </Shared.LogmeHeadline>
          </Shared.LogmeButton>

          <Shared.LogmeButton
            variant="classic"
            size="big"
            onClick={() => window.location.reload()}
            style={{ minWidth: '140px' }}
          >
            <Shared.LogmeHeadline
              type="medium"
              fontStyle="semibold"
              style={{ color: '#fff' }}
            >
              새로고침
            </Shared.LogmeHeadline>
          </Shared.LogmeButton>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
