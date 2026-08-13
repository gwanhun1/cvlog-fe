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
  DragCancelEvent,
  pointerWithin,
  rectIntersection,
  CollisionDetection,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
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

const SideMenu = ({ className }: { className?: string }) => {
  const queryGetTagsFolders = useGetFolders();

  const [closedIdx, setClosedIdx] = useState<number[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectModal, setSelectModal] = useState<string>('');
  // 드래그 중 텍스트 선택 방지용. user-select는 상속되므로 컨테이너에만 걸면 하위 전체에 적용된다.
  // 이전에는 document.querySelector('.dnd-container')로 클래스를 토글했는데, SideView가
  // 데스크톱 사이드바와 TagDrawer에 동시에 마운트돼 항상 드로어 쪽만 잡히는 버그가 있었다.
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default';
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
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // 폴더 영역 우선 감지를 위한 커스텀 collision detection.
  // 폴더의 droppable 영역은 그 안의 태그들을 모두 감싸므로, 포인터 아래에는
  // 여러 폴더의 rect가 동시에 겹쳐 걸릴 수 있다(특히 아코디언 열림/닫힘 트랜지션 중).
  // 배열의 첫 항목(등록 순서)을 그대로 쓰면 실제로 가장 위에 있는 폴더가 아닌
  // 엉뚱한 폴더가 선택되어 "잘못된 폴더로 드롭"되는 원인이 됐다.
  // rect 면적이 가장 작은(=가장 안쪽/구체적인) 폴더를 선택해 이를 보정한다.
  const pickMostSpecificFolder = (
    collisions: ReturnType<CollisionDetection>,
  ) => {
    const folderCollisions = collisions.filter(
      collision => !String(collision.id).includes('-'),
    );
    if (folderCollisions.length === 0) return null;
    if (folderCollisions.length === 1) return folderCollisions[0];

    return folderCollisions.reduce((smallest, current) => {
      const smallestRect = smallest.data?.droppableContainer?.rect?.current;
      const currentRect = current.data?.droppableContainer?.rect?.current;
      if (!currentRect) return smallest;
      if (!smallestRect) return current;
      const smallestArea = smallestRect.width * smallestRect.height;
      const currentArea = currentRect.width * currentRect.height;
      return currentArea < smallestArea ? current : smallest;
    });
  };

  const collisionDetection: CollisionDetection = useCallback(args => {
    // pointerWithin으로 먼저 감지
    const pointerCollisions = pointerWithin(args);

    if (pointerCollisions.length > 0) {
      const folderCollision = pickMostSpecificFolder(pointerCollisions);
      if (folderCollision) {
        return [folderCollision];
      }
      return pointerCollisions;
    }

    // fallback으로 rectIntersection 사용
    const rectCollisions = rectIntersection(args);
    const folderRectCollision = pickMostSpecificFolder(rectCollisions);
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
    [optimisticFoldersData],
  );

  const { namedFolder, defaultFolder } = useMemo(
    () => ({
      namedFolder: optimisticFoldersData?.filter(item => item.id !== 999) ?? [],
      defaultFolder:
        optimisticFoldersData?.filter(item => item.id === 999) ?? [],
    }),
    [optimisticFoldersData],
  );

  const onDragStart = useCallback(
    (event: DragStartEvent) => {
      document.body.style.cursor = 'grabbing';
      setDragActive(true);
      handleDragStart(event);
    },
    [handleDragStart],
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      document.body.style.cursor = 'default';
      setDragActive(false);
      handleDragEnd(event);
    },
    [handleDragEnd],
  );

  const onDragCancel = useCallback(
    (event: DragCancelEvent) => {
      document.body.style.cursor = 'default';
      setDragActive(false);
      handleDragCancel(event);
    },
    [handleDragCancel],
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
    [dragActive],
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

  const isLoading = queryGetTagsFolders.isLoading;
  const isError = queryGetTagsFolders.isError;

  const hasContent =
    !isLoading &&
    !isError &&
    ((namedFolder && namedFolder.length > 0) ||
      (defaultFolder && defaultFolder.length > 0) ||
      (unassignedFolder &&
        unassignedFolder.tags &&
        unassignedFolder.tags.length > 0));

  const outerCls = `${
    className ??
    'sticky top-[var(--header-height,64px)] flex max-h-[calc(100vh-var(--header-height,64px)-1rem)] w-full max-w-[200px] flex-col overflow-hidden border-t-2 border-slate-900 bg-transparent transition-[top,max-height] duration-300'
  } ${hasPendingOperations ? 'ring-2 ring-ftBlue/20' : ''}`;

  return (
    <>
      {!isLoading && !isError && selectModal === 'add' && (
        <LogmeAddModal showModal={showModal} setShowModal={setShowModal} />
      )}
      {!isLoading && !isError && selectModal === 'delete' && (
        <LogmeRemoveModal showModal={showModal} setShowModal={setShowModal} />
      )}

      <div className={outerCls}>
        <div className="flex-shrink-0">
          <SideViewHeader
            hasContent={hasContent}
            onAddClick={() => tryOpenModal('add')}
            onDeleteClick={() => tryOpenModal('delete')}
          />
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain py-2 pr-1 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
          {isLoading ? (
            <SideViewSkeleton />
          ) : isError ? (
            <SideViewEmpty queryGetTagsFolders={queryGetTagsFolders} />
          ) : !hasContent ? (
            <EmptyState onAddClick={() => tryOpenModal('add')} />
          ) : (
            <div className={dragActive ? 'select-none' : undefined}>
              <DndContext
                sensors={sensors}
                collisionDetection={collisionDetection}
                onDragStart={onDragStart}
                onDragMove={handleDragMove}
                onDragEnd={onDragEnd}
                onDragCancel={onDragCancel}
                modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
              >
                <div>
                  <NamedFolderList
                    folders={namedFolder}
                    draggedTagName={draggedTagName}
                    closedIdx={closedIdx}
                    onClickAccordion={onClickAccordion}
                    movingTags={movingTags}
                  />

                  {unassignedFolder && (
                    <div className="mt-3">
                      <UnassignedTagListContent
                        folder={unassignedFolder}
                        draggedTagName={draggedTagName}
                        movingTags={movingTags}
                      />
                    </div>
                  )}
                </div>

                <DragOverlay
                  dropAnimation={{
                    duration: 150,
                    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  {activeTag && <DragOverlayItem tag={activeTag.tag} />}
                </DragOverlay>
              </DndContext>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SideMenu;
