'use client';

import * as Shared from 'components/Shared';
import { ReactNode, useState, useEffect } from 'react';

interface Props {
  children: ReactNode;
}

const ErrorBoundary = ({ children }: Props) => {
  const [hasError, setHasError] = useState(false);

  const reportClientError = (payload: Record<string, unknown>) => {
    try {
      const body = JSON.stringify({
        ...payload,
        href: typeof window !== 'undefined' ? window.location.href : undefined,
        pathname:
          typeof window !== 'undefined' ? window.location.pathname : undefined,
        userAgent:
          typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        timestamp: Date.now(),
      });

      if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
        navigator.sendBeacon('/api/client-error', body);
        return;
      }

      fetch('/api/client-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => undefined);
    } catch {
      return;
    }
  };

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error('Uncaught error:', event.error);
      reportClientError({
        type: 'error',
        message: event.error?.message || event.message,
        stack: event.error?.stack,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
      setHasError(true);
    };

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      console.error('Unhandled rejection:', event.reason);

      const reason: unknown = event.reason;
      const message =
        typeof reason === 'object' && reason !== null && 'message' in reason
          ? String((reason as { message: unknown }).message)
          : typeof reason === 'string'
          ? reason
          : String(reason);
      const stack =
        typeof reason === 'object' && reason !== null && 'stack' in reason
          ? String((reason as { stack: unknown }).stack)
          : undefined;

      reportClientError({
        type: 'unhandledrejection',
        reason,
        message,
        stack,
      });
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);
    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
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
