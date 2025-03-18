import { useCallback, useState, useRef } from 'react';
import {
  DragEndEvent,
  DragStartEvent,
  DragMoveEvent,
  DragCancelEvent,
} from '@dnd-kit/core';
import { useQueryClient } from 'react-query';
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

export const useTagDragState = (foldersData: Folder[] | undefined) => {
  const [activeTag, setActiveTag] = useState<ActiveTag | null>(null);
  const [draggedTagName, setDraggedTagName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const lastDropTargetRef = useRef<number | null>(null);

  const [pendingOperations, setPendingOperations] = useState<DragOperation[]>(
    []
  );

  const originalFoldersDataRef = useRef<Folder[] | undefined>(undefined);

  const optimisticFoldersData = useCallback(() => {
    if (!pendingOperations.length || !foldersData) return foldersData;

    if (!originalFoldersDataRef.current) {
      originalFoldersDataRef.current = JSON.parse(JSON.stringify(foldersData));
    }

    const clonedFolders: Folder[] = JSON.parse(JSON.stringify(foldersData));

    pendingOperations.forEach(op => {
      const sourceFolder = clonedFolders.find(f => f.id === op.sourceFolderId);
      const targetFolder = clonedFolders.find(f => f.id === op.targetFolderId);

      if (!sourceFolder || !targetFolder) return;

      const tagIndex = sourceFolder.tags.findIndex(t => t.id === op.tagId);
      if (tagIndex === -1) return;

      const [movedTag] = sourceFolder.tags.splice(tagIndex, 1);
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
      if (isUpdating) {
        return;
      }

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

        const folder = foldersData?.find(f => {
          if (parts[0] === 'unassigned') {
            return f.id === 999;
          }
          return f.id === folderId;
        });

        if (!folder) {
          console.error('Folder not found:', folderId);
          return;
        }

        const tag = folder.tags.find(t => t.id === tagId);
        if (!tag) {
          console.error('Tag not found:', tagId, 'in folder', folderId);
          return;
        }

        requestAnimationFrame(() => {
          setActiveTag({
            tag,
            folderId,
          });
          setDraggedTagName(tag.name);
        });
      } catch (error) {
        console.error('Error in handleDragStart:', error);
      }
    },
    [foldersData, isUpdating]
  );

  const handleDragMove = useCallback((event: DragMoveEvent) => {}, []);

  const handleDragCancel = useCallback(
    (event?: DragCancelEvent) => {
      requestAnimationFrame(() => {
        setActiveTag(null);
        setDraggedTagName('');
        document.body.style.cursor = 'default';
      });

      lastDropTargetRef.current = null;

      if (isUpdating) {
        setIsUpdating(false);
      }
    },
    [isUpdating]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      try {
        const { active, over } = event;

        requestAnimationFrame(() => {
          setActiveTag(null);
          setDraggedTagName('');
        });

        if (!over) {
          console.log('No drop target');
          return;
        }

        const activeId = String(active.id);
        const overId = parseInt(String(over.id), 10);

        if (isNaN(overId)) {
          console.error('Invalid destination folder ID:', over.id);
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

        if (lastDropTargetRef.current === overId) {
          return;
        }

        lastDropTargetRef.current = overId;

        const operationId = generateOperationId();

        const newOperation: DragOperation = {
          tagId,
          sourceFolderId,
          targetFolderId: overId,
          isPending: true,
          id: operationId,
        };

        setPendingOperations(prev => [...prev, newOperation]);

        setIsUpdating(true);
        document.body.style.cursor = 'wait';

        mutationUpdateTagsFolders.mutateAsync(
          {
            tag_id: tagId,
            folder_id: overId,
          },
          {
            onSuccess: () => {
              setPendingOperations(prev =>
                prev.filter(op => op.id !== operationId)
              );

              queryClient.invalidateQueries(['tagsFolder']);
            },
            onError: error => {
              console.error('Error updating tag folder:', error);

              setPendingOperations(prev =>
                prev.filter(op => op.id !== operationId)
              );

              queryClient.invalidateQueries(['tagsFolder']);
            },
            onSettled: () => {
              setIsUpdating(false);
              document.body.style.cursor = 'default';
              lastDropTargetRef.current = null;

              if (pendingOperations.length <= 1) {
                originalFoldersDataRef.current = undefined;
              }
            },
          }
        );
      } catch (error) {
        console.error('Error in handleDragEnd:', error);
        setIsUpdating(false);
        document.body.style.cursor = 'default';
        lastDropTargetRef.current = null;
      }
    },
    [
      mutationUpdateTagsFolders,
      queryClient,
      generateOperationId,
      pendingOperations,
    ]
  );

  return {
    activeTag,
    draggedTagName,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleDragCancel,
    isUpdating,
    optimisticFoldersData: optimisticFoldersData(),
    hasPendingOperations: pendingOperations.length > 0,
  };
};
