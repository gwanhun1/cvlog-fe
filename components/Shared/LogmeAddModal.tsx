import React, { useState, KeyboardEvent, useRef } from 'react';
import { Button, Label } from 'flowbite-react';
import { Modal } from 'flowbite-react';
import { useQueryClient } from 'react-query';
import { useCreateFolders, useGetFolders } from 'service/hooks/List';

const CVModal = (props: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { showModal, setShowModal } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const queryGetTagsFolders = useGetFolders();
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
            queryGetTagsFolders.refetch();
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
      className="dark"
    >
      <Modal.Header className="px-6 pt-4 pb-0 border-b-0" />
      <Modal.Body className="px-6 py-4">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              새 폴더 만들기
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              태그를 구성할 새로운 폴더를 만들어보세요
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="folderName"
              value="폴더 이름"
              className="text-sm font-medium text-gray-900 dark:text-white"
            />
            <input
              ref={inputRef}
              id="folderName"
              type="text"
              className="w-full px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600"
              placeholder="폴더 이름을 입력하세요"
              onKeyPress={handleKeyPress}
              autoFocus
            />
          </div>

          <div className="flex space-x-3">
            <Button
              color="gray"
              className="w-full"
              onClick={() => setShowModal(false)}
            >
              취소
            </Button>
            <Button
              className="w-full"
              onClick={handleAddFolder}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2 animate-spin"
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
    </Modal>
  );
};

export default CVModal;
