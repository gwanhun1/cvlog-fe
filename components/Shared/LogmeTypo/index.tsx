import React from 'react';

interface LogmeTypoBaseProps {
  fontStyle?: 'bold' | 'semibold' | 'regular';
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export interface LogmeHeadlineProps extends LogmeTypoBaseProps {
  type: 'display' | 'big' | 'medium' | 'small';
  link?: boolean;
}

export interface LogmeTextProps extends LogmeTypoBaseProps {
  type: 'title' | 'body' | 'label' | 'caption';
  link?: boolean;
}

// 헤드라인 스타일 컴포넌트
export const LogmeHeadline = ({
  type,
  fontStyle,
  className,
  style,
  children,
  link,
}: LogmeHeadlineProps) => {
  let fontWeight = '';
  switch (fontStyle) {
    case 'bold':
      fontWeight = 'font-bold';
      break;
    case 'semibold':
      fontWeight = 'font-semibold';
      break;
    case 'regular':
      fontWeight = 'font-normal';
      break;
  }

  let fontSize = '';
  switch (type) {
    case 'display':
      fontSize = 'text-4xl'; // 36px
      break;
    case 'big':
      fontSize = 'text-2xl'; // 24px
      break;
    case 'medium':
      fontSize = 'text-base'; // 16px
      break;
    case 'small':
      fontSize = 'text-sm'; // 14px
      break;
  }

  const headlineClassNames = `m-0 ${fontWeight} ${fontSize} ${className || ''}`;

  return (
    <h1 className={headlineClassNames} style={style} {...(link && { as: 'a' })}>
      {children}
    </h1>
  );
};

// 텍스트 스타일 컴포넌트
export const LogmeText = ({
  type,
  fontStyle,
  className,
  style,
  children,
  link,
}: LogmeTextProps) => {
  let fontWeight = '';
  switch (fontStyle) {
    case 'bold':
      fontWeight = 'font-bold';
      break;
    case 'semibold':
      fontWeight = 'font-semibold';
      break;
    case 'regular':
      fontWeight = 'font-normal';
      break;
  }

  let fontSize = '';
  switch (type) {
    case 'title':
      fontSize = 'text-base'; // 16px
      break;
    case 'body':
      fontSize = 'text-sm'; // 14px
      break;
    case 'label':
      fontSize = 'text-xs'; // 12px
      break;
    case 'caption':
      fontSize = 'text-xs'; // 12px
      break;
  }

  const textClassNames = `m-0 ${fontWeight} ${fontSize} ${className || ''}`;

  return (
    <p className={textClassNames} style={style} {...(link && { as: 'a' })}>
      {children}
    </p>
  );
};
