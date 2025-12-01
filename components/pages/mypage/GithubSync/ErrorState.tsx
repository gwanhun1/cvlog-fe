import { FiAlertTriangle } from 'react-icons/fi';

interface ErrorStateProps {
  onReauthorize: () => void;
  onDisconnect: () => void;
}

const ErrorState = ({ onReauthorize, onDisconnect }: ErrorStateProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center text-amber-600">
        <FiAlertTriangle className="w-5 h-5" />
        <span className="text-sm font-medium">연결 끊김</span>
      </div>

      <p className="text-sm text-gray-600">
        GitHub 저장소에 접근할 수 없습니다. 저장소가 삭제되었거나 권한이
        변경되었을 수 있습니다.
      </p>

      <div className="flex gap-2">
        <button
          onClick={onReauthorize}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg transition-colors hover:bg-gray-800"
        >
          다시 연결
        </button>
        <button
          onClick={onDisconnect}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200"
        >
          연결 해제
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
