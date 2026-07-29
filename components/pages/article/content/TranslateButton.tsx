import { TranslationStatus } from 'hooks/useArticleTranslation';

interface TranslateButtonProps {
  status: TranslationStatus;
  progress: number;
  /** 방문자 브라우저 언어 이름 (예: English, 日本語) */
  targetLabel: string;
  isTranslated: boolean;
  isBusy: boolean;
  onClick: () => void;
}

const getLabel = (
  status: TranslationStatus,
  progress: number,
  targetLabel: string,
  isTranslated: boolean
) => {
  // 최초 1회만 번역 모델을 내려받는다
  if (status === 'preparing') {
    return progress > 0 ? `${progress}%` : '준비 중...';
  }
  if (status === 'translating') return '번역 중...';
  if (status === 'error') return '다시 시도';
  return isTranslated ? '원문 보기' : targetLabel;
};

const TranslateButton = ({
  status,
  progress,
  targetLabel,
  isTranslated,
  isBusy,
  onClick,
}: TranslateButtonProps) => {
  // 지원 여부 확인 전(checking)에도 그리지 않아야 미지원 브라우저에서 깜빡이지 않는다.
  // 미지원 환경에서는 브라우저 자체 번역 기능이 대신 동작한다.
  if (status === 'checking' || status === 'unsupported') return null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isBusy}
      title={isTranslated ? '한국어 원문으로 되돌리기' : `${targetLabel}(으)로 번역`}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
        isTranslated
          ? 'text-ftBlue border-ftBlue/30 bg-ftBlue/5 hover:bg-ftBlue/10'
          : 'text-gray-500 border-gray-200 hover:bg-gray-50'
      }`}
      aria-live="polite"
    >
      <svg
        className={`w-3.5 h-3.5 flex-shrink-0 ${isBusy ? 'animate-spin' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {isBusy ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        )}
      </svg>
      {getLabel(status, progress, targetLabel, isTranslated)}
    </button>
  );
};

export default TranslateButton;
