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
import {
  Folder,
  Tag,
  PutTagsFolderRes,
  UpdateForm,
} from 'service/api/tag/type';
import { usePutTagsFolder } from 'service/hooks/List';

interface ActiveTag {
  tag: Tag;
  folderId: number;
}

export const useTagDragState = (
  foldersData: Folder[] | undefined,
  unassignedTagsData: { data: Tag[] } | undefined
) => {
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
      const [folderId, tagId] = String(active.id).split('-');

      let tag: Tag | undefined;

      if (folderId === 'unassigned') {
        tag = unassignedTagsData?.data?.find(
          (t: { id: number }) => t.id === Number(tagId)
        );
      } else {
        const folder = foldersData?.find(f => f.id === Number(folderId));
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
    [foldersData, unassignedTagsData]
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

  return {
    activeTag,
    draggedTagName,
    sensors,
    handleDragStart,
    handleDragEnd,
  };
};
