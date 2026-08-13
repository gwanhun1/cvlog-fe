import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Folder } from 'service/api/tag/type';
import DroppableFolder from './DroppableFolder';
import FolderItem from './FolderItem';
import TagItem from './TagItem';

interface MovingTagInfo {
  tagId: number;
  sourceFolderId: number;
  targetFolderId: number;
}

interface NamedFolderListProps {
  folders: Folder[];
  draggedTagName: string;
  closedIdx: number[];
  onClickAccordion: (
    id: number,
  ) => (e: React.MouseEvent<HTMLDivElement>) => void;
  movingTags: MovingTagInfo[];
}

const NamedFolderList = ({
  folders,
  draggedTagName,
  closedIdx,
  onClickAccordion,
  movingTags,
}: NamedFolderListProps) => {
  // 해당 폴더에서 이동 중인 태그인지 확인 (소스/타겟 모두 스켈레톤 표시)
  const isTagMovingInFolder = (tagId: number, folderId: number) =>
    movingTags.some(
      mt =>
        mt.tagId === tagId &&
        (mt.sourceFolderId === folderId || mt.targetFolderId === folderId),
    );
  return (
    <>
      {folders.map((folder: Folder) => (
        <div
          key={folder.id}
          className="border-b border-slate-200 py-1 last:border-b-0"
        >
          <div className="relative overflow-hidden transition-colors duration-300">
            <DroppableFolder
              folder={folder}
              draggedTagName={draggedTagName}
              includeHeader={true}
            >
              <div className="relative w-full folder-container">
                <div className="relative z-30">
                  <FolderItem
                    folder={folder}
                    isOpened={closedIdx.includes(folder.id)}
                    onClickAccordion={onClickAccordion}
                  />
                </div>

                {/* 태그 리스트 영역 */}
                <div
                  aria-hidden={closedIdx.includes(folder.id)}
                  className={`w-full px-2 transition-all duration-300 ease-in-out ${
                    closedIdx.includes(folder.id)
                      ? 'invisible max-h-0 overflow-hidden opacity-0 pointer-events-none'
                      : 'max-h-[500px] opacity-100 mt-1'
                  }`}
                >
                  <div className="pt-1 pb-2 w-full">
                    <SortableContext
                      items={folder.tags.map(tag => `${folder.id}-${tag.id}`)}
                      strategy={verticalListSortingStrategy}
                    >
                      {folder.tags.map(tag => (
                        <TagItem
                          key={`${folder.id}-${tag.id}`}
                          tag={tag}
                          folderId={folder.id}
                          isMoving={isTagMovingInFolder(tag.id, folder.id)}
                        />
                      ))}
                    </SortableContext>
                  </div>
                </div>
              </div>
            </DroppableFolder>
          </div>
        </div>
      ))}
    </>
  );
};

export default NamedFolderList;
