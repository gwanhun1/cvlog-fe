const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const highlightTagWords = (
  text: string,
  words: string[],
  colors: string[]
): string => {
  const tags = words
    .map((word, index) => ({ word, index }))
    .filter(({ word }) => word.length > 0)
    .sort((a, b) => b.word.length - a.word.length);
  if (!tags.length || !colors.length) return escapeHtml(text);

  const alternatives = tags.map(({ word }) =>
    word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  // Unicode letters, combining marks, numbers and underscores belong to a word.
  const regex = new RegExp(
    `(^|[^\\p{L}\\p{M}\\p{N}_])(${alternatives.join('|')})(?![\\p{L}\\p{M}\\p{N}_])`,
    'giu'
  );
  let result = '';
  let cursor = 0;
  let match: RegExpExecArray | null;
  // Match original text once so generated markup and HTML entities are never searched.
  while ((match = regex.exec(text)) !== null) {
    const start = match.index + match[1].length;
    const word = match[2];
    const tag = tags.find(({ word: candidate }) =>
      new RegExp(`^(?:${candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})$`, 'iu').test(word)
    )!;
    const color = colors[tag.index % colors.length];
    result += escapeHtml(text.slice(cursor, start));
    result += `<span style="background-color: ${escapeHtml(color)}">${escapeHtml(word)}</span>`;
    cursor = start + word.length;
  }
  return result + escapeHtml(text.slice(cursor));
};
