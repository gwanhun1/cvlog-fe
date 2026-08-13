import { useEffect, useState } from 'react';
import LocalStorage from 'public/utils/Localstorage';

interface MenuTabProps {
  setMenu: React.Dispatch<React.SetStateAction<'list' | 'all'>>;
  activeMenu?: 'list' | 'all';
}

const MenuTab = ({ setMenu, activeMenu = 'list' }: MenuTabProps) => {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    setHasToken(Boolean(LocalStorage.getItem('LogmeToken')));
  }, []);

  useEffect(() => {
    if (hasToken === false && activeMenu === 'list') {
      setMenu('all');
    }
  }, [activeMenu, hasToken, setMenu]);

  const isReady = hasToken !== null;
  const showMyPosts = hasToken === true;
  const resolvedMenu = showMyPosts ? activeMenu : 'all';

  const tabClass = (selected: boolean) =>
    `relative min-h-[44px] whitespace-nowrap px-1 text-[13px] font-bold transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:bg-ftBlue after:transition-transform after:duration-300 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ftBlue focus-visible:ring-offset-2 ${
      selected
        ? 'text-slate-950 after:scale-x-100'
        : 'text-slate-400 after:scale-x-0 hover:text-slate-700'
    }`;

  return (
    <div
      className="flex min-h-[44px] items-center gap-5"
      role="group"
      aria-label="게시물 보기 범위"
    >
      <button
        type="button"
        onClick={isReady ? () => setMenu('all') : undefined}
        disabled={!isReady}
        aria-pressed={resolvedMenu === 'all'}
        className={tabClass(resolvedMenu === 'all')}
      >
        전체 글
      </button>

      {showMyPosts && (
        <button
          type="button"
          onClick={() => setMenu('list')}
          aria-pressed={resolvedMenu === 'list'}
          className={tabClass(resolvedMenu === 'list')}
        >
          내 기록
        </button>
      )}
    </div>
  );
};

export default MenuTab;
