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
    <DroppableFolder folder={folder} draggedTagName={draggedTagName}>
      <div className="bg-white rounded-lg border border-gray-100 p-2">
        <SortableContext
          items={folder.tags.map(tag => `unassigned-${tag.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {folder.tags.map((tag, index) => (
            <TagItem
              key={`unassigned-${tag.id}`}
              tag={tag}
              folderId={folder.id}
            />
          ))}
        </SortableContext>
      </div>
    </DroppableFolder>
  );
};

export default UnassignedTagListContent;
