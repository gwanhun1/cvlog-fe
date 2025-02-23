import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Folder } from 'service/api/tag/type';
import DroppableFolder from './DroppableFolder';
import TagItem from './TagItem';

interface DefaultFolderListProps {
  folders: Folder[];
  draggedTagName: string;
}

const DefaultFolderList = ({
  folders,
  draggedTagName,
}: DefaultFolderListProps) => {
  return (
    <>
      {folders.map(folder => (
        <DroppableFolder
          key={folder.id}
          folder={folder}
          draggedTagName={draggedTagName}
        >
          <div
            className={`
              rounded-lg px-2 py-1
              border border-gray-100
              transition-colors duration-200
              ${folder.tags && folder.tags.length === 0 ? 'min-h-[60px]' : ''}
              ${
                folder.tags && folder.tags.length === 0
                  ? 'bg-gray-50/50'
                  : 'bg-white'
              }
            `}
          >
            <SortableContext
              items={folder.tags.map(tag => `${folder.id}-${tag.id}`)}
              strategy={verticalListSortingStrategy}
            >
              {folder.tags.length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-gray-400">
                  태그를 이 영역으로 드래그하여 폴더 해제
                </div>
              ) : (
                folder.tags.map((tag, index) => (
                  <TagItem
                    key={`${folder.id}-${tag.id}`}
                    tag={tag}
                    index={index}
                    folderId={folder.id}
                  />
                ))
              )}
            </SortableContext>
          </div>
        </DroppableFolder>
      ))}
    </>
  );
};

export default DefaultFolderList;
