import React, { useEffect, useMemo, useState } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import { useUpdateUserDescription } from 'service/hooks/Login';
import { useToast } from 'components/Shared';

interface HomeSectionProps {
  description: string | null | undefined;
}

const HomeSection = ({ description }: HomeSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentDescription, setCurrentDescription] = useState(description || '');
  const { showToast } = useToast();

  useEffect(() => {
    setCurrentDescription(description || '');
  }, [description]);

  const updateDescriptionMutation = useUpdateUserDescription();
  const isSaving = updateDescriptionMutation.isPending;
  const initialDescription = useMemo(() => description || '', [description]);

  const handleSaveClick = () => {
    if (currentDescription.trim() === initialDescription.trim()) {
      setIsEditing(false);
      return;
    }
    updateDescriptionMutation.mutate(currentDescription, {
      onSuccess: () => {
        setIsEditing(false);
        showToast('자기소개가 저장되었습니다.', 'success');
      },
      onError: error => {
        console.error('자기소개 저장 중 오류가 발생했습니다:', error);
        showToast('자기소개 저장 중 오류가 발생했습니다.', 'error');
      },
    });
  };

  const handleCancelClick = () => {
    setCurrentDescription(initialDescription);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm font-semibold text-gray-700">자기소개</div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-gray-400 rounded-lg transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <FiEdit3 className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancelClick}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200 disabled:opacity-60"
            >
              취소
            </button>
            <button
              onClick={handleSaveClick}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm text-white bg-ftBlue rounded-lg transition-colors hover:bg-[#1f4a8c] disabled:opacity-60"
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <textarea
          value={currentDescription}
          onChange={e => setCurrentDescription(e.target.value)}
          className="w-full min-h-[100px] p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ftBlue/20 focus:border-ftBlue/40 resize-none text-sm text-gray-700"
          placeholder="자기소개를 작성해주세요."
          maxLength={300}
        />
      ) : (
        <div className="text-sm leading-relaxed text-gray-500 whitespace-pre-line min-h-[60px]">
          {currentDescription || <span className="text-gray-300">자기소개를 작성해주세요.</span>}
        </div>
      )}
    </div>
  );
};

export default HomeSection;
