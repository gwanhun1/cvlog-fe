import { useEffect, useState } from 'react';
import {
  Draggable,
  Droppable,
  DropResult,
  DragDropContext,
} from '@hello-pangea/dnd';
import * as Shared from 'components/Shared';
import LogmeAddModal from 'components/Shared/LogmeAddModal';
import LogmeRemoveModal from 'components/Shared/LogmeRemoveModal';
import { Folder, UpdateForm } from 'service/api/tag/type';
import { useGetFolders, usePutTagsFolder } from 'service/hooks/List';

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

  const onClickAccordion =
    (id: number) => (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      const hasId = closedIdx.some(storedId => storedId === id);
      if (hasId) setClosedIdx(closedIdx.filter(storedId => storedId !== id));
      else setClosedIdx([...closedIdx, id]);
    };

  useEffect(() => {
    setwinReady(true);
  }, []);

  function OnDragEnd(result: DropResult) {
    const { source, destination } = result;
    if (!result.destination) return;

    const sourceFolder = queryGetTagsFolders.data?.find(
      folder => folder.id.toString() === source.droppableId
    );

    const destinationFolder = queryGetTagsFolders.data?.find(
      folder =>
        folder.id.toString() === (destination && destination.droppableId)
    );

    const setForm: UpdateForm = {
      tag_id: sourceFolder?.tags[result.source.index].id,
      folder_id: destinationFolder?.id,
    };

    mutationUpdateTagsFolders.mutate(setForm);
  }

  const tryOpenModal = (name: string) => {
    setSelectModal(name);
    setShowModal(true);
  };
  console.log(namedFolder);
  console.log(defaultFolder);

  return (
    <>
      {selectModal === 'add' && (
        <LogmeAddModal showModal={showModal} setShowModal={setShowModal} />
      )}
      {selectModal === 'delete' && (
        <LogmeRemoveModal showModal={showModal} setShowModal={setShowModal} />
      )}

      <div className="sticky top-24 w-full max-w-xs bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              태그 관리
            </h2>

            {(namedFolder.length !== 0 || defaultFolder.length !== 0) && (
              <div className="flex gap-2">
                <button
                  onClick={() => tryOpenModal('add')}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                  title="태그 추가"
                >
                  <svg
                    className="w-5 h-5"
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
                </button>
                <button
                  onClick={() => tryOpenModal('delete')}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                  title="태그 삭제"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {winReady ? (
            <div className="space-y-4">
              {queryGetTagsFolders.isLoading ? (
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
              ) : queryGetTagsFolders.isError ? (
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
                  <p className="text-gray-500 mb-6">
                    잠시 후 다시 시도해주세요
                  </p>
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
              ) : namedFolder.length === 0 && defaultFolder.length === 0 ? (
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
                  <p className="text-gray-500 mb-6">
                    첫 번째 태그를 만들어보세요!
                  </p>
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
                <DragDropContext onDragEnd={OnDragEnd}>
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
                            <div
                              className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-300"
                              onClick={onClickAccordion(folder.id)}
                            >
                              <span className="font-semibold text-gray-900">
                                {folder.name}
                              </span>
                              <svg
                                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                                  !isOpened ? '' : 'rotate-180'
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                            <div
                              className={`overflow-hidden transition-all duration-300 ${
                                isOpened ? 'max-h-0' : 'max-h-[500px]'
                              }`}
                            >
                              {folder.tags.map((tag, index) => (
                                <Draggable
                                  draggableId={folder.id + '-' + tag?.id}
                                  index={index}
                                  key={tag?.id}
                                >
                                  {provided => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 border-t border-gray-100 transition-colors duration-300 group"
                                    >
                                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                        {tag?.name}
                                      </span>
                                      <span className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full group-hover:bg-blue-100">
                                        {tag?.postsCount}
                                      </span>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder as React.ReactNode}
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
                            <Draggable
                              draggableId={folder.id + '-' + tag?.id}
                              index={index}
                              key={tag?.id}
                            >
                              {provided => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                                >
                                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                    {tag?.name}
                                  </span>
                                  <span className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full group-hover:bg-blue-100">
                                    {tag?.postsCount}
                                  </span>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder as React.ReactNode}
                        </div>
                      )}
                    </Droppable>
                  ))}
                </DragDropContext>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default SideMenu;
