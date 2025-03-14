import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { deleteAccount } from 'service/api/user';

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
      localStorage.removeItem('token');

      router.push('/');
    } catch (err) {
      setError('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('회원 탈퇴 오류:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="bg-white rounded-xl p-8 shadow-sm border border-blue-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">계정 관리</h2>
      <div className="space-y-4">
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="w-full px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? '처리 중...' : '회원 탈퇴'}
        </button>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        <p className="text-xs text-gray-500 leading-relaxed">
          탈퇴 시 작성하신 포스트가 모두 삭제되며 복구되지 않습니다. 다른
          사용자의 게시물에 작성한 댓글은 유지됩니다.
        </p>
      </div>
    </section>
  );
};

export default AccountManagement;
