'use client';

import * as Shared from 'components/Shared';
import React, { ReactNode, useState, useEffect } from 'react';

interface Props {
  children: ReactNode;
}

const ErrorBoundary: React.FC<Props> = ({ children }) => {
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

  if (hasError) {
    return (
      <div className="w-full h-80 flex flex-col justify-center items-center">
        <p className="text-xl text-center font-semibold">
          문제가 발생했습니다. <br />
          새로고침 또는 초기페이지로 이동해주세요.
        </p>
        <div className="flex justify-center items-center mt-10">
          <Shared.LogmeButton
            variant="classic"
            size="big"
            onClick={() => handleNavigate('/')}
            style={{ margin: '0 10px' }}
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
    );
  }

  return <>{children}</>;
};

export default ErrorBoundary;
