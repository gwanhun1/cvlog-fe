import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import AuthGuard from 'components/Shared/common/AuthGuard';
import LikedListContainer from 'components/pages/article/postList/LikedListContainer';
import { AiFillHeart } from 'react-icons/ai';

const LikedPostsPage: NextPage = () => {
  return (
    <AuthGuard>
      <Head>
        <title>좋아요한 글 | LOGME</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="px-4 pt-8 pb-12 mx-auto max-w-6xl tablet:px-6 desktop:px-8">

        {/* 페이지 헤더 */}
        <div className="mb-6">
          <Link
            href="/article"
            className="inline-flex items-center gap-1 mb-4 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            블로그로 돌아가기
          </Link>
          <div className="flex items-center gap-3">
            <AiFillHeart className="text-2xl text-red-400 flex-shrink-0" />
            <h1 className="text-2xl font-bold text-ftBlack">좋아요한 글</h1>
          </div>
        </div>

        {/* 콘텐츠 */}
        <LikedListContainer />

      </div>
    </AuthGuard>
  );
};

export default LikedPostsPage;
