import React, { useState, KeyboardEvent, useRef } from 'react';
import { Button, Label } from 'flowbite-react';
import { Modal } from 'flowbite-react';
import { useQueryClient } from 'react-query';
import { useCreateFolders } from 'service/hooks/List';

const CVModal = (props: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { showModal, setShowModal } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const mutationCreateTagsFolders = useCreateFolders();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddFolder = async () => {
    if (!inputRef.current?.value.trim()) return;

    setIsLoading(true);
    try {
      await mutationCreateTagsFolders.mutateAsync(
        { name: inputRef.current.value.trim() },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(['tagsFolder']);
            if (inputRef.current) inputRef.current.value = '';
            setShowModal(false);
          },
          onError: () => {
            alert('중복된 폴더 이름이거나, 폴더 생성에 실패했습니다.');
          },
        }
      );
    } finally {
      setIsLoading(false);
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
      onClose={() => setShowModal(false)}
      className="dark:bg-gray-900"
    >
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl">
        <Modal.Header className="px-6 pt-6 pb-0 border-b-0">
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            onClick={() => setShowModal(false)}
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </Modal.Header>
        <Modal.Body className="px-6 py-4">
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                새 폴더 만들기
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400">
                태그를 구성할 새로운 폴더를 만들어보세요
              </p>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="folderName"
                value="폴더 이름"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              />
              <div className="relative">
                <input
                  ref={inputRef}
                  id="folderName"
                  type="text"
                  className="w-full px-4 py-3 text-base text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="폴더 이름을 입력하세요"
                  onKeyPress={handleKeyPress}
                  autoFocus
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-2">
              <button
                type="button"
                className="w-full px-4 py-3 text-base font-medium rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
                onClick={() => setShowModal(false)}
              >
                취소
              </button>
              <button
                type="button"
                className={`w-full px-4 py-3 text-base font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLoading ? 'cursor-not-allowed' : ''
                }`}
                onClick={handleAddFolder}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-3 animate-spin"
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
              </button>
            </div>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default CVModal;
