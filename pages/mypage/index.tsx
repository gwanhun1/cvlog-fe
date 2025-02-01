import React from 'react';
import { useGetUserInfo } from 'service/hooks/Login';

const Mypage = () => {
  const getUserInfo = useGetUserInfo();
  return (
    <div className="flex justify-center w-full min-h-screen">
      <div className="flex flex-col justify-center py-10 my-10 rounded-lg mobile:w-5/6 tablet:w-4/6">
        <section>
          <article className="flex flex-col justify-center w-full tablet:px-10">
            <div className="flex justify-center w-full text-ftBlick">
              <div className="flex flex-col w-5/6 mt-4 border-t border-gray-500 tablet:mt-10 mobile:flex-row">
                <div className="p-3 text-xs font-bold w-28 mobile:ml-1 mobile:text-lg mobile:w-44 tablet:ml-0">
                  이메일 주소
                </div>
                <div className="w-full p-3 overflow-hidden text-xs truncate mobile:ml-2 mobile:text-base tablet:mx-10">
                  {getUserInfo.data && getUserInfo.data.github_id}@github.com
                </div>
              </div>
            </div>
            <div className="justify-center hidden w-full text-xs text-gray-600 mobile:flex tablet:justify-start tablet:text-base tablet:mx-20">
              회원 인증 또는 시스템에서 발송하는 이메일을 수신하는 주소입니다.
            </div>
          </article>
          <article className="flex flex-col justify-center w-full tablet:px-10">
            <div className="flex justify-center w-full">
              <div className="flex w-5/6 mt-4 border-t border-gray-500 tablet:mt-10">
                <div className="p-3 text-xs font-bold mobile:ml-1 mobile:text-lg tablet:ml-0 text-ftBlick">
                  회원 탈퇴
                </div>
                <div
                  className="flex items-center justify-center h-8 p-1 mt-2 mb-3 ml-5 text-xs bg-red-400 rounded-sm cursor-pointer mobile:mb-0 mobile:ml-12 hover:text-gray-900 tablet:h-10 tablet:ml-24 tablet:w-20 tablet:text-sm hover:opacity-70"
                  onClick={() => alert('업데이트 중입니다')}
                >
                  회원 탈퇴
                </div>
              </div>
            </div>
            <div className="justify-center hidden w-full text-xs text-gray-600 mobile:flex tablet:text-base tablet:justify-start tablet:mx-20 tablet:mt-3">
              탈퇴 시 작성하신 포스트 및 댓글이 모두 삭제되며 복구되지 않습니다.
            </div>
          </article>
        </section>
      </div>
    </div>
  );
};

export default Mypage;
