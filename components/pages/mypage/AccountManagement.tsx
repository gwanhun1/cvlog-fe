import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { deleteAccount } from 'service/api/login';

const AccountManagement = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      '정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없으며, 작성한 모든 게시물이 삭제됩니다. (다른 게시물에 작성한 댓글은 유지됩니다)'
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);

      await deleteAccount();

      // 모든 인증 정보 정리
      localStorage.removeItem('token');
      localStorage.removeItem('LogmeToken');
      localStorage.clear();

      // 쿠키 정리
      document.cookie.split(';').forEach(c => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });

      router.push('/');
    } catch (err) {
      setError('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('회원 탈퇴 오류:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleDeleteAccount}
        disabled={isDeleting}
        className="px-4 py-3 w-full text-sm font-medium text-red-600 bg-red-50 rounded-lg transition-colors hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDeleting ? '처리 중...' : '회원 탈퇴'}
      </button>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      <p className="text-xs leading-relaxed text-gray-500">
        탈퇴 시 작성하신 포스트가 모두 삭제되며 복구되지 않습니다. 다른 사용자의
        게시물에 작성한 댓글은 유지됩니다.
      </p>
    </div>
  );
};

export default AccountManagement;
