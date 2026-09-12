import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core';
import { useGetFolders } from 'service/hooks/List';
import { useTagDragState } from 'hooks/useTagDragState';
import type { Folder, Tag } from 'service/api/tag/type';
import LogmeAddModal from 'components/Shared/LogmeTag/LogmeAddModal';
import LogmeRemoveModal from 'components/Shared/LogmeTag/LogmeRemoveModal';
import { folderCoordinates } from 'utils/tagFolderKeyboard';

const folderColors = [
  'border-blue-300 bg-blue-100 text-blue-900',
  'border-sky-300 bg-sky-100 text-sky-900',
  'border-indigo-300 bg-indigo-100 text-indigo-900',
  'border-cyan-300 bg-white text-cyan-800',
];
const folderInlineColors = [
  { borderColor: '#93c5fd', backgroundColor: '#dbeafe', color: '#1e3a8a' },
  { borderColor: '#7dd3fc', backgroundColor: '#e0f2fe', color: '#0c4a6e' },
  { borderColor: '#a5b4fc', backgroundColor: '#e0e7ff', color: '#312e81' },
  { borderColor: '#67e8f9', backgroundColor: '#ffffff', color: '#155e75' },
];

function folderColor(id: number) {
  const numericId = Number(id);
  if (numericId === 999) {
    return 'border-slate-300 bg-slate-100 text-slate-700';
  }
  if (!Number.isFinite(numericId)) {
    return folderColors[0];
  }
  return folderColors[Math.abs(numericId) % folderColors.length];
}

function folderInlineColor(id: number) {
  const numericId = Number(id);
  return folderInlineColors[
    Number.isFinite(numericId)
      ? Math.abs(numericId) % folderInlineColors.length
      : 0
  ];
}

function FolderChip({
  folder,
  selected,
  onSelect,
}: {
  folder: Folder;
  selected: boolean;
  onSelect: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: folder.id,
  });
  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      style={
        !selected && !isOver
          ? { borderWidth: 2, ...folderInlineColor(folder.id) }
          : undefined
      }
      className={`rounded-lg border-2 px-3 py-2 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ftBlue ${isOver ? 'border-ftBlue bg-blue-100 text-ftBlue ring-2 ring-ftBlue/40' : selected ? 'border-ftBlue bg-ftBlue text-white' : `${folderColor(folder.id)} hover:border-ftBlue`}`}
    >
      {folder.id === 999 ? '미분류' : folder.name}{' '}
      <span className="opacity-60">{folder.tags.length}</span>
    </button>
  );
}

function TagChip({
  tag,
  folderId,
  pending,
  selected,
  onSelect,
}: {
  tag: Tag;
  folderId: number;
  pending: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const { setNodeRef, setActivatorNodeRef, listeners, attributes, isDragging } =
    useDraggable({
      id: `${folderId}-${tag.id}`,
      disabled: pending,
    });
  return (
    <div
      ref={setNodeRef}
      className={`inline-flex max-w-full items-center rounded-full border text-xs font-semibold ${selected ? 'border-ftBlue bg-ftBlue text-white' : folderColor(folderId)} ${isDragging || pending ? 'opacity-40' : ''}`}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        {...listeners}
        {...attributes}
        disabled={pending}
        aria-label={`${tag.name} 이동. Space로 잡고 방향키로 폴더 선택, Space로 놓기, Esc로 취소`}
        className="touch-none cursor-grab rounded-l-full px-2 py-2 active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-ftBlue"
      >
        ⠿
      </button>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="min-w-0 truncate rounded-full py-2 pl-0 pr-3 focus-visible:ring-2 focus-visible:ring-ftBlue"
      >
        #{tag.name}
        {Number.isFinite(tag.postsCount) ? ` · ${tag.postsCount}` : ''}
      </button>
    </div>
  );
}

export default function InlineTagOrganizer({
  keyword,
  onSearch,
}: {
  keyword: string;
  onSearch: (value: string) => void;
}) {
  const query = useGetFolders();
  const [folderId, setFolderId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const drag = useTagDragState(query.data);
  const folders = drag.optimisticFoldersData ?? [];
  const selectedFolder = folders.some(folder => folder.id === folderId)
    ? folderId
    : null;
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: folderCoordinates }),
  );
  return (
    <section
      aria-label="내 태그 탐색과 정리"
      className="my-5 space-y-3 rounded-xl border border-slate-200 bg-white p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-800">
          내 태그로 기록 찾기
        </h2>
        <div className="flex items-center gap-2">
          {keyword && (
            <button
              type="button"
              onClick={() => onSearch('')}
              className="text-xs text-slate-500"
            >
              필터 해제
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            disabled={query.isLoading || query.isError}
            className="rounded-lg px-2 py-2 text-xs font-semibold text-ftBlue"
          >
            + 폴더 추가
          </button>
          <button
            type="button"
            onClick={() => setShowRemove(true)}
            disabled={
              query.isLoading ||
              query.isError ||
              drag.hasPendingOperations ||
              !!drag.activeTag
            }
            className="rounded-lg px-2 py-2 text-xs font-semibold text-slate-500 hover:bg-blue-50 hover:text-ftBlue disabled:opacity-40"
          >
            폴더 삭제
          </button>
        </div>
      </div>
      {query.isLoading ? (
        <div
          role="status"
          aria-label="태그 불러오는 중"
          className="flex flex-wrap gap-2 pt-1"
        >
          {[78, 112, 66, 92, 84, 126, 72, 104].map((width, index) => (
            <span
              key={`${width}-${index}`}
              style={{ width }}
              className="h-9 animate-pulse rounded-full border-2 border-blue-100 bg-blue-50"
            />
          ))}
        </div>
      ) : query.isError ? (
        <button
          type="button"
          onClick={() => query.refetch()}
          className="text-sm text-ftBlue"
        >
          태그 다시 불러오기
        </button>
      ) : (
        <DndContext
          id="inline-tag-organizer"
          sensors={sensors}
          collisionDetection={args =>
            args.pointerCoordinates
              ? pointerWithin(args)
              : rectIntersection(args)
          }
          onDragStart={drag.handleDragStart}
          onDragCancel={drag.handleDragCancel}
          onDragEnd={drag.handleDragEnd}
          accessibility={{
            screenReaderInstructions: {
              draggable:
                'Space로 태그를 잡고 방향키로 폴더를 선택하세요. Space로 이동하고 Escape로 취소합니다.',
            },
          }}
        >
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={selectedFolder === null}
              onClick={() => setFolderId(null)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold ${selectedFolder === null ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}
            >
              전체
            </button>
            {folders.map(folder => (
              <FolderChip
                key={folder.id}
                folder={folder}
                selected={selectedFolder === folder.id}
                onSelect={() => setFolderId(folder.id)}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-3">
            {folders
              .filter(
                folder =>
                  selectedFolder === null || folder.id === selectedFolder,
              )
              .flatMap(folder =>
                folder.tags.map(tag => (
                  <TagChip
                    key={tag.id}
                    tag={tag}
                    folderId={folder.id}
                    pending={drag.movingTags.some(
                      moving => moving.tagId === tag.id,
                    )}
                    selected={
                      keyword.trim().toLocaleLowerCase() ===
                      tag.name.trim().toLocaleLowerCase()
                    }
                    onSelect={() =>
                      onSearch(
                        keyword.trim().toLocaleLowerCase() ===
                          tag.name.trim().toLocaleLowerCase()
                          ? ''
                          : tag.name,
                      )
                    }
                  />
                )),
              )}
          </div>
          {!folders.some(
            folder =>
              (selectedFolder === null || folder.id === selectedFolder) &&
              folder.tags.length,
          ) && (
            <p className="py-2 text-xs text-slate-500">
              아직 태그가 없습니다.
              {' 전체에서 태그를 끌어 이 폴더에 넣어보세요.'}
            </p>
          )}
          {(drag.hasPendingOperations || drag.activeTag) && (
            <p role="status" className="pt-2 text-xs text-slate-500">
              {drag.hasPendingOperations
                ? '이동 저장 중…'
                : '손잡이를 끌어 폴더에 놓으세요. 폴더 밖에 놓으면 취소됩니다.'}
            </p>
          )}
          <DragOverlay dropAnimation={null}>
            {drag.activeTag ? (
              <span className="rounded-full border border-ftBlue bg-white px-3 py-2 text-xs font-semibold text-ftBlue shadow-lg">
                #{drag.activeTag.tag.name}
              </span>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
      {showAdd && (
        <LogmeAddModal showModal={showAdd} setShowModal={setShowAdd} />
      )}
      {showRemove && (
        <LogmeRemoveModal showModal={showRemove} setShowModal={setShowRemove} />
      )}
    </section>
  );
}
