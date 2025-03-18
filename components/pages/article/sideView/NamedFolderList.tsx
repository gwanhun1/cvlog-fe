import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Folder } from 'service/api/tag/type';
import DroppableFolder from './DroppableFolder';
import FolderItem from './FolderItem';
import TagItem from './TagItem';

interface NamedFolderListProps {
  folders: Folder[];
  draggedTagName: string;
  closedIdx: number[];
  onClickAccordion: (
    id: number
  ) => (e: React.MouseEvent<HTMLDivElement>) => void;
}

const NamedFolderList = ({
  folders,
  draggedTagName,
  closedIdx,
  onClickAccordion,
}: NamedFolderListProps) => {
  return (
    <>
      {folders.map((folder: Folder) => (
        <div
          key={folder.id}
          className="mb-4"
        >
          {/* 전체 폴더를 드롭 영역으로 설정 */}
          <div 
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-blue-200 transition-all duration-300 relative"
            style={{ touchAction: 'none' }}
          >
            <DroppableFolder 
              folder={folder} 
              draggedTagName={draggedTagName} 
              includeHeader={true}
            >
              <div className="folder-container w-full relative">
                {/* 아코디언 헤더 - z-index를 높게 설정하여 클릭 이벤트 우선 처리 */}
                <div className="relative z-30">
                  <FolderItem
                    folder={folder}
                    isOpened={closedIdx.includes(folder.id)}
                    onClickAccordion={onClickAccordion}
                  />
                </div>
                
                {/* 태그 리스트 영역 */}
                <div
                  className={`w-full px-2 transition-all duration-300 ease-in-out ${
                    closedIdx.includes(folder.id)
                      ? 'max-h-0 overflow-hidden opacity-0 pointer-events-none'
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
