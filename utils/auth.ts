import LocalStorage from 'public/utils/Localstorage';
import Sessionstorage from 'public/utils/Sessionstorage';
import { signOut as apiSignOut } from '../service/api/login';
import { useSetRecoilState } from 'recoil';
import { userIdAtom } from '../service/atoms/atoms';
import { UserInfoType } from '../service/atoms/type';

export const handleSignOut = async (
  setAuthority?: (authority: string | null) => void,
) => {
  if (window.confirm('로그아웃 하십니까?')) {
    await apiSignOut();

    // 로컬 스토리지 초기화
    LocalStorage.removeItem('access_token');
    LocalStorage.removeItem('cv_refresh_token');
    LocalStorage.removeItem('user_info');
    Sessionstorage.removeItem('recoil-persist');

    // userIdAtom 초기화
    const setUserId = useSetRecoilState(userIdAtom);
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

    // 권한 상태 업데이트 (있는 경우)
    if (setAuthority) {
      setAuthority(null);
    }

    // 홈으로 리다이렉트
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
};
