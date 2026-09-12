import { FiCheck, FiExternalLink } from 'react-icons/fi';

interface ConnectedStateProps {
  repoName: string;
  syncedPostCount: number;
  onDisconnect: () => void;
}

const ConnectedState = ({
  repoName,
  syncedPostCount,
  onDisconnect,
}: ConnectedStateProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center text-green-600">
        <FiCheck className="w-5 h-5" />
        <span className="text-sm font-medium">연결됨</span>
      </div>

      <div className="p-4 space-y-2 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">저장소</span>
          <a
            href={`https://github.com/${repoName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-1 items-center text-sm text-blue-600 hover:underline"
          >
            {repoName}
            <FiExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">동기화된 글</span>
          <span className="text-sm font-medium text-gray-900">
            {syncedPostCount}개
          </span>
        </div>
      </div>

      <button
        onClick={onDisconnect}
        className="px-4 py-2 w-full text-sm font-medium text-red-600 bg-red-50 rounded-lg transition-colors hover:bg-red-100"
      >
        연결 해제
      </button>
    </div>
  );
};

export default ConnectedState;
