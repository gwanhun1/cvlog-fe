import { useCallback, useState } from 'react';
import {
  DragEndEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
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

  const queryClient = useQueryClient();
  const mutationUpdateTagsFolders = usePutTagsFolder();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const idString = String(active.id);

      const parts = idString.split('-');
      const folderId = parseInt(parts[0], 10);
      const tagId = parseInt(parts[parts.length - 1], 10);

      if (isNaN(folderId) || isNaN(tagId)) {
        console.error('Invalid IDs in drag start:', { folderId, tagId });
        return;
      }

      const folder = foldersData?.find(f => f.id === folderId);
      if (!folder) {
        console.error('Folder not found:', folderId);
        return;
      }

      const tag = folder.tags.find(t => t.id === tagId);
      if (!tag) {
        console.error('Tag not found:', tagId, 'in folder', folderId);
        return;
      }

      setActiveTag({
        tag,
        folderId,
      });
      setDraggedTagName(tag.name);
    },
    [foldersData]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTag(null);
      setDraggedTagName('');

      const { active, over } = event;
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
      const sourceFolderId = parseInt(parts[0], 10);
      const tagId = parseInt(parts[parts.length - 1], 10);

      if (isNaN(sourceFolderId) || isNaN(tagId)) {
        console.error('Invalid source IDs:', { sourceFolderId, tagId });
        return;
      }

      if (sourceFolderId === overId) {
        return;
      }

      mutationUpdateTagsFolders.mutate(
        {
          tag_id: tagId,
          folder_id: overId,
        },
        {
          onSuccess: data => {
            console.log('Tag moved successfully');
            // Invalidate queries to refresh data
            queryClient.invalidateQueries('tagsFolder');
          },
          onError: error => {
            console.error('Error updating tag folder:', error);
            // Invalidate to refresh from server
            queryClient.invalidateQueries('tagsFolder');
          },
        }
      );
    },
    [mutationUpdateTagsFolders, queryClient]
  );

  return {
    activeTag,
    draggedTagName,
    sensors,
    handleDragStart,
    handleDragEnd,
  };
};
