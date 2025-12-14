import React, { useEffect, useState } from 'react';
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

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDescription(e.target.value);
  };

  const handleSaveClick = () => {
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
  console.log(description);
  console.log(currentDescription);

  return (
    <section className="bg-white rounded-xl p-8 shadow-sm border border-blue-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">자기소개</h2>
        {!isEditing ? (
          <button
            onClick={handleEditClick}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiEdit3 className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleSaveClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            저장
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={currentDescription}
            onChange={handleInputChange}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="자기소개를 작성해주세요."
            style={{ border: '1px solid lightgray' }}
          />
        </div>
      ) : (
        <p className="text-gray-600 whitespace-pre-line leading-relaxed">
          {currentDescription || '자기소개를 작성해주세요.'}
        </p>
      )}
    </section>
  );
};

export default HomeSection;
