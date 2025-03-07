import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { UserInfoType } from 'service/api/login/type';

const { persistAtom } = recoilPersist({
  key: 'recoil-persist',
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
});

export const authorityState = atom<boolean>({
  key: 'cvlog_auth_state_v1',
  default: false,
});

export const refreshTokenAtom = atom<string>({
  key: 'cvlog_refresh_token_v1',
  default: '',
});

export const accessTokenAtom = atom<string>({
  key: 'cvlog_access_token_v1',
  default: '',
});

export const listIndexAtom = atom<number>({
  key: 'cvlog_list_index_v1',
  default: 999999,
});

export const userIdAtom = atom<UserInfoType>({
  key: 'cvlog_user_info_v1',
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
  key: 'tag',
  default: '',
});
