import React, { useState } from 'react';
import { Button } from 'flowbite-react';
import { Modal } from 'flowbite-react';
import { Folder } from 'service/api/tag/type';
import { useGetFolders, useRemoveFolders } from 'service/hooks/List';

interface CVRemoveModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CVRemoveModal: React.FC<CVRemoveModalProps> = ({
  showModal,
  setShowModal,
}) => {
  const [selectFolder, setSelectFolder] = useState<number>(0);

  const removeTagsFolders = useRemoveFolders(selectFolder);
  const queryGetTagsFolders = useGetFolders();

  const closeModal = () => {
    setShowModal(false);
  };

  const removeFolder = async () => {
    if (selectFolder === 0) return;

    try {
      await removeTagsFolders.mutate();
      setSelectFolder(0);
      setShowModal(false);
    } catch (error) {
      console.error('Error removing folder:', error);
    }
  };

  const getEmptyFolders = () => {
    if (!queryGetTagsFolders.data) return [];

    return queryGetTagsFolders.data.filter(
      (folder): folder is Folder =>
        Array.isArray(folder.tags) && folder.tags.length === 0,
    );
  };

  const emptyFolders = getEmptyFolders();

  return (
    <Modal
      show={showModal}
      size="md"
      popup={true}
      onClose={closeModal}
      className="dark"
    >
      <Modal.Header>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          폴더 삭제
        </h3>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col items-center">
          {emptyFolders.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                삭제할 폴더를 선택하세요.
              </p>
              <div className="w-full max-h-60 overflow-auto border border-gray-700 rounded-lg bg-gray-800 p-2">
                {emptyFolders.map(({ id: folderId, name: folder }) => (
                  <div
                    key={folderId}
                    className={`mt-1 flex justify-between items-center h-12 px-4 rounded-lg cursor-pointer transition ${
                      folderId === selectFolder
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                    onClick={() => setSelectFolder(folderId)}
                  >
                    <span className="text-base">{folder}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end w-full mt-4 space-x-2">
                <Button color="gray" onClick={closeModal}>
                  취소
                </Button>
                <Button
                  color="red"
                  onClick={removeFolder}
                  disabled={selectFolder === 0}
                >
                  삭제
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-400">삭제할 폴더가 없습니다.</p>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CVRemoveModal;
