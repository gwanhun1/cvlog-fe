import { useCallback, useState, useRef } from 'react';
import {
  DragEndEvent,
  DragStartEvent,
  DragMoveEvent,
} from '@dnd-kit/core';
import { useQueryClient } from 'react-query';
import { Folder, Tag } from 'service/api/tag/type';
import { usePutTagsFolder } from 'service/hooks/List';

interface ActiveTag {
  tag: Tag;
  folderId: number;
}

export const useTagDragState = (foldersData: Folder[] | undefined) => {
  const [activeTag, setActiveTag] = useState<ActiveTag | null>(null);
  const [draggedTagName, setDraggedTagName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const lastDropTargetRef = useRef<number | null>(null);

  const queryClient = useQueryClient();
  const mutationUpdateTagsFolders = usePutTagsFolder();

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      if (isUpdating) {
        return;
      }

      try {
        const { active } = event;
        const idString = String(active.id);
        
        // Reset the last drop target
        lastDropTargetRef.current = null;

        // Parse the ID to get folder and tag IDs
        const parts = idString.split('-');
        let folderId: number;
        
        // Handle 'unassigned' folder ID
        if (parts[0] === 'unassigned') {
          folderId = 999; // Special ID for unassigned folder
        } else {
          folderId = parseInt(parts[0], 10);
        }
        
        const tagId = parseInt(parts[parts.length - 1], 10);

        if (isNaN(folderId) || isNaN(tagId)) {
          console.error('Invalid IDs in drag start:', { folderId, tagId });
          return;
        }

        // Find the folder
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

        // Find the tag
        const tag = folder.tags.find(t => t.id === tagId);
        if (!tag) {
          console.error('Tag not found:', tagId, 'in folder', folderId);
          return;
        }

        // Set active tag and name - using performance optimized approach
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

  const handleDragMove = useCallback((event: DragMoveEvent) => {
    // Performance optimization: only update what's necessary during drag
    // We don't need complex logic here as SortableContext handles positioning
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      try {
        const { active, over } = event;
        
        // Always clean up state regardless of outcome
        // Use requestAnimationFrame for smoother UI transitions
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

        // Parse the active ID to get source folder and tag IDs
        const parts = activeId.split('-');
        let sourceFolderId: number;
        
        // Handle 'unassigned' folder ID
        if (parts[0] === 'unassigned') {
          sourceFolderId = 999; // Special ID for unassigned folder
        } else {
          sourceFolderId = parseInt(parts[0], 10);
        }
        
        const tagId = parseInt(parts[parts.length - 1], 10);

        if (isNaN(sourceFolderId) || isNaN(tagId)) {
          console.error('Invalid source IDs:', { sourceFolderId, tagId });
          return;
        }

        // Don't do anything if dropped in the same folder
        if (sourceFolderId === overId) {
          return;
        }
        
        // Don't make duplicate API calls for the same target
        if (lastDropTargetRef.current === overId) {
          return;
        }
        
        // Set the last drop target
        lastDropTargetRef.current = overId;

        // Show loading state
        setIsUpdating(true);
        document.body.style.cursor = 'wait';

        // Make the API call
        mutationUpdateTagsFolders.mutateAsync(
          {
            tag_id: tagId,
            folder_id: overId,
          },
          {
            onSuccess: () => {
              // Invalidate queries to refresh data
              queryClient.invalidateQueries(['tagsFolder']);
            },
            onError: error => {
              console.error('Error updating tag folder:', error);
              queryClient.invalidateQueries(['tagsFolder']);
            },
            onSettled: () => {
              // Reset state after operation completes
              setIsUpdating(false);
              document.body.style.cursor = 'default';
              lastDropTargetRef.current = null;
            },
          }
        );
      } catch (error) {
        console.error('Error in handleDragEnd:', error);
        setIsUpdating(false);
        document.body.style.cursor = 'default';
      }
    },
    [mutationUpdateTagsFolders, queryClient]
  );

  return {
    activeTag,
    draggedTagName,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    isUpdating,
  };
};
