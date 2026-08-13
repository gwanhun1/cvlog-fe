import markdownToText from 'markdown-to-text';

export const extractPostImage = (content: string): string | undefined => {
  const match = /!\[.*?\]\((.*?)\)/.exec(content);
  return match?.[1];
};

export const getPostExcerpt = (content: string, maxLength = 160): string => {
  const withoutImages = content
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/\n\s*\n/g, '\n')
    .trim();
  const plainText = markdownToText(withoutImages).trim();

  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength - 3).trimEnd()}...`;
};
