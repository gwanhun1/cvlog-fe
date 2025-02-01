import React, { useEffect, useState } from 'react';
import {
  Draggable,
  Droppable,
  DropResult,
  DragDropContext,
} from 'react-beautiful-dnd';
import * as Shared from 'components/Shared';
import LogmeAddModal from 'components/Shared/LogmeAddModal';
import LogmeRemoveModal from 'components/Shared/LogmeRemoveModal';
import { Folder, UpdateForm } from 'service/api/tag/type';
import { useGetFolders, usePutTagsFolder } from 'service/hooks/List';

const SideMenu = () => {
  const [putForm, setPutForm] = useState<UpdateForm>({
    tag_id: 0,
    folder_id: 0,
  });

  const queryGetTagsFolders = useGetFolders();
  const mutationUpdateTagsFolders = usePutTagsFolder(putForm, {
    onSuccess: () => {
      queryGetTagsFolders.refetch();
    },
  });
  
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

    setPutForm(setForm);
    mutationUpdateTagsFolders.mutate();
  }

  const tryOpenModal = (name: string) => {
    setSelectModal(name);
    setShowModal(true);
  };

  return (
    <>
      {selectModal === 'add' && (
        <LogmeAddModal showModal={showModal} setShowModal={setShowModal} />
      )}
      {selectModal === 'delete' && (
        <LogmeRemoveModal showModal={showModal} setShowModal={setShowModal} />
      )}
      <div className="hidden desktop:block w-72">
        <div className="sticky top-24 p-4 bg-white border rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6 pb-3 border-b">
            <h2 className="text-lg font-semibold text-gray-900">태그 관리</h2>
            <div className="flex">
              <button
                onClick={() => tryOpenModal('add')}
                className="p-2 text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={() => tryOpenModal('delete')}
                className="p-2 ml-2 text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
            </div>
          </div>
          {winReady ? (
            <div className="space-y-4">
              {queryGetTagsFolders.isLoading ? (
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-12 bg-gray-200 rounded-lg mb-2"></div>
                      <div className="space-y-2">
                        <div className="h-8 bg-gray-100 rounded"></div>
                        <div className="h-8 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : queryGetTagsFolders.isError ? (
                <div className="p-6 text-center rounded-lg border-2 border-red-200 bg-red-50">
                  <svg className="w-12 h-12 mx-auto text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-sm font-medium text-red-800 mb-1">데이터를 불러오는데 실패했습니다</h3>
                  <button 
                    onClick={() => queryGetTagsFolders.refetch()}
                    className="text-xs text-red-600 hover:text-red-800 underline"
                  >
                    다시 시도하기
                  </button>
                </div>
              ) : namedFolder.length === 0 && defaultFolder.length === 0 ? (
                <div className="p-8 text-center rounded-lg border-2 border-gray-200 bg-gray-50">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">태그가 없습니다</h3>
                  <p className="text-xs text-gray-500 mb-3">새로운 태그를 추가해보세요</p>
                  <button
                    onClick={() => tryOpenModal('add')}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    태그 추가하기
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
                            className="overflow-hidden bg-white border-2 rounded-lg shadow-sm mb-3"
                          >
                            <div
                              className="flex items-center justify-between p-3 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100 border-b"
                              onClick={onClickAccordion(folder.id)}
                            >
                              <span className="font-medium text-gray-900">
                                {folder.name}
                              </span>
                              <svg
                                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                                  !isOpened ? '' : 'rotate-180'
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                            <div className={`overflow-hidden transition-all duration-200 bg-white ${isOpened ? 'max-h-0' : 'max-h-[500px]'}`}>
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
                                      className="flex items-center justify-between px-4 py-2 transition-colors cursor-pointer group hover:bg-gray-50 border-b last:border-b-0"
                                    >
                                      <span className="text-sm text-gray-700">
                                        {tag?.name}
                                      </span>
                                      <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                                        {tag?.postsCount}
                                      </span>
                                    </div>
                                  )}
                                </Draggable>
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
                          className="space-y-2 mt-4 pt-4 border-t-2"
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
                                  className="flex items-center justify-between p-3 bg-white border-2 rounded-lg shadow-sm transition-colors cursor-pointer hover:bg-gray-50"
                                >
                                  <span className="text-sm text-gray-700">
                                    {tag?.name}
                                  </span>
                                  <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                                    {tag?.postsCount}
                                  </span>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
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
