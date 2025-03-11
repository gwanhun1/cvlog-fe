import React, { useState } from 'react';
import { Modal } from 'flowbite-react';
import { Folder } from 'service/api/tag/type';
import { useGetFolders, useRemoveFolders } from 'service/hooks/List';
import { useQueryClient } from 'react-query';

interface TagRemoveModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const TagRemoveModal: React.FC<TagRemoveModalProps> = ({
  showModal,
  setShowModal,
}) => {
  const [selectFolder, setSelectFolder] = useState<number>(0);

  const { data: folders } = useGetFolders();
  const queryClient = useQueryClient();

  const removeTagsFolders = useRemoveFolders(selectFolder);

  const closeModal = () => setShowModal(false);

  const removeFolder = async () => {
    if (selectFolder === 0) return;

    try {
      await removeTagsFolders.mutate();
      setSelectFolder(0);
      setShowModal(false);
      queryClient.invalidateQueries('tagsFolder');
    } catch (error) {
      console.error('Error removing folder:', error);
    }
  };

  const emptyFolders =
    folders?.filter(
      (folder): folder is Folder =>
        folder && Array.isArray(folder.tags) && folder.tags.length === 0
    ) || [];

  return (
    <Modal
      show={showModal}
      size="md"
      popup={true}
      onClose={closeModal}
      className="dark:bg-gray-900"
    >
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl">
        <Modal.Header className="p-4 pb-0 border-b-0" />
        <Modal.Body className="px-6 py-4">
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                폴더 삭제
              </h3>
              {emptyFolders.length > 0 && (
                <p className="text-base text-gray-600 dark:text-gray-400">
                  삭제할 폴더를 선택하세요.
                </p>
              )}
            </div>

            <div className="flex flex-col items-center">
              {emptyFolders.length > 0 ? (
                <>
                  <div className="w-full max-h-60 overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3">
                    {emptyFolders.map(({ id: folderId, name }) => (
                      <div
                        key={folderId}
                        className={`group flex justify-between items-center h-14 px-4 rounded-xl cursor-pointer transition-all duration-200 mb-2 last:mb-0 ${
                          folderId === selectFolder
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                        onClick={() => setSelectFolder(folderId)}
                      >
                        <div className="flex items-center space-x-3">
                          <svg
                            className={`w-5 h-5 ${
                              folderId === selectFolder
                                ? 'text-white'
                                : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                            />
                          </svg>
                          <span className="text-base font-medium">{name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-4 w-full mt-6">
                    <button
                      type="button"
                      className="w-full px-4 py-3 text-base font-medium rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
                      onClick={closeModal}
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      className={`w-full px-4 py-3 text-base font-medium rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectFolder === 0 ? 'cursor-not-allowed' : ''
                      }`}
                      onClick={removeFolder}
                      disabled={selectFolder === 0}
                    >
                      삭제
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center w-full h-32 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <p className="text-base text-gray-500 dark:text-gray-400">
                    삭제할 폴더가 없습니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default TagRemoveModal;
