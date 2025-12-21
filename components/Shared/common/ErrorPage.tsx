import React, { Component, ErrorInfo, ReactNode } from 'react';
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
  const renderCard = ({
    title: cardTitle,
    description: cardDescription,
    buttonLabel,
    onClick,
    variant = 'classic',
    buttonStyle,
    buttonTextColor,
    buttonClassName,
    cardClassName,
    cardStyle,
  }: ErrorActionCard) => (
    <div
      className={`flex flex-col gap-4 rounded-2xl border border-gray-100 px-4 py-4 ${
        cardClassName || ''
      }`}
      style={cardStyle}
    >
      <div>
        <Shared.LogmeHeadline type="medium" fontStyle="bold">
          {cardTitle}
        </Shared.LogmeHeadline>
        <Shared.LogmeText
          type="body"
          fontStyle="regular"
          className="text-ftGray"
        >
          {cardDescription}
        </Shared.LogmeText>
      </div>
      <Shared.LogmeButton
        variant={variant}
        size="small"
        onClick={onClick}
        className={`${
          variant === 'ghost' ? 'border border-gray-200 bg-white' : ''
        } ${buttonClassName || ''}`}
        style={buttonStyle}
        fullWidth
      >
        <Shared.LogmeHeadline
          type="medium"
          fontStyle="semibold"
          className="w-full text-center"
          style={
            buttonTextColor
              ? { color: buttonTextColor }
              : variant === 'classic'
              ? { color: '#fff' }
              : undefined
          }
        >
          {buttonLabel}
        </Shared.LogmeHeadline>
      </Shared.LogmeButton>
    </div>
  );

  return (
    <div className="min-h-[50vh] w-full bg-[#f7f9fe] px-3 py-8 text-ftBlack">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-gray-100 bg-white px-6 py-7 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
        <div className="flex gap-4 items-start">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-xl font-bold text-ftBlue shadow-[0_10px_30px_rgba(37,99,235,0.15)]">
            !
          </div>
          <div className="flex-1 space-y-1">
            <div className="inline-flex gap-2 items-center px-3 py-1 text-xs font-semibold bg-blue-50 rounded-full border border-blue-100 text-ftBlue">
              {badgeLabel}
            </div>
            <Shared.LogmeHeadline type="big" fontStyle="bold">
              {title}
            </Shared.LogmeHeadline>
            <Shared.LogmeText
              type="body"
              fontStyle="regular"
              className="text-ftGray"
            >
              {description}
            </Shared.LogmeText>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {renderCard(primaryCard)}
          {renderCard(secondaryCard)}
        </div>
      </div>
    </div>
  );
};

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
