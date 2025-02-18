import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Tag } from 'service/api/tag/type';
import DroppableFolder from './DroppableFolder';
import TagItem from './TagItem';

interface UnassignedTagListProps {
  tags: Tag[];
  draggedTagName: string;
}

const UnassignedTagList = ({ tags, draggedTagName }: UnassignedTagListProps) => {
  return (
    <div className="mt-4">
      <div className="text-xs text-gray-500 mb-2 px-2">폴더 미지정 태그</div>
      <div className="bg-white rounded-lg border border-gray-100 p-2">
        <DroppableFolder
          folder={{
            id: 0,
            name: '',
            tags: tags,
          }}
          draggedTagName={draggedTagName}
        >
          <SortableContext
            items={tags.map(tag => `unassigned-${tag.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {tags.map((tag, index) => (
              <TagItem
                key={`unassigned-${tag.id}`}
                tag={tag}
                index={index}
                folderId={0}
              />
            ))}
          </SortableContext>
        </DroppableFolder>
      </div>
    </div>
  );
};

export default UnassignedTagList;
