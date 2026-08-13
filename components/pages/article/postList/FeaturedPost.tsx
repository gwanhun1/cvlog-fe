import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogType } from 'service/api/tag/type';
import { formatTimeAgo } from 'styles/utils/timeCheck';
import { extractPostImage, getPostExcerpt } from './postPresentation';

interface FeaturedPostProps {
  post: BlogType;
}

const FeaturedPost = ({ post }: FeaturedPostProps) => {
  const imageUrl = extractPostImage(post.content);
  const [imageFailed, setImageFailed] = useState(false);
  const excerpt = getPostExcerpt(post.content, 190);
  const publishedAt = post.created_at ?? post.updated_at;

  return (
    <article className="min-w-0 desktop:only:col-span-2">
      {imageUrl && !imageFailed ? (
        <Link
          href={`/article/content/${post.id}`}
          className="group/media relative block aspect-[16/8] overflow-hidden rounded-[14px] bg-slate-100 focus-visible:ring-2 focus-visible:ring-ftBlue focus-visible:ring-offset-2 desktop:aspect-[16/6.4]"
          aria-label={`게시물 보기: ${post.title}`}
        >
          {imageUrl.startsWith('http') ? (
            <img
              src={imageUrl}
              alt=""
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-700 ease-out group-hover/media:scale-[1.025] group-hover/media:saturate-[1.06]"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <Image
              src={imageUrl}
              alt=""
              fill
              priority
              sizes="(max-width: 1439px) 100vw, 820px"
              className="object-cover transition-[transform,filter] duration-700 ease-out group-hover/media:scale-[1.025] group-hover/media:saturate-[1.06]"
              onError={() => setImageFailed(true)}
            />
          )}

          <div className="absolute inset-0 flex flex-col justify-end bg-slate-950/80 p-5 text-white transition-[background-color] duration-300 ease-out desktop:bg-slate-950/20 desktop:group-hover/media:bg-slate-950/80 desktop:group-focus-visible/media:bg-slate-950/80">
            <div className="transition-opacity duration-300 ease-out desktop:opacity-20 desktop:group-hover/media:opacity-100 desktop:group-focus-visible/media:opacity-100">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-white/70">
                {post.tags[0] && (
                  <span className="font-semibold text-white">
                    {post.tags[0].name}
                  </span>
                )}
                {publishedAt && (
                  <>
                    <span aria-hidden className="text-white/40">
                      /
                    </span>
                    <time suppressHydrationWarning dateTime={publishedAt}>
                      {formatTimeAgo(publishedAt)}
                    </time>
                  </>
                )}
              </div>

              <h2 className="mb-0 mt-2 max-w-[720px] text-[clamp(23px,2.35vw,32px)] font-bold leading-[1.2] tracking-[-0.04em] text-white">
                {post.title}
              </h2>

              {excerpt && (
                <p className="mb-0 mt-3 line-clamp-2 max-w-[680px] text-[13px] leading-[1.7] text-white/75">
                  {excerpt}
                </p>
              )}
            </div>
          </div>
        </Link>
      ) : (
        <div className="border-t-2 border-slate-900 pt-7">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-400">
            {post.tags[0] && (
              <span className="font-semibold text-ftBlue">
                {post.tags[0].name}
              </span>
            )}
            {publishedAt && (
              <>
                <span aria-hidden className="text-slate-300">
                  /
                </span>
                <time suppressHydrationWarning dateTime={publishedAt}>
                  {formatTimeAgo(publishedAt)}
                </time>
              </>
            )}
          </div>

          <h2 className="m-0 max-w-[820px] text-[clamp(25px,2.55vw,34px)] font-bold leading-[1.2] tracking-[-0.04em] text-slate-950">
            <Link
              href={`/article/content/${post.id}`}
              className="transition-colors duration-200 hover:text-ftBlue focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ftBlue focus-visible:ring-offset-2"
            >
              {post.title}
            </Link>
          </h2>

          {excerpt && (
            <p className="mb-0 mt-3 line-clamp-2 max-w-[720px] text-[14px] leading-[1.7] text-slate-500">
              {excerpt}
            </p>
          )}

          <div className="mt-4 flex items-center justify-end border-t border-slate-200 pt-3">
            <Link
              href={`/article/content/${post.id}`}
              className="text-xs font-bold text-ftBlue transition-transform duration-200 hover:translate-x-0.5 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ftBlue focus-visible:ring-offset-2"
            >
              글 읽기
            </Link>
          </div>
        </div>
      )}
    </article>
  );
};

export default FeaturedPost;
