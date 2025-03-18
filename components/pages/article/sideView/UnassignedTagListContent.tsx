import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DroppableFolder from './DroppableFolder';
import TagItem from './TagItem';
import { Folder } from 'service/api/tag/type';

interface UnassignedTagListContentProps {
  folder: Folder;
  draggedTagName: string;
}

const UnassignedTagListContent = ({
  folder,
  draggedTagName,
}: UnassignedTagListContentProps) => {
  return (
    <div className="relative rounded-lg overflow-hidden">
      <div 
        className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300"
        style={{ touchAction: 'none' }}
      >
        {/* 전체 영역을 드래그 가능하도록 설정 */}
        <DroppableFolder 
          folder={folder} 
          draggedTagName={draggedTagName} 
          includeHeader={true}
        >
          <div className="p-3 w-full">
            <div className="text-xs font-medium text-gray-500 mb-2 select-none">
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
