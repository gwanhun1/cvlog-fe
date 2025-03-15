import { useCallback, useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
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
  const [dragActive, setDragActive] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {})
  );

  const unassignedFolder = useMemo(
    () => queryGetTagsFolders.data?.find(folder => folder.id === 999),
    [queryGetTagsFolders.data]
  );

  const {
    activeTag,
    draggedTagName,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    isUpdating,
  } = useTagDragState(queryGetTagsFolders.data);

  const { namedFolder, defaultFolder } = useMemo(
    () => ({
      namedFolder:
        queryGetTagsFolders.data?.filter(
          item => item.name !== '' && item.id !== 999
        ) ?? [],
      defaultFolder:
        queryGetTagsFolders.data?.filter(item => item.id === 999) ?? [],
    }),
    [queryGetTagsFolders.data]
  );

  const sortableItems = useMemo(() => {
    const items: string[] = [];

    if (namedFolder) {
      namedFolder.forEach(folder => {
        if (folder.tags) {
          folder.tags.forEach(tag => {
            items.push(`${folder.id}-${tag.id}`);
          });
        }
      });
    }

    if (unassignedFolder && unassignedFolder.tags) {
      unassignedFolder.tags.forEach(tag => {
        items.push(`unassigned-${tag.id}`);
      });
    }

    return items;
  }, [namedFolder, unassignedFolder]);

  const onDragStart = useCallback(
    (event: DragStartEvent) => {
      document.body.style.cursor = 'grabbing';
      setDragActive(true);
      handleDragStart(event);
    },
    [handleDragStart]
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      document.body.style.cursor = 'default';
      setDragActive(false);
      handleDragEnd(event);
    },
    [handleDragEnd]
  );

  const onClickAccordion = useCallback(
    (id: number) => (e: React.MouseEvent<HTMLDivElement>) => {
      if (isUpdating) return;
      e.preventDefault();
      setClosedIdx(prev => {
        const hasId = prev.includes(id);
        return hasId ? prev.filter(storedId => storedId !== id) : [...prev, id];
      });
    },
    [isUpdating]
  );

  const tryOpenModal = useCallback(
    (name: string) => {
      if (isUpdating) return;
      setSelectModal(name);
      setShowModal(true);
    },
    [isUpdating]
  );

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default';
    };
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

      <div
        className={`sticky mt-3 top-24 w-full max-w-[200px] bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden transition-opacity duration-200 ${
          isUpdating ? 'pointer-events-none opacity-80' : ''
        }`}
      >
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
              onDragStart={onDragStart}
              onDragMove={handleDragMove}
              onDragEnd={onDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
            >
              <SortableContext
                items={sortableItems}
                strategy={verticalListSortingStrategy}
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

                <DragOverlay
                  dropAnimation={{
                    duration: 150,
                    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                  }}
                >
                  {activeTag && <DragOverlayItem tag={activeTag.tag} />}
                </DragOverlay>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </>
  );
};

export default SideMenu;
