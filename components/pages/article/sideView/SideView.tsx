import { useCallback, useState } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useGetFolders } from 'service/hooks/List';
import LogmeAddModal from 'components/Shared/LogmeTag/LogmeAddModal';
import LogmeRemoveModal from 'components/Shared/LogmeTag/LogmeRemoveModal';
import SideViewHeader from './SideViewHeader';
import EmptyState from './EmptyState';
import NamedFolderList from './NamedFolderList';
import DragOverlayItem from './DragOverlayItem';
import SideViewSkeleton from './Skeleton';
import SideViewEmpty from './Empty';
import { useTagDragState } from 'hooks/useTagDragState';
import UnassignedTagListContent from './UnassignedTagListContent';

const SideMenu = () => {
  const queryGetTagsFolders = useGetFolders();

  const [closedIdx, setClosedIdx] = useState<number[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectModal, setSelectModal] = useState<string>('');

  const unassignedFolder = queryGetTagsFolders.data?.find(
    folder => folder.id === 999
  );

  const { activeTag, draggedTagName, sensors, handleDragStart, handleDragEnd } =
    useTagDragState(queryGetTagsFolders.data);

  const namedFolder =
    queryGetTagsFolders.data?.filter(
      item => item.name !== '' && item.id !== 999
    ) ?? [];
  const defaultFolder =
    queryGetTagsFolders.data?.filter(item => item.id === 999) ?? [];

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

  const tryOpenModal = useCallback((name: string) => {
    setSelectModal(name);
    setShowModal(true);
  }, []);

  if (queryGetTagsFolders.isLoading) {
    return <SideViewSkeleton />;
  }

  if (queryGetTagsFolders.isError) {
    return <SideViewEmpty queryGetTagsFolders={queryGetTagsFolders} />;
  }

  const hasContent =
    (namedFolder && namedFolder.length > 0) ||
    (defaultFolder && defaultFolder.length > 0) ||
    (unassignedFolder &&
      unassignedFolder.tags &&
      unassignedFolder.tags.length > 0);

  return (
    <>
      {selectModal === 'add' && (
        <LogmeAddModal showModal={showModal} setShowModal={setShowModal} />
      )}
      {selectModal === 'delete' && (
        <LogmeRemoveModal showModal={showModal} setShowModal={setShowModal} />
      )}

      <div className="sticky mt-3 top-24 w-full max-w-[200px] bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
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

                {unassignedFolder && (
                  <div className="mt-4">
                    <div className="text-xs text-gray-500 mb-2 px-2">
                      {unassignedFolder.name}
                    </div>
                    <UnassignedTagListContent
                      folder={unassignedFolder}
                      draggedTagName={draggedTagName}
                    />
                  </div>
                )}
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
