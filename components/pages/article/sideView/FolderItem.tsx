import React, { memo, useEffect, useRef, useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';
import { Folder } from 'service/api/tag/type';
import { useUpdateFolderName, useRemoveFolders } from 'service/hooks/List';
import { useToast } from 'components/Shared';

export interface FolderItemProps {
  folder: Folder;
  isOpened: boolean;
  onClickAccordion: (
    id: number,
  ) => (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface MenuPosition {
  x: number;
  y: number;
}

const FolderItem = ({
  folder,
  isOpened,
  onClickAccordion,
}: FolderItemProps) => {
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(folder.name);
  const inputRef = useRef<HTMLInputElement>(null);
  // Enter로 확정한 뒤 input이 언마운트되며 blur가 한 번 더 들어오면 중복 요청이 된다.
  const isSubmittingRef = useRef(false);

  const updateFolderName = useUpdateFolderName();
  const removeFolder = useRemoveFolders();
  const { showToast, showConfirm } = useToast();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 이벤트 버블링 중지 - 드래그와 충돌하는 것 방지
    e.stopPropagation();
    e.preventDefault();
    // 아코디언 클릭 핸들러 호출
    onClickAccordion(folder.id)(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    onClickAccordion(folder.id)(
      e as unknown as React.MouseEvent<HTMLDivElement>,
    );
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const closeMenu = () => setMenuPosition(null);

  useEffect(() => {
    if (!menuPosition) return;
    const handleOutside = () => closeMenu();
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    // 메뉴를 연 클릭 자체가 바로 닫히지 않도록 다음 tick에 등록
    const timer = setTimeout(() => {
      document.addEventListener('click', handleOutside);
      document.addEventListener('contextmenu', handleOutside);
      document.addEventListener('keydown', handleEscape);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleOutside);
      document.removeEventListener('contextmenu', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuPosition]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const startRename = () => {
    setEditValue(folder.name);
    setIsEditing(true);
    closeMenu();
  };

  const cancelRename = () => {
    setIsEditing(false);
    setEditValue(folder.name);
  };

  const submitRename = async () => {
    if (isSubmittingRef.current) return;

    const trimmed = editValue.trim();
    if (!trimmed || trimmed === folder.name) {
      cancelRename();
      return;
    }
    if (trimmed === '미할당') {
      showToast('사용할 수 없는 이름입니다.', 'warning');
      return;
    }

    isSubmittingRef.current = true;
    setIsEditing(false);
    try {
      await updateFolderName.mutateAsync({ id: folder.id, name: trimmed });
      showToast('폴더 이름을 변경했습니다.', 'success');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? '폴더 이름 변경에 실패했습니다.';
      showToast(message, 'error');
      setEditValue(folder.name);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitRename();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelRename();
    }
  };

  const requestDelete = () => {
    closeMenu();
    showConfirm(`'${folder.name}' 폴더를 삭제할까요?`, async () => {
      try {
        await removeFolder.mutateAsync(folder.id);
        showToast('폴더를 삭제했습니다.', 'success');
      } catch (error: any) {
        const message =
          error?.response?.data?.message ??
          '폴더가 비어있지 않아 삭제할 수 없습니다.';
        showToast(message, 'error');
      }
    });
  };

  return (
    <div
      className="relative z-30 flex w-full cursor-pointer select-none items-center justify-between px-2 py-3 transition-colors duration-200 hover:bg-slate-100/70"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseDown={e => e.stopPropagation()}
      onContextMenu={handleContextMenu}
      role="button"
      tabIndex={0}
      aria-expanded={!isOpened}
      data-folder-id={folder.id}
      data-accordion-header="true"
    >
      {isEditing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={handleEditKeyDown}
          onBlur={submitRename}
          onClick={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
          maxLength={30}
          className="w-full text-sm font-semibold text-gray-900 bg-white rounded-md border border-ftBlue/40 outline-none px-1.5 py-0.5"
        />
      ) : (
        <span className="w-full overflow-hidden text-ellipsis text-xs font-bold text-slate-700">
          {/* 가입 초기에 이름 없이 만들어진 기본 폴더 등, 빈 이름 폴더가 라벨 없이 보이지 않도록 폴백 */}
          {folder.name || '이름 없는 폴더'}
        </span>
      )}
      <span className="ml-2 flex shrink-0 items-center gap-2 text-[10px] text-slate-400">
        {folder.tags.length}
        <IoChevronDown
          aria-hidden
          className={`h-4 w-4 transition-transform duration-300 ${
            isOpened ? 'rotate-180' : ''
          }`}
        />
      </span>

      {menuPosition && (
        <div
          className="fixed z-50 py-1 w-36 bg-white rounded-lg border border-gray-100 shadow-lg"
          style={{ top: menuPosition.y, left: menuPosition.x }}
          onClick={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            onClick={startRename}
            className="flex items-center gap-2 px-3 py-2 w-full text-sm text-left text-gray-700 hover:bg-gray-50"
          >
            이름 변경
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={requestDelete}
            className="flex items-center gap-2 px-3 py-2 w-full text-sm text-left text-red-600 hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(FolderItem, (prev, next) => {
  return (
    prev.folder.id === next.folder.id &&
    prev.isOpened === next.isOpened &&
    prev.folder.name === next.folder.name
  );
});
