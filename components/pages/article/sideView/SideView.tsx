import { useCallback, useEffect, useState } from 'react';
import { Droppable, DropResult, DragDropContext } from '@hello-pangea/dnd';
import LogmeAddModal from 'components/Shared/LogmeTag/LogmeAddModal';
import LogmeRemoveModal from 'components/Shared/LogmeTag/LogmeRemoveModal';
import { Folder, UpdateForm } from 'service/api/tag/type';
import { useGetFolders, usePutTagsFolder } from 'service/hooks/List';
import FolderItem from './FolderItem';
import TagItem from './TagItem';
import SideViewHeader from './SideViewHeader';

const SideMenu = () => {
  const queryGetTagsFolders = useGetFolders();
  const mutationUpdateTagsFolders = usePutTagsFolder();

  const [closedIdx, setClosedIdx] = useState<number[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectModal, setSelectModal] = useState<string>('');
  const [winReady, setwinReady] = useState(false);

  const namedFolder =
    queryGetTagsFolders.data?.filter(item => item.name !== '') ?? [];
  const defaultFolder =
    queryGetTagsFolders.data?.filter(item => item.name === '') ?? [];

  const onClickAccordion = useCallback(
    (id: number) => (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setClosedIdx(prev => {
        const hasId = prev.includes(id);
        return hasId ? prev.filter(storedId => storedId !== id) : [...prev, id];
      });
    },
    []
  );

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result;
      if (!destination) return;

      const sourceFolder = queryGetTagsFolders.data?.find(
        folder => folder.id.toString() === source.droppableId
      );

      const destinationFolder = queryGetTagsFolders.data?.find(
        folder => folder.id.toString() === destination.droppableId
      );

      const setForm: UpdateForm = {
        tag_id: sourceFolder?.tags[result.source.index].id,
        folder_id: destinationFolder?.id,
      };

      mutationUpdateTagsFolders.mutate(setForm);
    },
    [mutationUpdateTagsFolders, queryGetTagsFolders.data]
  );

  const tryOpenModal = useCallback((name: string) => {
    setSelectModal(name);
    setShowModal(true);
  }, []);

  useEffect(() => {
    setwinReady(true);
  }, []);

  if (!winReady) return null;

  if (queryGetTagsFolders.isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl mb-3"></div>
            <div className="space-y-3 pl-4">
              <div className="h-10 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg w-[90%]"></div>
              <div className="h-10 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg w-[85%]"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (queryGetTagsFolders.isError) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          데이터를 불러올 수 없습니다
        </h3>
        <p className="text-gray-500 mb-6">잠시 후 다시 시도해주세요</p>
        <button
          onClick={() => queryGetTagsFolders.refetch()}
          className="inline-flex items-center px-4 py-2 bg-white border border-red-200 rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-300"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          다시 시도
        </button>
      </div>
    );
  }

  const hasContent = namedFolder.length > 0 || defaultFolder.length > 0;

  return (
    <>
      {selectModal === 'add' && (
        <LogmeAddModal showModal={showModal} setShowModal={setShowModal} />
      )}
      {selectModal === 'delete' && (
        <LogmeRemoveModal showModal={showModal} setShowModal={setShowModal} />
      )}

      <div className="sticky top-24 w-full max-w-xs bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <SideViewHeader
          hasContent={hasContent}
          onAddClick={() => tryOpenModal('add')}
          onDeleteClick={() => tryOpenModal('delete')}
        />

        <div className="p-6">
          {!hasContent ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                태그가 없습니다
              </h3>
              <p className="text-gray-500 mb-6">첫 번째 태그를 만들어보세요!</p>
              <button
                onClick={() => tryOpenModal('add')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-200"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                새 태그 만들기
              </button>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="space-y-4">
                {namedFolder.map((folder: Folder) => {
                  const isOpened = closedIdx.includes(folder.id);
                  return (
                    <Droppable
                      droppableId={folder.id.toString()}
                      type="SIDEBAR_Folder"
                      key={folder.id}
                    >
                      {provided => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="mb-6 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                        >
                          <FolderItem
                            folder={folder}
                            isOpened={isOpened}
                            onClickAccordion={onClickAccordion}
                          />
                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              isOpened ? 'max-h-0' : 'max-h-[500px]'
                            }`}
                          >
                            {folder.tags.map((tag, index) => (
                              <TagItem
                                key={tag.id}
                                tag={tag}
                                index={index}
                                folderId={folder.id}
                              />
                            ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  );
                })}
                {defaultFolder.map(folder => (
                  <Droppable
                    droppableId={folder.id.toString()}
                    type="SIDEBAR_Folder"
                    key={folder.id}
                  >
                    {provided => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2 pt-4 border-t border-gray-100"
                      >
                        {folder.tags.map((tag, index) => (
                          <TagItem
                            key={tag.id}
                            tag={tag}
                            index={index}
                            folderId={folder.id}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          )}
        </div>
      </div>
    </>
  );
};

export default SideMenu;
