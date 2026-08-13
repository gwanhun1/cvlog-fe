import Link from 'next/link';

interface PostInfo {
  id: number;
  title: string;
}

interface PostNavigationProps {
  prevPostInfo?: PostInfo | null;
  nextPostInfo?: PostInfo | null;
  basePath: string;
}

const NavigationLink = ({
  post,
  label,
  direction,
  basePath,
}: {
  post: PostInfo;
  label: string;
  direction: 'previous' | 'next';
  basePath: string;
}) => {
  const isNext = direction === 'next';

  return (
    <Link
      href={`${basePath}/${post.id}`}
      className={`group flex min-h-[72px] items-center gap-4 py-3 transition-colors hover:text-ftBlue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ftBlue focus-visible:ring-offset-4 ${
        isNext ? 'justify-end text-right' : ''
      }`}
    >
      {!isNext && (
        <span aria-hidden="true" className="w-5 flex-shrink-0 text-lg text-slate-300 transition-colors group-hover:text-ftBlue">
          ←
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-xs font-semibold text-slate-400">{label}</div>
        <div className="line-clamp-1 text-sm font-semibold text-slate-700 group-hover:text-ftBlue">
          {post.title}
        </div>
      </div>
      {isNext && (
        <span aria-hidden="true" className="w-5 flex-shrink-0 text-lg text-slate-300 transition-colors group-hover:text-ftBlue">
          →
        </span>
      )}
    </Link>
  );
};

const PostNavigation = ({
  prevPostInfo,
  nextPostInfo,
  basePath,
}: PostNavigationProps) => {
  if (!prevPostInfo && !nextPostInfo) return null;

  return (
    <section
      aria-label="이전 글과 다음 글"
      className="w-full border-y border-ftBlue/15 bg-ftBlue/[0.035] px-4 tablet:px-5"
    >
      <div className={prevPostInfo && nextPostInfo ? 'grid grid-cols-2' : 'flex'}>
        {prevPostInfo && (
          <div className={nextPostInfo ? 'pr-8' : 'w-1/2'}>
            <NavigationLink
              post={prevPostInfo}
              label="이전 글"
              direction="previous"
              basePath={basePath}
            />
          </div>
        )}
        {nextPostInfo && (
          <div className={`border-ftBlue/15 ${prevPostInfo ? 'border-l pl-8' : 'ml-auto w-1/2'}`}>
            <NavigationLink
              post={nextPostInfo}
              label="다음 글"
              direction="next"
              basePath={basePath}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default PostNavigation;
