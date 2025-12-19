import Link from 'next/link';
import type React from 'react';

interface PostInfo {
  id: number;
  title: string;
}

type ProfileDetailData = {
  id?: number;
  name?: string | null;
  github_id?: string | null;
  profile_image?: string | null;
  description?: string | null;
};

interface PostNavigationProps {
  prevPostInfo?: PostInfo | null;
  nextPostInfo?: PostInfo | null;
  basePath: string;
  userInfo?: ProfileDetailData;
  ProfileComponent: React.ComponentType<{ getDetailData?: ProfileDetailData }>;
}

const PostNavigation = ({
  prevPostInfo,
  nextPostInfo,
  basePath,
  userInfo,
  ProfileComponent,
}: PostNavigationProps) => {
  return (
    <section className="mt-10 w-full">
      <div className="w-full rounded-2xl border border-gray-200 backdrop-blur-sm bg-white/70">
        <div className="px-2 pt-4">
          <ProfileComponent getDetailData={userInfo} />
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 tablet:gap-4">
          {/* 이전 포스트 */}
          <div>
            {prevPostInfo ? (
              <Link href={`${basePath}/${prevPostInfo.id}`} prefetch>
                <div className="flex gap-3 items-center p-4 h-full bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 cursor-pointer group hover:bg-gray-100 hover:border-gray-300">
                  <div className="flex justify-center items-center w-8 h-8 bg-gray-200 rounded-full transition-colors group-hover:bg-gray-300">
                    <span className="text-gray-600">←</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="mb-1 text-xs text-gray-500">
                      이전 포스트
                    </span>
                    <span className="text-sm font-semibold text-gray-800 truncate">
                      {prevPostInfo.title}
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex gap-3 items-center p-4 h-full bg-gray-50 rounded-xl border border-gray-100 opacity-40 cursor-not-allowed">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <span className="text-sm text-gray-400">이전 포스트 없음</span>
              </div>
            )}
          </div>

          {/* 다음 포스트 */}
          <div>
            {nextPostInfo ? (
              <Link href={`${basePath}/${nextPostInfo.id}`} prefetch>
                <div className="flex gap-3 justify-end items-center p-4 h-full bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 cursor-pointer group hover:bg-gray-100 hover:border-gray-300">
                  <div className="flex flex-col flex-1 min-w-0 text-right">
                    <span className="mb-1 text-xs text-gray-500">
                      다음 포스트
                    </span>
                    <span className="text-sm font-semibold text-gray-800 truncate">
                      {nextPostInfo.title}
                    </span>
                  </div>
                  <div className="flex justify-center items-center w-8 h-8 bg-gray-200 rounded-full transition-colors group-hover:bg-gray-300">
                    <span className="text-gray-600">→</span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex gap-3 justify-end items-center p-4 h-full bg-gray-50 rounded-xl border border-gray-100 opacity-40 cursor-not-allowed">
                <span className="text-sm text-gray-400">다음 포스트 없음</span>
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostNavigation;
