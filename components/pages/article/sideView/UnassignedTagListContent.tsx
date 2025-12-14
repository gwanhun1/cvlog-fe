import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DroppableFolder from './DroppableFolder';
import TagItem from './TagItem';
import { Folder } from 'service/api/tag/type';

interface MovingTagInfo {
  tagId: number;
  sourceFolderId: number;
  targetFolderId: number;
}

interface UnassignedTagListContentProps {
  folder: Folder;
  draggedTagName: string;
  movingTags: MovingTagInfo[];
  disabled: boolean;
}

const UnassignedTagListContent = ({
  folder,
  draggedTagName,
  movingTags,
  disabled,
}: UnassignedTagListContentProps) => {
  // 이동 중인 태그인지 확인 (소스/타겟 모두 스켈레톤 표시)
  const isTagMovingInFolder = (tagId: number, folderId: number) => {
    return movingTags.some(
      mt =>
        mt.tagId === tagId &&
        (mt.sourceFolderId === folderId || mt.targetFolderId === folderId)
    );
  };
  return (
    <div className="overflow-hidden relative rounded-xl">
      <div
        className="bg-white rounded-xl shadow-sm transition-all duration-200"
        style={{ touchAction: 'none' }}
      >
        <DroppableFolder
          folder={folder}
          draggedTagName={draggedTagName}
          includeHeader={true}
        >
          <div className="p-3 w-full">
            <div className="mb-2 text-xs font-medium text-gray-500 select-none">
              {folder.name}
            </div>
            <SortableContext
              items={folder.tags.map(tag => `unassigned-${tag.id}`)}
              strategy={verticalListSortingStrategy}
            >
              <div
                className="w-full space-y-1.5"
                role="listbox"
                aria-label="미지정 태그 목록"
              >
                {folder.tags.map(tag => (
                  <TagItem
                    key={`unassigned-${tag.id}`}
                    tag={tag}
                    folderId={folder.id}
                    isMoving={isTagMovingInFolder(tag.id, folder.id)}
                    disabled={disabled}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        </DroppableFolder>
      </div>
    </div>
  );
};

export default UnassignedTagListContent;
