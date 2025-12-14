import React, { useState, KeyboardEvent, useRef } from 'react';
import { Button, Label, Modal } from 'flowbite-react';
import { useQueryClient } from 'react-query';
import { useCreateFolders } from 'service/hooks/List';
import { useToast } from 'components/Shared';

interface TagAddModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const TagAddModal = ({ showModal, setShowModal }: TagAddModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const mutationCreateTagsFolders = useCreateFolders();
  const { showToast } = useToast();

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
            queryClient.invalidateQueries(['tagsFolder']);
            inputRef.current!.value = '';
            setShowModal(false);
          },
          onError: () => {
            showToast(
              '중복된 폴더 이름이거나, 폴더 생성에 실패했습니다.',
              'error'
            );
          },
        }
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
    <Modal
      show={showModal}
      size="md"
      popup={true}
      onClose={() => !isLoading && setShowModal(false)}
      className="dark:bg-gray-900"
    >
      <div className="relative bg-white rounded-lg shadow-xl dark:bg-gray-900">
        <Modal.Header className="p-4 pb-0 border-b-0" />
        <Modal.Body className="px-6 py-4">
          <div className="space-y-8 text-center">
            <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
              새 폴더 만들기
            </h3>
            <p className="text-base text-gray-600 dark:text-gray-400">
              태그를 구성할 새로운 폴더를 만들어보세요
            </p>

            <div className="space-y-3">
              <Label
                htmlFor="folderName"
                value="폴더 이름"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              />
              <input
                ref={inputRef}
                id="folderName"
                type="text"
                className="px-4 py-3 w-full text-base placeholder-gray-400 text-gray-900 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 dark:text-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                placeholder="폴더 이름을 입력하세요"
                onKeyPress={handleKeyPress}
                autoFocus
                disabled={isLoading}
              />
            </div>

            <div className="flex pt-2 space-x-4">
              <Button
                type="button"
                className={`w-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => !isLoading && setShowModal(false)}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button
                type="button"
                className={`w-full bg-blue-600 text-white hover:bg-blue-700 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleAddFolder}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <svg
                      className="mr-3 w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    생성 중...
                  </div>
                ) : (
                  '폴더 만들기'
                )}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default TagAddModal;
