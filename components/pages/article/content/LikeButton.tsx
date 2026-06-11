import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { useToggleLike } from 'service/hooks/Like';

interface LikeButtonProps {
  postId: number;
  initialLiked: boolean;
  initialCount: number;
  isPublic: boolean;
  currentUserId?: number;
  isInHeader?: boolean;
}

const LikeButton = ({
  postId,
  initialLiked,
  initialCount,
  isPublic,
  currentUserId,
  isInHeader = false,
}: LikeButtonProps) => {
  const router = useRouter();
  const { mutate: toggleLike, isPending } = useToggleLike(postId);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setIsLiked(initialLiked);
    setCount(initialCount);
  }, [initialLiked, initialCount]);

  if (!isPublic) return null;

  const isLoggedIn = !!currentUserId;

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    if (isPending) return;
    toggleLike();
  };

  const buttonClasses = isInHeader
    ? `flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg border transition-all focus-visible:ring-2 focus-visible:ring-ftBlue focus-visible:outline-none disabled:opacity-60 disabled:cursor-not-allowed ${
        isLiked
          ? 'text-red-500 border-red-200 bg-red-50'
          : 'text-gray-400 border-gray-200 hover:border-red-200 hover:text-red-400'
      }`
    : `flex items-center gap-2 px-5 py-2 text-sm rounded-lg border transition-all focus-visible:ring-2 focus-visible:ring-ftBlue focus-visible:outline-none disabled:opacity-70 disabled:cursor-not-allowed ${
        isLiked
          ? 'text-red-500 border-red-200 bg-red-50'
          : 'text-gray-500 border-gray-200 hover:border-ftBlue/40 hover:text-ftBlue hover:bg-ftBlue/5'
      }`;

  if (!isLoggedIn) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={false}
        className={`flex items-center gap-1.5 rounded-lg border transition-all focus-visible:ring-2 focus-visible:ring-ftBlue focus-visible:outline-none ${
          isInHeader
            ? 'px-3 py-1 text-xs border-gray-200 text-gray-400 hover:bg-gray-50'
            : 'px-5 py-2 text-sm border-gray-200 text-gray-400 hover:bg-gray-50'
        }`}
      >
        <AiOutlineHeart className={isInHeader ? 'text-sm flex-shrink-0' : 'text-base flex-shrink-0'} />
        <span>{count}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={isLiked}
      className={buttonClasses}
    >
      <motion.div
        animate={{ scale: isLiked ? 1.2 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 12 }}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {isLiked ? (
          <AiFillHeart className={isInHeader ? 'text-sm' : 'text-base'} />
        ) : (
          <AiOutlineHeart className={isInHeader ? 'text-sm' : 'text-base'} />
        )}
      </motion.div>
      <span>{count}</span>
    </button>
  );
};

export default LikeButton;
