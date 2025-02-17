export enum KeyMap {
  ENTER = 'Enter',
  ESCAPE = 'Escape',
  SPACE = 'Space',
  TAB = 'Tab',
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  HOME = 'Home',
  END = 'End',
  PAGE_UP = 'PageUp',
  PAGE_DOWN = 'PageDown',
  BACKSPACE = 'Backspace',
  DELETE = 'Delete',
  SHIFT = 'Shift',
  CONTROL = 'Control',
  ALT = 'Alt',
  META = 'Meta',
  CAPS_LOCK = 'CapsLock',
  NUM_LOCK = 'NumLock',
  PRINT_SCREEN = 'PrintScreen',
  INSERT = 'Insert',
}

export const EDITOR_CONSTANTS = {
  TAG_MAX_LENGTH: 22,
  MOBILE_BREAKPOINT: 1024,
  IMAGE_COMPRESSION: {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
  },
} as const;

export const ERROR_MESSAGES = {
  TAG_TOO_LONG: '태그가 너무 깁니다.',
  DUPLICATE_TAG: '중복된 태그입니다.',
  LOGIN_REQUIRED: '로그인이 필요합니다.',
  TITLE_REQUIRED: '제목을 입력해주세요.',
  CONTENT_REQUIRED: '내용을 입력해주세요.',
  USER_INFO_REQUIRED: '사용자 정보를 불러올 수 없습니다. 다시 로그인해주세요.',
  IMAGE_UPLOAD_FAILED: '이미지 업로드에 실패했습니다.',
  POST_SAVE_FAILED: '게시글 저장 중 오류가 발생했습니다. 다시 시도해주세요.',
} as const;

export const EDITOR_PATHS = {
  UPLOAD_ENDPOINT: `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/upload`,
} as const;
