import LocalStorage from 'public/utils/Localstorage';
import Sessionstorage from 'public/utils/Sessionstorage';
import { signOut as apiSignOut } from '../service/api/login';
import { SetterOrUpdater } from 'recoil';
import { UserInfoType } from 'service/api/login/type';

export const handleSignOut = async (
  setAuthority?: (authority: string | null) => void,
  setUserId?: SetterOrUpdater<UserInfoType>
) => {
  if (window.confirm('로그아웃 하십니까?')) {
    await apiSignOut();

    // 로컬 스토리지 초기화
    LocalStorage.removeItem('LogmeToken');
    LocalStorage.removeItem('user_info');
    Sessionstorage.removeItem('recoil-persist');

    if (setUserId) {
      setUserId({
        id: 0,
        created_at: '',
        deleted_at: null,
        description: null,
        github_id: '',
        name: '',
        profile_image: '',
        refresh_token: '',
        updated_at: '',
      });
    }

    if (setAuthority) {
      setAuthority(null);
    }

    window.location.href = '/login';
  }
};
