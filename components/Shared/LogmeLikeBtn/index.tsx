import * as Shared from 'components/Shared';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface LogmeLikeBtnProps {
  isOwnPost: boolean;
  postId: string;
}

const LogmeLikeBtn = ({ isOwnPost, postId }: LogmeLikeBtnProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(`/api/likes/${postId}`);
        setIsLiked(response.data.isLiked);
        setIsDisliked(response.data.isDisliked);
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    if (!isOwnPost && postId) {
      fetchLikeStatus();
    }
  }, [isOwnPost, postId]);

  const handleLikeClick = async (type: 'like' | 'dislike') => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await axios.post(`/api/likes/${postId}`, { type });
      if (type === 'like') {
        setIsLiked(!isLiked);
        setIsDisliked(false);
      } else {
        setIsDisliked(!isDisliked);
        setIsLiked(false);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('좋아요 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isOwnPost) return null;

  return (
    <div className="flex gap-3 flex-col items-center justify-center border border-gray-200 rounded-lg w-24 h-44">
      <button
        onClick={() => handleLikeClick('like')}
        disabled={isLoading}
        className={`transform transition-all duration-200 hover:scale-110 ${
          isLiked ? 'text-blue-500 scale-110' : 'text-gray-500'
        }`}
      >
        <Shared.LogmeIcon.LikeIcon alt="like" width={70} height={70} />
      </button>
      <button
        onClick={() => handleLikeClick('dislike')}
        disabled={isLoading}
        className={`opacity-20 transform transition-all duration-200 hover:scale-110 ${
          isDisliked ? 'text-red-500 scale-110' : 'text-gray-500'
        }`}
      >
        <Shared.LogmeIcon.DisLikeIcon alt="disLike" width={70} height={70} />
      </button>
    </div>
  );
};

export default LogmeLikeBtn;
