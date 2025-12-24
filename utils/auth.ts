import LocalStorage from 'public/utils/Localstorage';
import Sessionstorage from 'public/utils/Sessionstorage';
import { signOut as apiSignOut } from '../service/api/login';
import { useStore } from 'service/store/useStore';

export const handleSignOut = async (
  setAuthority?: (authority: string | null) => void
) => {
  if (window.confirm('로그아웃 하십니까?')) {
    try {
      await apiSignOut();
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
    } finally {
      // 로컬 스토리지 초기화
      LocalStorage.removeItem('LogmeToken');
      LocalStorage.removeItem('user_info');
      // Sessionstorage.removeItem('recoil-persist'); // No longer needed
      localStorage.removeItem('logme-storage'); // Zustand persist key

      // 권한 정보 초기화
      if (setAuthority) {
        setAuthority(null);
      }

      // Reset global store (Zustand)
      useStore.getState().resetStore();

      // 로그인 페이지로 리다이렉트
      window.dispatchEvent(new Event('storage'));

      window.location.href = '/login';
    }
  }
};
