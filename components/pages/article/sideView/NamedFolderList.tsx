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
        <DroppableFolder
          key={folder.id}
          folder={folder}
          draggedTagName={draggedTagName}
        >
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 cursor-move">
            <FolderItem
              folder={folder}
              isOpened={closedIdx.includes(folder.id)}
              onClickAccordion={onClickAccordion}
            />
            <div
              className={`mt-1 transition-all duration-300 ${
                closedIdx.includes(folder.id)
                  ? 'max-h-0 overflow-hidden'
                  : 'max-h-[500px]'
              }`}
            >
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
        </DroppableFolder>
      ))}
    </>
  );
};

export default NamedFolderList;
