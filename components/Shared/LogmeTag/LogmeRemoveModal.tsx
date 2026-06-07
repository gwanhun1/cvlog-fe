import React, { useState } from 'react';
import { Folder } from 'service/api/tag/type';
import { useGetFolders, useRemoveFolders } from 'service/hooks/List';
import { useQueryClient } from '@tanstack/react-query';
import BaseModal from 'components/Shared/common/BaseModal';

interface TagRemoveModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const TagRemoveModal: React.FC<TagRemoveModalProps> = ({ showModal, setShowModal }) => {
  const [selectFolder, setSelectFolder] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { data: folders } = useGetFolders();
  const queryClient = useQueryClient();
  const removeTagsFolders = useRemoveFolders(selectFolder);

  const handleClose = () => !isLoading && setShowModal(false);

  const removeFolder = async () => {
    if (selectFolder === 0) return;
    setIsLoading(true);
    document.body.style.cursor = 'wait';
    try {
      await removeTagsFolders.mutateAsync(undefined, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['tagsFolder'] });
          setSelectFolder(0);
          setShowModal(false);
        },
      });
    } finally {
      setIsLoading(false);
      document.body.style.cursor = 'default';
    }
  };

  const emptyFolders =
    folders?.filter(
      (folder): folder is Folder =>
        folder && Array.isArray(folder.tags) && folder.tags.length === 0 && folder.id !== 999,
    ) || [];

  return (
    <BaseModal show={showModal} onClose={handleClose}>
      <div className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-gray-900">폴더 삭제</h3>
          {emptyFolders.length > 0 && (
            <p className="text-sm text-gray-500">삭제할 폴더를 선택하세요.</p>
          )}
        </div>

        {emptyFolders.length > 0 ? (
          <>
            <div className="max-h-60 overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-2 space-y-1">
              {emptyFolders.map(({ id: folderId, name }) => (
                <button
                  key={folderId}
                  type="button"
                  onClick={() => !isLoading && setSelectFolder(folderId)}
                  disabled={isLoading}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    folderId === selectFolder
                      ? 'bg-ftBlue text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <svg
                    className={`w-4 h-4 flex-shrink-0 ${folderId === selectFolder ? 'text-white' : 'text-gray-400'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  {name}
                </button>
              ))}
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
                onClick={removeFolder}
                disabled={selectFolder === 0 || isLoading}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    삭제 중...
                  </span>
                ) : (
                  '삭제'
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-24 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-500">삭제할 폴더가 없습니다.</p>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default TagRemoveModal;
