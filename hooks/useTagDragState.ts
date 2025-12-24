import { useCallback, useState, useRef, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  DragEndEvent,
  DragStartEvent,
  DragMoveEvent,
  DragCancelEvent,
} from '@dnd-kit/core';
import { Folder, Tag } from 'service/api/tag/type';
import { usePutTagsFolder } from 'service/hooks/List';

interface ActiveTag {
  tag: Tag;
  folderId: number;
}

interface DragOperation {
  tagId: number;
  sourceFolderId: number;
  targetFolderId: number;
  isPending: boolean;
  id: string;
}

// 이동 중인 태그 정보 (소스 폴더 ID 포함)
interface MovingTagInfo {
  tagId: number;
  sourceFolderId: number;
  targetFolderId: number;
}

export const useTagDragState = (foldersData: Folder[] | undefined) => {
  const [activeTag, setActiveTag] = useState<ActiveTag | null>(null);
  const [draggedTagName, setDraggedTagName] = useState('');
  const lastDropTargetRef = useRef<number | null>(null);
  const processingTagsRef = useRef<Set<number>>(new Set());

  const [pendingOperations, setPendingOperations] = useState<DragOperation[]>(
    []
  );

  // useMemo로 변경: pendingOperations 변경 시 새 값이 계산되어 리렌더링 유도
  const optimisticFoldersData = useMemo(() => {
    if (!foldersData) return foldersData;
    if (!pendingOperations.length) return foldersData;

    const clonedFolders: Folder[] = JSON.parse(JSON.stringify(foldersData));

    pendingOperations.forEach(op => {
      // 태그가 현재 어느 폴더에 있는지 찾기
      let tagFoundInFolder: Folder | undefined;
      let tagIndex = -1;

      for (const folder of clonedFolders) {
        const idx = folder.tags.findIndex(t => t.id === op.tagId);
        if (idx !== -1) {
          tagFoundInFolder = folder;
          tagIndex = idx;
          break;
        }
      }

      // 태그를 찾지 못했거나 이미 목표 폴더에 있으면 스킵
      if (!tagFoundInFolder || tagIndex === -1) return;
      if (tagFoundInFolder.id === op.targetFolderId) return;

      const targetFolder = clonedFolders.find(f => f.id === op.targetFolderId);
      if (!targetFolder) return;

      const [movedTag] = tagFoundInFolder.tags.splice(tagIndex, 1);
      targetFolder.tags.push(movedTag);
    });

    return clonedFolders;
  }, [foldersData, pendingOperations]);

  const queryClient = useQueryClient();
  const mutationUpdateTagsFolders = usePutTagsFolder();

  const generateOperationId = useCallback(() => {
    return `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      try {
        const { active } = event;
        const idString = String(active.id);

        lastDropTargetRef.current = null;

        const parts = idString.split('-');
        let folderId: number;

        if (parts[0] === 'unassigned') {
          folderId = 999;
        } else {
          folderId = parseInt(parts[0], 10);
        }

        const tagId = parseInt(parts[parts.length - 1], 10);

        if (isNaN(folderId) || isNaN(tagId)) {
          console.error('Invalid IDs in drag start:', { folderId, tagId });
          return;
        }

        // optimisticFoldersData 또는 foldersData에서 찾기
        const currentData = optimisticFoldersData || foldersData;

        // 모든 폴더에서 태그 검색 (폴더 ID가 변경되었을 수 있음)
        let foundTag: Tag | undefined;
        let foundFolderId: number | undefined;

        for (const folder of currentData || []) {
          const tag = folder.tags.find(t => t.id === tagId);
          if (tag) {
            foundTag = tag;
            foundFolderId = folder.id;
            break;
          }
        }

        if (!foundTag || foundFolderId === undefined) {
          console.error('Tag not found in any folder:', tagId);
          return;
        }

        setActiveTag({ tag: foundTag, folderId: foundFolderId });
        setDraggedTagName(foundTag.name);
      } catch (error) {
        console.error('Error in handleDragStart:', error);
      }
    },
    [foldersData, optimisticFoldersData]
  );

  const handleDragMove = useCallback((event: DragMoveEvent) => {}, []);

  const handleDragCancel = useCallback((event?: DragCancelEvent) => {
    setActiveTag(null);
    setDraggedTagName('');
    document.body.style.cursor = 'default';
    lastDropTargetRef.current = null;
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      try {
        const { active, over } = event;

        setActiveTag(null);
        setDraggedTagName('');

        if (!over) {
          return;
        }

        const activeId = String(active.id);
        const overIdRaw = over.id;

        // over.id가 태그 id(문자열 "folderId-tagId")인지 폴더 id(숫자)인지 확인
        let overId: number;
        if (typeof overIdRaw === 'number') {
          overId = overIdRaw;
        } else {
          const overIdStr = String(overIdRaw);
          // 태그 id 형식이면 폴더 id 추출
          if (overIdStr.includes('-')) {
            const parts = overIdStr.split('-');
            if (parts[0] === 'unassigned') {
              overId = 999;
            } else {
              overId = parseInt(parts[0], 10);
            }
          } else {
            overId = parseInt(overIdStr, 10);
          }
        }

        if (isNaN(overId)) {
          return;
        }

        const parts = activeId.split('-');
        let sourceFolderId: number;

        if (parts[0] === 'unassigned') {
          sourceFolderId = 999;
        } else {
          sourceFolderId = parseInt(parts[0], 10);
        }

        const tagId = parseInt(parts[parts.length - 1], 10);

        if (isNaN(sourceFolderId) || isNaN(tagId)) {
          console.error('Invalid source IDs:', { sourceFolderId, tagId });
          return;
        }

        if (sourceFolderId === overId) {
          return;
        }

        // 같은 태그가 이미 처리 중이면 무시
        if (processingTagsRef.current.has(tagId)) {
          return;
        }

        processingTagsRef.current.add(tagId);

        const operationId = generateOperationId();

        const newOperation: DragOperation = {
          tagId,
          sourceFolderId,
          targetFolderId: overId,
          isPending: true,
          id: operationId,
        };

        setPendingOperations(prev => [...prev, newOperation]);

        try {
          await mutationUpdateTagsFolders.mutateAsync({
            tag_id: tagId,
            folder_id: overId,
          });
          // refetchQueries는 실제로 데이터를 다시 가져올 때까지 대기
          await queryClient.refetchQueries({ queryKey: ['tagsFolder'], type: 'active' });
        } catch (error) {
          console.error('Error updating folder:', error);
        } finally {
          processingTagsRef.current.delete(tagId);
          document.body.style.cursor = 'default';
          setPendingOperations(prev =>
            prev.filter(op => op.id !== operationId)
          );
        }
      } catch (error) {
        console.error('Error in handleDragEnd:', error);
        document.body.style.cursor = 'default';
      }
    },
    [mutationUpdateTagsFolders, generateOperationId, queryClient]
  );

  const hasPendingOperations = pendingOperations.length > 0;

  // 이동 중인 태그 정보 (소스/타겟 폴더 ID 포함)
  const movingTags: MovingTagInfo[] = pendingOperations.map(op => ({
    tagId: op.tagId,
    sourceFolderId: op.sourceFolderId,
    targetFolderId: op.targetFolderId,
  }));

  return {
    activeTag,
    draggedTagName,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleDragCancel,
    optimisticFoldersData,
    hasPendingOperations,
    movingTags,
  };
};
