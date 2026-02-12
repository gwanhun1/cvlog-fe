import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TagType } from 'service/api/detail/type';
import { UserInfoType } from 'service/api/login/type';

interface StoreState {
  authorityState: boolean;
  refreshTokenAtom: string;
  accessTokenAtom: string;
  listIndexAtom: number;
  userIdAtom: UserInfoType;
  tagAtom: string;
  tagListAtom: TagType[];
  selectedTagListAtom: TagType[];

  setAuthorityState: (state: boolean) => void;
  setRefreshTokenAtom: (token: string) => void;
  setAccessTokenAtom: (token: string) => void;
  setListIndexAtom: (index: number) => void;
  setUserIdAtom: (userInfo: UserInfoType) => void;
  setTagAtom: (tag: string) => void;
  setTagListAtom: (list: TagType[]) => void;
  setSelectedTagListAtom: (list: TagType[]) => void;
  resetStore: () => void;
}

const initialUserId: UserInfoType = {
  id: 0,
  github_id: '',
  name: '',
  profile_image: '',
  description: null,
  refresh_token: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      authorityState: false,
      refreshTokenAtom: '',
      accessTokenAtom: '',
      listIndexAtom: 999999,
      userIdAtom: initialUserId,
      tagAtom: '',
      tagListAtom: [],
      selectedTagListAtom: [],

      setAuthorityState: (state) => set({ authorityState: state }),
      setRefreshTokenAtom: (token) => set({ refreshTokenAtom: token }),
      setAccessTokenAtom: (token) => set({ accessTokenAtom: token }),
      setListIndexAtom: (index) => set({ listIndexAtom: index }),
      setUserIdAtom: (userInfo) => set({ userIdAtom: userInfo }),
      setTagAtom: (tag) => set({ tagAtom: tag }),
      setTagListAtom: (list) => set({ tagListAtom: list }),
      setSelectedTagListAtom: (list) => set({ selectedTagListAtom: list }),
      resetStore: () => set({
        authorityState: false,
        refreshTokenAtom: '',
        accessTokenAtom: '',
        listIndexAtom: 999999,
        userIdAtom: initialUserId,
        tagAtom: '',
        tagListAtom: [],
        selectedTagListAtom: [],
      }),
    }),
    {
      name: 'logme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ userIdAtom: state.userIdAtom }), // Only persist userIdAtom as in Recoil
    }
  )
);
