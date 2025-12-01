import { FiGithub, FiAlertTriangle } from 'react-icons/fi';

interface DisconnectedStateProps {
  repoName: string;
  setRepoName: (name: string) => void;
  error: string | null;
  clearError: () => void;
  isCreating: boolean;
  onCreateRepo: () => void;
}

const DisconnectedState = ({
  repoName,
  setRepoName,
  error,
  clearError,
  isCreating,
  onCreateRepo,
}: DisconnectedStateProps) => {
  return (
    <>
      <p className="mb-4 text-sm text-gray-600">
        게시글을 GitHub 저장소에 마크다운 파일로 자동 백업합니다.
      </p>

      <div className="space-y-3">
        <div>
          <label
            htmlFor="repoName"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            저장소 이름
          </label>
          <input
            id="repoName"
            type="text"
            value={repoName}
            onChange={e => {
              setRepoName(e.target.value);
              clearError();
            }}
            placeholder="my-blog-posts"
            className="px-3 py-2 w-full text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            영문, 숫자, 하이픈(-), 언더스코어(_) 사용 가능
          </p>
        </div>

        {error && (
          <p className="flex gap-1 items-center text-sm text-red-500">
            <FiAlertTriangle className="w-4 h-4" />
            {error}
          </p>
        )}

        <button
          onClick={onCreateRepo}
          disabled={isCreating || !repoName.trim()}
          className="flex gap-2 justify-center items-center px-4 py-3 w-full text-sm font-medium text-white bg-gray-900 rounded-lg transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
              저장소 생성 중...
            </>
          ) : (
            <>
              <FiGithub className="w-4 h-4" />
              저장소 생성 및 연결
            </>
          )}
        </button>

        <p className="text-xs leading-relaxed text-gray-500">
          ⚠️ 저장소 생성을 위해 GitHub 추가 권한이 필요할 수 있습니다.
        </p>
      </div>
    </>
  );
};

export default DisconnectedState;
