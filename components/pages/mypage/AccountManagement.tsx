import React from 'react';

const AccountManagement = () => (
  <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">계정 관리</h2>
    <div className="space-y-4">
      <button
        onClick={() => alert('업데이트 중입니다')}
        className="w-full px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
      >
        회원 탈퇴
      </button>
      <p className="text-xs text-gray-500 leading-relaxed">
        탈퇴 시 작성하신 포스트 및 댓글이 모두 삭제되며 복구되지 않습니다.
      </p>
    </div>
  </section>
);

export default AccountManagement;
