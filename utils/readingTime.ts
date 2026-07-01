import removeMarkdown from 'markdown-to-text';

/**
 * 마크다운 본문에서 예상 읽기 시간(분)을 계산한다.
 * 한글은 분당 약 500자, 영문 단어는 분당 약 200단어 기준으로 합산한 뒤 반올림한다.
 * 아주 짧은 글도 최소 1분으로 표기한다. AI/외부 호출 없이 순수 계산.
 */
export const getReadingTimeMinutes = (content?: string | null): number => {
  if (!content) return 1;

  let plain = content;
  try {
    plain = removeMarkdown(content);
  } catch {
    plain = content;
  }

  const koreanChars = (plain.match(/[가-힣]/g) || []).length;
  const englishWords = (plain.trim().match(/[A-Za-z0-9]+/g) || []).length;

  const minutes = koreanChars / 500 + englishWords / 200;
  return Math.max(1, Math.round(minutes));
};
