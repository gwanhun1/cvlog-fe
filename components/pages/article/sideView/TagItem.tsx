import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

export interface TagItemProps {
  tag: {
    id: number;
    name: string;
    postsCount: number;
  };
  index: number;
  folderId: number;
}

const TagItem = ({ tag, index, folderId }: TagItemProps) => (
  <Draggable draggableId={folderId + '-' + tag?.id} index={index} key={tag?.id}>
    {provided => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 border-t border-gray-100 transition-colors duration-300 group"
      >
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
          {tag?.name}
        </span>
        <span className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full group-hover:bg-blue-100">
          {tag?.postsCount}
        </span>
      </div>
    )}
  </Draggable>
);

export default TagItem;
