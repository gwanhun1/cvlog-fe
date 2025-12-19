import React, { useEffect, useMemo, useState } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import { useUpdateUserDescription } from 'service/hooks/Login';
import { useToast } from 'components/Shared';

interface HomeSectionProps {
  description: string | null | undefined;
}

const HomeSection = ({ description }: HomeSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentDescription, setCurrentDescription] = useState(
    description || ''
  );
  const { showToast } = useToast();

  useEffect(() => {
    setCurrentDescription(description || '');
  }, [description]);

  const updateDescriptionMutation = useUpdateUserDescription();
  const isSaving = updateDescriptionMutation.isLoading;

  const initialDescription = useMemo(() => description || '', [description]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDescription(e.target.value);
  };

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
    <section className="p-8 bg-white rounded-xl border border-blue-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">자기소개</h2>
        {!isEditing ? (
          <button
            onClick={handleEditClick}
            className="p-2 text-gray-500 rounded-lg transition-colors hover:bg-gray-100"
          >
            <FiEdit3 className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancelClick}
              disabled={isSaving}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200 disabled:opacity-60"
            >
              취소
            </button>
            <button
              onClick={handleSaveClick}
              disabled={isSaving}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 disabled:opacity-60"
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
          className="w-full min-h-[120px] p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="자기소개를 작성해주세요."
          maxLength={300}
        />
      ) : (
        <p className="leading-relaxed text-gray-600 whitespace-pre-line">
          {currentDescription || '자기소개를 작성해주세요.'}
        </p>
      )}
    </section>
  );
};

export default HomeSection;
