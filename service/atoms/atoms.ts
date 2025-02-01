import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { UserInfo } from './type';

const { persistAtom } = recoilPersist({
  key: 'recoil-persist',
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
});

export const authorityState = atom<boolean>({
  key: 'authorityState',
  default: false,
});

export const refreshTokenAtom = atom<string>({
  key: 'refreshToken',
  default: '',
});

export const accessTokenAtom = atom<string>({
  key: 'accessToken',
  default: '',
});

export const listIndexAtom = atom<number>({
  key: 'listIndex',
  default: 999999,
});

export const userIdAtom = atom<{ id: number }>({
  key: 'userId',
  default: { id: 999999 },
  effects_UNSTABLE: [persistAtom],
});
