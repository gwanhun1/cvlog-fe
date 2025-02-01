import Cookie from 'public/utils/Cookie';
import LocalStorage from 'public/utils/Localstorage';
import Sessionstorage from 'public/utils/Sessionstorage';
import { signOut as apiSignOut } from '../service/api/login';

export const handleSignOut = async (setAuthority?: (value: boolean) => void) => {
  if (window.confirm('로그아웃 하십니까?')) {
    await apiSignOut();
    
    // 쿠키 삭제
    const deleteCookie = (name: string) => {
      document.cookie = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
    };
    deleteCookie('refreshToken');
    
    // 로컬 스토리지 및 세션 스토리지 클리어
    LocalStorage.removeItem('CVtoken');
    Sessionstorage.removeItem('recoil-persist');
    
    // 권한 상태 업데이트 (있는 경우)
    if (setAuthority) {
      setAuthority(false);
    }

    // 홈으로 리다이렉트
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
};
