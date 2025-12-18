import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Shared from 'components/Shared';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleNavigate = (path: string) => {
    window.location.href = path;
  };

  public render() {
    if (this.state.hasError) {
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
                예기치 못한 오류가 발생했습니다. 새로고침하거나 홈으로 이동해
                다시 시도해 주세요.
              </p>
            </div>
            <div className="flex flex-col gap-3 justify-center items-center sm:flex-row sm:gap-4">
              <Shared.LogmeButton
                variant="classic"
                size="big"
                onClick={() => this.handleNavigate('/')}
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
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
