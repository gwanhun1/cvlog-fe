import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { TagType } from 'service/api/detail/type';
import { UserInfoType } from 'service/api/login/type';

const { persistAtom } = recoilPersist({
  key: 'recoil-persist',
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
});

const getAtomKey = (key: string) => key;

const getClientItem = (key: string) => {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(key) ?? '';
};

export const authorityState = atom<boolean>({
  key: getAtomKey('logme_auth_state_v1'),
  default: false,
});

export const refreshTokenAtom = atom<string>({
  key: getAtomKey('logme_refresh_token_v1'),
  default: '',
});

export const accessTokenAtom = atom<string>({
  key: getAtomKey('logme_access_token_v1'),
  default: getClientItem('LogmeToken'),
});

export const listIndexAtom = atom<number>({
  key: getAtomKey('logme_list_index_v1'),
  default: 999999,
});

export const userIdAtom = atom<UserInfoType>({
  key: getAtomKey('logme_user_info_v1'),
  default: {
    id: 0,
    github_id: '',
    name: '',
    profile_image: '',
    description: null,
    refresh_token: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  },
  effects_UNSTABLE: [persistAtom],
});

export const tagAtom = atom<string>({
  key: getAtomKey('tag'),
  default: '',
});

export const tagListAtom = atom<TagType[]>({
  key: getAtomKey('tagList'),
  default: [],
});

export const selectedTagListAtom = atom<TagType[]>({
  key: getAtomKey('selectedTagList'),
  default: [],
});
