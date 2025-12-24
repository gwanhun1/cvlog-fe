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
    window.addEventListener('scroll', handleScroll);
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
    <div className="">
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
                  <li
                    key={item.id}
                    style={{ paddingLeft: `${(item.level - 1) * 1}rem` }}
                    className={cn(
                      'cursor-pointer hover:text-blue-500 transition-colors duration-200 py-1 text-sm truncate whitespace-nowrap',
                      activeId === item.id
                        ? 'text-blue-700 font-bold border-l-2 border-blue-500'
                        : 'text-gray-600'
                    )}
                    onClick={() => scrollToHeading(item.id)}
                  >
                    {item.text}
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
