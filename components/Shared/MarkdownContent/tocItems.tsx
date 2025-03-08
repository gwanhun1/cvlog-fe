import { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from 'styles/utils';

type TocItemsProps = {
  contentRef: React.RefObject<HTMLDivElement>;
  content: string;
};

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

const TocItemsContainer = ({ content, contentRef }: TocItemsProps) => {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const isScrollingRef = useRef(false);
  const activeIdRef = useRef<string>(''); // 현재 activeId 저장용

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
        activeIdRef.current = items[0].id; // 초기값 설정
      }
    }, 300);
  }, [content, contentRef]);

  const handleScroll = useCallback(() => {
    if (isScrollingRef.current) return;

    const headingElements = tocItems.map(item => ({
      id: item.id,
      element: document.getElementById(item.id),
    }));

    const scrollPosition = window.scrollY + 150;
    let currentId = headingElements[0]?.id || '';

    for (const { id, element } of headingElements) {
      if (element && element.offsetTop <= scrollPosition) {
        currentId = id;
      } else {
        break;
      }
    }

    if (currentId && currentId !== activeIdRef.current) {
      activeIdRef.current = currentId;
      setActiveId(currentId); // 상태 변경
    }
  }, [tocItems]); // activeId 의존성 제거

  useEffect(() => {
    if (tocItems.length === 0) return;

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems, handleScroll]);

  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (!element) return;

    isScrollingRef.current = true;
    setActiveId(headingId);
    activeIdRef.current = headingId;

    const headerOffset = -220;
    const elementPosition = element.offsetTop;

    window.scrollTo({
      top: elementPosition - headerOffset,
      behavior: 'smooth',
    });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 700);
  };

  return (
    <>
      {tocItems.length > 0 && (
        <nav className="tablet:fixed tablet:top-40 tablet:left-1/2 tablet:translate-x-[480px] tablet:w-64 tablet:h-fit tablet:ml-8 tablet:p-4 tablet:border-l tablet:border-gray-200">
          <ul className="space-y-2">
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
    </>
  );
};
export default TocItemsContainer;
