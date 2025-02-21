import type { Options } from 'easymde';

export const MDE_OPTIONMOBILE: Options = {
  spellChecker: false,
  sideBySideFullscreen: false,
  toolbar: [
    'bold',
    'italic',
    'heading',
    '|',
    'quote',
    'unordered-list',
    'ordered-list',
    '|',
    'link',
    'image',
    'table',
    '|',
    'preview',
    'guide',
  ],
  insertTexts: {
    horizontalRule: ['', '\n\n-----\n\n'],
    image: ['![](http://', ')'],
    link: ['[', '](http://)'],
    table: [
      '',
      '\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n',
    ],
  },
  tabSize: 2,
  maxHeight: '30vh',
  status: ['lines', 'words'],
  renderingConfig: {
    singleLineBreaks: false,
    codeSyntaxHighlighting: true,
  },
  parsingConfig: {
    allowAtxHeaderWithoutSpace: false,
    strikethrough: true,
    underscoresBreakWords: false,
  },
};

export const MDE_OPTION: Options = {
  spellChecker: false,
  sideBySideFullscreen: false,
  maxHeight: '65vh',
  minHeight: '200px',
  toolbar: [
    'bold',
    'italic',
    'heading-1',
    'heading-2',
    'heading-3',
    '|',
    'quote',
    'unordered-list',
    'ordered-list',
    '|',
    'link',
    'image',
    'table',
    'code',
    '|',
    'preview',
    'side-by-side',
    'fullscreen',
    '|',
    'guide',
  ],
  renderingConfig: {
    singleLineBreaks: false,
    codeSyntaxHighlighting: true,
  },
  parsingConfig: {
    allowAtxHeaderWithoutSpace: false,
    strikethrough: true,
    underscoresBreakWords: false,
  },
  previewRender: (text: string) => {
    return text;
  },
};
