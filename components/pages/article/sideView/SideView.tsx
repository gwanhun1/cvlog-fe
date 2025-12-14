import { useCallback, useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragStartEvent,
  DragEndEvent,
  DragCancelEvent,
  pointerWithin,
  rectIntersection,
  CollisionDetection,
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

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .dnd-active * {
        user-select: none !important;
      }
      .dnd-container {
        touch-action: none;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.body.style.cursor = 'default';
      document.head.removeChild(styleElement);
    };
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  );

  // 폴더 영역 우선 감지를 위한 커스텀 collision detection
  const collisionDetection: CollisionDetection = useCallback(args => {
    // pointerWithin으로 먼저 감지
    const pointerCollisions = pointerWithin(args);

    if (pointerCollisions.length > 0) {
      // 폴더(droppable)를 우선 반환
      const folderCollision = pointerCollisions.find(
        collision => !String(collision.id).includes('-')
      );
      if (folderCollision) {
        return [folderCollision];
      }
    }

    // fallback으로 rectIntersection 사용
    const rectCollisions = rectIntersection(args);
    const folderRectCollision = rectCollisions.find(
      collision => !String(collision.id).includes('-')
    );
    if (folderRectCollision) {
      return [folderRectCollision];
    }

    return rectCollisions;
  }, []);

  const {
    activeTag,
    draggedTagName,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleDragCancel,
    optimisticFoldersData,
    hasPendingOperations,
    movingTags,
  } = useTagDragState(queryGetTagsFolders.data);

  const unassignedFolder = useMemo(
    () => optimisticFoldersData?.find(folder => folder.id === 999),
    [optimisticFoldersData]
  );

  const { namedFolder, defaultFolder } = useMemo(
    () => ({
      namedFolder: optimisticFoldersData?.filter(item => item.id !== 999) ?? [],
      defaultFolder:
        optimisticFoldersData?.filter(item => item.id === 999) ?? [],
    }),
    [optimisticFoldersData]
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

      const container = document.querySelector('.dnd-container');
      if (container) {
        container.classList.add('dnd-active');
      }

      handleDragStart(event);
    },
    [handleDragStart]
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      document.body.style.cursor = 'default';
      setDragActive(false);

      const container = document.querySelector('.dnd-container');
      if (container) {
        container.classList.remove('dnd-active');
      }

      handleDragEnd(event);
    },
    [handleDragEnd]
  );

  const onDragCancel = useCallback(
    (event: DragCancelEvent) => {
      document.body.style.cursor = 'default';
      setDragActive(false);

      const container = document.querySelector('.dnd-container');
      if (container) {
        container.classList.remove('dnd-active');
      }

      handleDragCancel(event);
    },
    [handleDragCancel]
  );

  const onClickAccordion = useCallback(
    (id: number) => (e: React.MouseEvent<HTMLDivElement>) => {
      // 드래그 중이면 아코디언 동작을 중지
      if (dragActive) return;

      e.preventDefault();
      e.stopPropagation();

      setClosedIdx(prev => {
        const hasId = prev.includes(id);
        return hasId ? prev.filter(storedId => storedId !== id) : [...prev, id];
      });
    },
    [dragActive]
  );

  const tryOpenModal = useCallback((name: string) => {
    setSelectModal(name);
    setShowModal(true);
  }, []);

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
        className={`sticky mt-3 top-24 w-full max-w-[200px] bg-white/90 backdrop-blur rounded-xl border border-ftBlue/20 overflow-hidden transition-opacity duration-200 ${
          hasPendingOperations ? 'border-ftBlue/40 ring-2 ring-ftBlue/30' : ''
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
            <div className="dnd-container">
              <DndContext
                sensors={sensors}
                collisionDetection={collisionDetection}
                onDragStart={onDragStart}
                onDragMove={handleDragMove}
                onDragEnd={onDragEnd}
                onDragCancel={onDragCancel}
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
                      movingTags={movingTags}
                      disabled={hasPendingOperations}
                    />

                    {unassignedFolder && (
                      <div className="mt-4">
                        <UnassignedTagListContent
                          folder={unassignedFolder}
                          draggedTagName={draggedTagName}
                          movingTags={movingTags}
                          disabled={hasPendingOperations}
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SideMenu;
