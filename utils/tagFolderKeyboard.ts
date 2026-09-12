import type { KeyboardCoordinateGetter } from '@dnd-kit/core';

export const folderCoordinates: KeyboardCoordinateGetter = (event, { context }) => {
  if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(event.code)) return;
  event.preventDefault();
  const targets = context.droppableContainers.getEnabled().filter(target => context.droppableRects.has(target.id));
  if (!targets.length || !context.collisionRect) return;
  const index = targets.findIndex(target => target.id === context.over?.id);
  const step = event.code === 'ArrowLeft' || event.code === 'ArrowUp' ? -1 : 1;
  const nextIndex = index === -1 ? (step === 1 ? 0 : targets.length - 1) : (index + step + targets.length) % targets.length;
  const rect = context.droppableRects.get(targets[nextIndex].id)!;
  return { x: rect.left + rect.width / 2 - context.collisionRect.width / 2, y: rect.top + rect.height / 2 - context.collisionRect.height / 2 };
};
