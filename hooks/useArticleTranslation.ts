import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 글 본문·댓글을 브라우저 내장 번역(Chrome Translator API)으로 번역한다.
 *
 * 서버로 텍스트를 보내지 않고 사용자 기기 안에서만 번역이 일어나므로
 *  - 비용이 발생하지 않고
 *  - 번역문이 저장·색인되지 않아 검색엔진에는 한국어 원문만 노출된다.
 *    (자동번역문을 그대로 배포하면 구글 스팸 정책 위반이다)
 *
 * 마크다운 원문 대신 렌더링된 DOM의 텍스트 노드만 바꾼다.
 * 원문 문자열을 번역하면 링크·코드펜스 같은 문법이 깨지기 때문이다.
 */

type TranslatorAvailability =
  | 'unavailable'
  | 'downloadable'
  | 'downloading'
  | 'available';

interface TranslatorInstance {
  translate: (input: string) => Promise<string>;
  destroy?: () => void;
}

interface TranslatorStatic {
  availability: (options: {
    sourceLanguage: string;
    targetLanguage: string;
  }) => Promise<TranslatorAvailability>;
  create: (options: {
    sourceLanguage: string;
    targetLanguage: string;
    monitor?: (monitor: EventTarget) => void;
  }) => Promise<TranslatorInstance>;
}

declare global {
  interface Window {
    Translator?: TranslatorStatic;
  }
}

export type TranslationStatus =
  | 'checking' // 지원 여부 확인 전. 이 동안은 버튼을 그리지 않아 깜빡임을 막는다.
  | 'unsupported'
  | 'idle'
  | 'preparing'
  | 'translating'
  | 'translated'
  | 'error';

const SOURCE_LANGUAGE = 'ko';

/** 코드·수식은 번역하면 의미가 깨지므로 건너뛴다. */
const SKIP_TAGS = new Set([
  'CODE',
  'PRE',
  'SCRIPT',
  'STYLE',
  'KBD',
  'SAMP',
  'VAR',
  'TEXTAREA',
]);

const isSkipped = (node: Text): boolean => {
  let el = node.parentElement;
  while (el) {
    if (SKIP_TAGS.has(el.tagName)) return true;
    el = el.parentElement;
  }
  return false;
};

const collectTextNodes = (root: HTMLElement): Text[] => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];

  let current = walker.nextNode();
  while (current) {
    const textNode = current as Text;
    // 공백·줄바꿈만 있는 노드는 번역할 것이 없다
    if (textNode.nodeValue?.trim() && !isSkipped(textNode)) {
      nodes.push(textNode);
    }
    current = walker.nextNode();
  }

  return nodes;
};

/** 방문자 브라우저 언어를 지역코드 없는 기본 코드로 (예: 'en-US' → 'en') */
const getVisitorLanguage = (): string =>
  (navigator.language || 'en').split('-')[0].toLowerCase();

/** 버튼에 표시할 언어 이름. Intl 미지원 시 코드를 그대로 쓴다. */
const getLanguageLabel = (code: string): string => {
  try {
    return new Intl.DisplayNames([code], { type: 'language' }).of(code) ?? code;
  } catch {
    return code;
  }
};

export const useArticleTranslation = (
  contentRef: React.RefObject<HTMLElement>
) => {
  const [status, setStatus] = useState<TranslationStatus>('checking');
  const [progress, setProgress] = useState(0);
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [targetLabel, setTargetLabel] = useState('English');
  // 원문 복원용. 번역 후 다시 누르면 되돌린다.
  const originalsRef = useRef<Map<Text, string> | null>(null);
  const translatorRef = useRef<TranslatorInstance | null>(null);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      // 미지원 브라우저(사파리·파이어폭스·모바일)와 SSR에서는 버튼을 노출하지 않는다.
      // 그쪽은 브라우저가 띄우는 기본 번역 배너가 대신 동작한다.
      if (typeof window === 'undefined' || !window.Translator) {
        if (!cancelled) setStatus('unsupported');
        return;
      }

      const visitorLanguage = getVisitorLanguage();

      // 한국어 사용자에게는 번역 버튼이 의미가 없다
      if (visitorLanguage === SOURCE_LANGUAGE) {
        if (!cancelled) setStatus('unsupported');
        return;
      }

      try {
        // API가 있어도 실제로 못 쓰는 경우가 있다(언어쌍 미지원, 디스크·RAM 부족).
        // 눌렀을 때 실패하지 않도록 미리 확인한다.
        const availability = await window.Translator.availability({
          sourceLanguage: SOURCE_LANGUAGE,
          targetLanguage: visitorLanguage,
        });

        if (cancelled) return;

        if (availability === 'unavailable') {
          setStatus('unsupported');
          return;
        }

        setTargetLanguage(visitorLanguage);
        setTargetLabel(getLanguageLabel(visitorLanguage));
        setStatus('idle');
      } catch {
        if (!cancelled) setStatus('unsupported');
      }
    };

    check();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      translatorRef.current?.destroy?.();
    };
  }, []);

  const restore = useCallback(() => {
    const originals = originalsRef.current;
    if (!originals) return;

    originals.forEach((text, node) => {
      // 번역 후 리렌더로 떨어져 나간 노드는 복원 대상이 아니다
      if (node.isConnected) node.nodeValue = text;
    });
    originalsRef.current = null;
    setStatus('idle');
  }, []);

  const translate = useCallback(async () => {
    const root = contentRef.current;
    const translatorApi = window.Translator;
    if (!root || !translatorApi) return;

    const nodes = collectTextNodes(root);
    if (nodes.length === 0) return;

    try {
      setStatus('preparing');
      setProgress(0);

      if (!translatorRef.current) {
        translatorRef.current = await translatorApi.create({
          sourceLanguage: SOURCE_LANGUAGE,
          targetLanguage,
          // 최초 1회는 번역 모델을 내려받는다. 진행률을 버튼에 표시한다.
          monitor: monitor => {
            monitor.addEventListener('downloadprogress', event => {
              const { loaded } = event as ProgressEvent;
              setProgress(Math.round(loaded * 100));
            });
          },
        });
      }

      const translator = translatorRef.current;
      setStatus('translating');

      const originals = new Map<Text, string>();
      for (const node of nodes) {
        const source = node.nodeValue ?? '';
        originals.set(node, source);
        // 노드 단위로 번역해야 링크·강조 같은 인라인 마크업이 보존된다
        node.nodeValue = await translator.translate(source);
      }

      originalsRef.current = originals;
      setStatus('translated');
    } catch (error) {
      console.error('본문 번역 실패:', error);
      restore();
      setStatus('error');
    }
  }, [contentRef, restore, targetLanguage]);

  const toggle = useCallback(() => {
    if (status === 'translated') {
      restore();
      return;
    }
    if (status === 'preparing' || status === 'translating') return;
    translate();
  }, [status, restore, translate]);

  return {
    status,
    progress,
    targetLabel,
    isTranslated: status === 'translated',
    isBusy: status === 'preparing' || status === 'translating',
    toggle,
  };
};
