import React, { useState, KeyboardEvent, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateFolders } from 'service/hooks/List';
import { useToast } from 'components/Shared';
import BaseModal from 'components/Shared/common/BaseModal';

interface TagAddModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const TagAddModal = ({ showModal, setShowModal }: TagAddModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const mutationCreateTagsFolders = useCreateFolders();
  const { showToast } = useToast();

  const handleClose = () => !isLoading && setShowModal(false);

  const handleAddFolder = async () => {
    const folderName = inputRef.current?.value.trim();
    if (!folderName) return;
    if (folderName === '미할당') {
      showToast('생성할 수 없는 이름입니다.', 'warning');
      return;
    }

    setIsLoading(true);
    document.body.style.cursor = 'wait';
    try {
      await mutationCreateTagsFolders.mutateAsync(
        { name: folderName },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tagsFolder'] });
            inputRef.current!.value = '';
            setShowModal(false);
          },
          onError: () => {
            showToast('중복된 폴더 이름이거나, 폴더 생성에 실패했습니다.', 'error');
          },
        },
      );
    } finally {
      setIsLoading(false);
      document.body.style.cursor = 'default';
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddFolder();
    }
  };

  return (
    <BaseModal show={showModal} onClose={handleClose}>
      <div className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-gray-900">새 폴더 만들기</h3>
          <p className="text-sm text-gray-500">태그를 구성할 새로운 폴더를 만들어보세요</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="folderName" className="block text-sm font-medium text-gray-700">
            폴더 이름
          </label>
          <input
            ref={inputRef}
            id="folderName"
            type="text"
            className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ftBlue/40 focus:border-ftBlue/50 transition-all placeholder-gray-400 disabled:opacity-50"
            placeholder="폴더 이름을 입력하세요"
            onKeyDown={handleKeyPress}
            autoFocus
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleAddFolder}
            disabled={isLoading}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-ftBlue rounded-xl hover:bg-[#1f4a8c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                생성 중...
              </span>
            ) : (
              '폴더 만들기'
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default TagAddModal;
