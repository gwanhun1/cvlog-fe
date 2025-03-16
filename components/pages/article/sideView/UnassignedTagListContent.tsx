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
    <div className="bg-white rounded-lg border border-gray-100">
      <DroppableFolder folder={folder} draggedTagName={draggedTagName}>
        <div className="p-2 cursor-move">
          <SortableContext
            items={folder.tags.map(tag => `unassigned-${tag.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {folder.tags.map(tag => (
              <TagItem
                key={`unassigned-${tag.id}`}
                tag={tag}
                folderId={folder.id}
              />
            ))}
          </SortableContext>
        </div>
      </DroppableFolder>
    </div>
  );
};

export default UnassignedTagListContent;
