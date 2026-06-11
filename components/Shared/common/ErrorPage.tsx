import React, { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';
import * as Shared from 'components/Shared';

interface Props {
  children: ReactNode;
}

interface ErrorActionCard {
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
  variant?: 'classic' | 'ghost';
  buttonStyle?: React.CSSProperties;
  buttonTextColor?: string;
  buttonClassName?: string;
  cardClassName?: string;
  cardStyle?: React.CSSProperties;
}

interface ErrorScreenProps {
  badgeLabel?: string;
  title: string;
  description: string;
  primaryCard: ErrorActionCard;
  secondaryCard: ErrorActionCard;
}

export const ErrorScreen = ({
  badgeLabel = '시스템 알림',
  title,
  description,
  primaryCard,
  secondaryCard,
}: ErrorScreenProps) => {
  return (
    <div className="min-h-[50vh] w-full flex items-center justify-center bg-[#f7f9fe] px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white px-7 py-8 shadow-[0_8px_32px_rgba(15,23,42,0.08)] flex flex-col items-center text-center gap-5">

        {/* 아이콘 */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-400 border border-red-100">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        {/* 텍스트 */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-500 rounded-full">
            {badgeLabel}
          </div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 leading-relaxed break-keep">{description}</p>
        </div>

        {/* 버튼 2개 가로 나열 */}
        <div className="flex w-full gap-2 pt-1">
          <button
            type="button"
            onClick={secondaryCard.onClick}
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {secondaryCard.buttonLabel}
          </button>
          <button
            type="button"
            onClick={primaryCard.onClick}
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-ftBlue text-white hover:bg-ftBlue/90 transition-colors"
          >
            {primaryCard.buttonLabel}
          </button>
        </div>

      </div>
    </div>
  );
};

// ── 404 전용 풀페이지 컴포넌트 ─────────────────────────────────
export const NotFoundScreen = () => (
  <div
    className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 relative overflow-hidden"
    style={{ background: 'radial-gradient(ellipse at center, #eff6ff 0%, transparent 68%)' }}
  >
    {/* 배경 깊이용 뮤트 숫자 — 시각적 앵커 */}
    <span
      className="pointer-events-none select-none absolute font-black text-blue-100 leading-none"
      style={{ fontSize: 'clamp(12rem, 30vw, 22rem)' }}
      aria-hidden="true"
    >
      404
    </span>

    {/* 실제 콘텐츠 */}
    <div className="relative z-10 flex flex-col items-center text-center gap-4 max-w-md">
      <h1 className="text-2xl font-bold text-gray-900 break-keep">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-sm text-gray-500 leading-relaxed break-keep">
        요청하신 페이지가 존재하지 않거나 주소가 변경되었습니다.
      </p>
      <div className="flex items-center gap-5 mt-2">
        <Link
          href="/"
          className="px-5 py-2.5 text-sm font-bold text-white bg-ftBlue rounded-xl hover:bg-ftBlue/90 transition-colors"
        >
          홈으로 돌아가기
        </Link>
        <Link
          href="/article"
          className="text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors"
        >
          글 목록 보기 →
        </Link>
      </div>
    </div>
  </div>
);

// ── Error Boundary ─────────────────────────────────────────────
interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

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
        <ErrorScreen
          title="접속에 문제가 발생했어요"
          description="예상치 못한 오류가 감지되었습니다. 잠시 후 다시 시도하거나 아래 옵션을 선택해 주세요."
          primaryCard={{
            title: '홈으로 돌아가기',
            description: '안전한 시작 화면으로 복귀합니다.',
            buttonLabel: '홈으로 이동',
            onClick: () => this.handleNavigate('/'),
          }}
          secondaryCard={{
            title: '새로고침',
            description: '현재 페이지를 다시 불러옵니다.',
            buttonLabel: '다시 시도',
            onClick: () => window.location.reload(),
          }}
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
