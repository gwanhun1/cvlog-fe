import { useLike } from 'hooks/useLike';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';

interface LogmeLikeBtnProps {
  isOwnPost: boolean;
  postId: number;
}

const LogmeLikeBtn = ({ isOwnPost, postId }: LogmeLikeBtnProps) => {
  const { isLiked, isDisliked, toggleLike, isLoading } = useLike(postId);

  if (isOwnPost) return null;

  return (
    <div className="flex gap-3 flex-col items-center justify-center border border-gray-200 rounded-lg w-20 h-40">
      <button
        onClick={() => toggleLike('like')}
        disabled={isLoading}
        className={`transform transition-all duration-200 hover:scale-110 ${
          isLiked ? 'text-blue-500 scale-110' : 'text-gray-500'
        }`}
      >
        <AiFillLike size={24} />
      </button>
      <button
        onClick={() => toggleLike('dislike')}
        disabled={isLoading}
        className={`transform transition-all duration-200 hover:scale-110 ${
          isDisliked ? 'text-red-500 scale-110' : 'text-gray-500'
        }`}
      >
        <AiFillDislike size={24} />
      </button>
    </div>
  );
};

export default LogmeLikeBtn;
