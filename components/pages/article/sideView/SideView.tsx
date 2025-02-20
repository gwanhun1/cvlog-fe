import { useCallback, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useQuery, useQueryClient } from 'react-query';
import {
  Folder,
  PutTagsFolderRes,
  Tag,
  UpdateForm,
} from 'service/api/tag/type';
import { useGetFolders, usePutTagsFolder } from 'service/hooks/List';
import { tagsAPI } from 'service/api/tag';
import LogmeAddModal from 'components/Shared/LogmeTag/LogmeAddModal';
import LogmeRemoveModal from 'components/Shared/LogmeTag/LogmeRemoveModal';
import SideViewHeader from './SideViewHeader';
import EmptyState from './EmptyState';
import NamedFolderList from './NamedFolderList';
import DefaultFolderList from './DefaultFolderList';
import UnassignedTagList from './UnassignedTagList';
import DragOverlayItem from './DragOverlayItem';

interface ActiveTag {
  tag: Tag;
  folderId: number;
}

const SideMenu = () => {
  const queryGetTagsFolders = useGetFolders();
  const queryGetUnassignedTags = useQuery(
    'unassignedTags',
    tagsAPI.getWithoutFolder
  );
  const mutationUpdateTagsFolders = usePutTagsFolder();
  const queryClient = useQueryClient();

  const [closedIdx, setClosedIdx] = useState<number[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectModal, setSelectModal] = useState<string>('');
  const [activeTag, setActiveTag] = useState<ActiveTag | null>(null);
  const [draggedTagName, setDraggedTagName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

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

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const [folderId, tagId] = String(active.id).split('-');

      let tag: Tag | undefined;

      if (folderId === 'unassigned') {
        tag = queryGetUnassignedTags.data?.data?.find(
          (t: { id: number }) => t.id === Number(tagId)
        );
      } else {
        const folder = queryGetTagsFolders.data?.find(
          f => f.id === Number(folderId)
        );
        tag = folder?.tags.find(t => t.id === Number(tagId));
      }

      if (tag) {
        setActiveTag({
          tag,
          folderId: folderId === 'unassigned' ? 0 : Number(folderId),
        });
        setDraggedTagName(tag.name);
      }
    },
    [queryGetTagsFolders.data, queryGetUnassignedTags.data]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTag(null);
      setDraggedTagName('');
      const { active, over } = event;
      if (!over) return;

      const activeId = String(active.id);
      const overId = String(over.id);

      // 소스 폴더와 태그 ID 추출
      const [sourceFolderId, sourceTagId] = activeId.split('-');
      const tagId = Number(sourceTagId);

      // 이전 폴더 ID 계산
      const oldFolderId =
        sourceFolderId === 'unassigned' ? 0 : Number(sourceFolderId);

      // 새 폴더 ID 계산
      const newFolderId = overId === '0' ? 0 : Number(overId);

      // 동일한 폴더로 이동하는 경우 무시
      if (oldFolderId === newFolderId) return;

      // 낙관적 업데이트
      mutationUpdateTagsFolders.mutate(
        { tag_id: tagId, folder_id: newFolderId },
        {
          onSuccess: (
            data: PutTagsFolderRes,
            variables: UpdateForm,
            context: { previousData?: Folder[] } | undefined
          ) => {
            // 낙관적으로 데이터 업데이트
            queryClient.setQueryData(
              ['folders'],
              (old: Folder[] | undefined) => {
                if (!old) return [];

                return old.map(folder => {
                  // 이전 폴더에서 태그 제거
                  if (folder.id === oldFolderId) {
                    return {
                      ...folder,
                      tags: folder.tags.filter(t => t.id !== variables.tag_id),
                    };
                  }
                  // 새 폴더에 태그 추가
                  if (folder.id === variables.folder_id) {
                    const movingTag = context?.previousData
                      ?.find(f => f.id === oldFolderId)
                      ?.tags.find(t => t.id === variables.tag_id);

                    if (movingTag) {
                      return {
                        ...folder,
                        tags: [...folder.tags, movingTag],
                      };
                    }
                  }
                  return folder;
                });
              }
            );

            // 쿼리 무효화
            queryClient.invalidateQueries('unassignedTags');
            queryClient.invalidateQueries('folders');
          },
          onError: (context: unknown) => {
            const ctx = context as { previousData?: Folder[] } | undefined;
            // 에러 발생 시 이전 데이터로 롤백
            if (ctx?.previousData) {
              queryClient.setQueryData(['folders'], ctx.previousData);
            }
            queryClient.invalidateQueries('unassignedTags');
            queryClient.invalidateQueries('folders');
          },
        }
      );
    },
    [mutationUpdateTagsFolders, queryClient]
  );

  const tryOpenModal = useCallback((name: string) => {
    setSelectModal(name);
    setShowModal(true);
  }, []);

  if (queryGetTagsFolders.isLoading || queryGetUnassignedTags.isLoading) {
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

  if (queryGetTagsFolders.isError || queryGetUnassignedTags.isError) {
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
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          데이터를 불러올 수 없습니다
        </h3>
        <p className="text-gray-500 mb-6 text-sm">잠시 후 다시 시도해주세요</p>
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

  const hasContent =
    (namedFolder && namedFolder.length > 0) ||
    (defaultFolder && defaultFolder.length > 0) ||
    (queryGetUnassignedTags.data?.data?.length ?? 0) > 0;

  return (
    <>
      {selectModal === 'add' && (
        <LogmeAddModal showModal={showModal} setShowModal={setShowModal} />
      )}
      {selectModal === 'delete' && (
        <LogmeRemoveModal showModal={showModal} setShowModal={setShowModal} />
      )}

      <div className="sticky top-24 w-full max-w-[200px] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <SideViewHeader
          hasContent={hasContent}
          onAddClick={() => tryOpenModal('add')}
          onDeleteClick={() => tryOpenModal('delete')}
        />

        <div className="p-2">
          {!hasContent ? (
            <EmptyState onAddClick={() => tryOpenModal('add')} />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <div className="space-y-4">
                <NamedFolderList
                  folders={namedFolder}
                  draggedTagName={draggedTagName}
                  closedIdx={closedIdx}
                  onClickAccordion={onClickAccordion}
                />

                <DefaultFolderList
                  folders={defaultFolder}
                  draggedTagName={draggedTagName}
                />

                <UnassignedTagList
                  tags={queryGetUnassignedTags.data?.data ?? []}
                  draggedTagName={draggedTagName}
                />
              </div>

              <DragOverlay>
                {activeTag && <DragOverlayItem tag={activeTag.tag} />}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>
    </>
  );
};

export default SideMenu;
