import { useState, useCallback, useEffect } from 'react';

// 파란 계열 색상 15개
const blueColors = [
  '#60a5fa',
  '#7bb9f9',
  '#93c8f8',
  '#a9d7f7',
  '#bedff6',
  '#d4e6f5',
  '#e8ecf4',
  '#f3f9f3',
  '#f8fbf2',
  '#fdfdf1',
  '#ffffff',
  '#a2d2fb',
  '#89c8fb',
  '#6fbefb',
  '#57b4fa',
];

interface UseHighlightWordsProps {
  words: string[]; // 강조할 단어 배열
}

const useHighlightWords = ({ words }: UseHighlightWordsProps) => {
  const [highlightedText, setHighlightedText] = useState<string>(''); // 강조된 텍스트 상태

  // 텍스트에서 단어 강조하기
  const highlightText = useCallback(
    (text: string) => {
      if (!words.length) return text;

      let modifiedText = text;
      // 각 단어마다 순서대로 색을 적용
      words.forEach((word, index) => {
        if (!word) return;
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // 특수문자 이스케이프
        const regex = new RegExp(`(${escapedWord})`, 'gi'); // 대소문자 구분없이 단어 찾기
        const color = blueColors[index % blueColors.length]; // 색상 순번에 맞춰 색 적용
        modifiedText = modifiedText.replace(
          regex,
          match => `<span style="background-color: ${color}">${match}</span>`
        );
      });

      setHighlightedText(modifiedText); // 상태에 변경된 텍스트 저장
    },
    [words]
  );

  // 단어 배열이 변경될 때마다 텍스트 강조 적용
  useEffect(() => {
    if (words.length > 0) {
      highlightText(document.querySelector('.contentMarkdown')?.innerHTML || '');
    }
  }, [words, highlightText]);

  return {
    highlightedText, // 강조된 텍스트
  };
};

export default useHighlightWords;
