import { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from 'styles/utils';
import TagHighlight from './TagHighlight';

interface TocItemsProps {
  contentRef: React.RefObject<HTMLDivElement>;
  content: string;
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

import { CiCircleChevUp, CiCircleChevDown } from 'react-icons/ci';

const TocItemsContainer = ({ content, contentRef }: TocItemsProps) => {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [showTagHighlight, setShowTagHighlight] = useState<boolean>(false);
  const isScrollingRef = useRef(false);
  const activeIdRef = useRef<string>('');

  useEffect(() => {
    if (!contentRef.current || !content) return;

    const extractTocItems = () => {
      const headingElements = contentRef.current?.querySelectorAll(
        'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]'
      );

      if (!headingElements) return [];

      const items: TOCItem[] = [];
      headingElements.forEach(el => {
        const id = el.getAttribute('id');
        if (!id) return;

        const level = parseInt(el.tagName.substring(1));
        const text = el.textContent || '';

        items.push({ id, text, level });
      });

      return items;
    };

    setTimeout(() => {
      const items = extractTocItems();
      setTocItems(items);

      if (items.length > 0) {
        setActiveId(items[0].id);
        activeIdRef.current = items[0].id;
      }
    }, 300);
  }, [content, contentRef]);

  const handleScroll = useCallback(() => {
    if (isScrollingRef.current) return;

    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;

    if (scrollPosition > viewportHeight * 0.2) {
      setShowTagHighlight(true);
    } else {
      setShowTagHighlight(false);
    }

    const headingElements = tocItems.map(item => ({
      id: item.id,
      element: document.getElementById(item.id),
    }));

    // 현재 스크롤 위치에 따른 헤더 높이 반영
    const headerHeight = window.scrollY > 50 ? 48 : 96;
    const gap = 15; 
    const adjustedScrollPosition = scrollPosition + headerHeight + gap + 10; // 인지 범위를 고려한 보정치
    let currentId = headingElements[0]?.id || '';

    for (const { id, element } of headingElements) {
      if (element) {
        // offsetTop 대신 절대 좌표 사용
        const elementAbsoluteTop =
          element.getBoundingClientRect().top + window.scrollY;
        if (elementAbsoluteTop <= adjustedScrollPosition) {
          currentId = id;
        } else {
          break;
        }
      }
    }

    if (currentId && currentId !== activeIdRef.current) {
      activeIdRef.current = currentId;
      setActiveId(currentId);
    }
  }, [tocItems]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems, handleScroll]);

  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (!element) return;

    isScrollingRef.current = true;
    setActiveId(headingId);
    activeIdRef.current = headingId;

    // 문서 전체에서의 요소 절대 위치 계산
    const elementAbsoluteTop =
      element.getBoundingClientRect().top + window.scrollY;

    // 이동할 지점이 최상단 부근이면 큰 헤더(96px), 아니면 작은 헤더(48px) 기준
    const isTopContent = elementAbsoluteTop < 200;
    const headerHeight = isTopContent ? 96 : 48;
    const gap = 15; // 40px에서 15px 줄여서 더 밀착되게 조정
    const offset = headerHeight + gap;

    window.scrollTo({
      top: elementAbsoluteTop - offset,
      behavior: 'smooth',
    });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 700);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div>
      {tocItems.length > 0 && (
        <details className="fixed bottom-4 right-4 z-30 desktop:hidden">
          <summary className="flex min-h-[44px] cursor-pointer list-none items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ftBlue">
            목차
          </summary>
          <nav
            aria-label="게시글 목차"
            className="absolute bottom-12 right-0 max-h-[52vh] w-[min(19rem,calc(100vw-2rem))] overflow-y-auto rounded-[14px] border border-slate-200 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.16)]"
          >
            <ul className="space-y-1">
              {tocItems.map(item => (
                <li key={item.id}>
                  <button
                    type="button"
                    style={{ paddingLeft: `${Math.max(item.level - 1, 0) * 0.75 + 0.75}rem` }}
                    className={cn(
                      'min-h-[40px] w-full truncate rounded-lg pr-3 text-left text-sm transition-colors',
                      activeId === item.id
                        ? 'bg-ftBlue/5 font-bold text-ftBlue'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-ftBlue'
                    )}
                    onClick={() => scrollToHeading(item.id)}
                  >
                    {item.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      )}

      <div className="tablet:fixed tablet:left-1/2 tablet:translate-x-[480px] tablet:w-52 tablet:top-40">
        <div className="hidden desktop:flex flex-col gap-5">
          {/* 맨 위로 버튼 */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-all duration-200 text-xs font-bold group ml-4"
          >
            <CiCircleChevUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
            <span className="tracking-tighter">맨 위로</span>
          </button>

          {tocItems.length > 0 && (
            <nav className="tablet:h-fit tablet:border-l tablet:border-gray-200 max-h-[60vh] overflow-y-auto scrollbar-hide">
              <ul className="space-y-2 pl-4">
                {tocItems.map(item => (
                  <li key={item.id}>
                    <button
                      type="button"
                      style={{ paddingLeft: `${Math.max(item.level - 1, 0)}rem` }}
                      className={cn(
                        'w-full truncate whitespace-nowrap py-1 text-left text-sm transition-colors duration-200 hover:text-ftBlue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ftBlue',
                        activeId === item.id
                          ? 'font-bold text-ftBlue'
                          : 'text-slate-600'
                      )}
                      onClick={() => scrollToHeading(item.id)}
                    >
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* 맨 아래로 버튼 */}
          <button
            onClick={scrollToBottom}
            className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-all duration-200 text-xs font-bold group ml-4"
          >
            <CiCircleChevDown className="w-6 h-6 group-hover:translate-y-1 transition-transform duration-300" />
            <span className="tracking-tighter">맨 아래로</span>
          </button>

          <div
            className={cn(
              'pl-4 transition-opacity duration-300',
              showTagHighlight ? 'opacity-100' : 'opacity-0 hidden'
            )}
          >
            <TagHighlight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TocItemsContainer;
