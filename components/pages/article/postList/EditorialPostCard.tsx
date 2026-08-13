import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { IoGlobeOutline, IoLockClosedOutline } from 'react-icons/io5';
import { BlogType } from 'service/api/tag/type';
import { formatTimeAgo } from 'styles/utils/timeCheck';
import { getDisplayName } from 'utils/user';
import { extractPostImage, getPostExcerpt } from './postPresentation';

interface EditorialPostCardProps {
  post: BlogType;
  keyword: string;
  mode: 'public' | 'my';
}

const HighlightText = ({
  text,
  keyword,
}: {
  text: string;
  keyword: string;
}) => {
  if (!keyword.trim()) return <>{text}</>;

  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <mark
            key={`${part}-${index}`}
            className="rounded-sm bg-ftBlue/10 text-ftBlue"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
};

const EditorialPostCard = ({ post, keyword, mode }: EditorialPostCardProps) => {
  const imageUrl = extractPostImage(post.content);
  const [imageFailed, setImageFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const publishedAt = post.created_at ?? post.updated_at;
  const excerpt = getPostExcerpt(post.content, 150);
  const authorName = getDisplayName(post.user, 'LOGME 사용자');
  const isMatched =
    keyword.trim() !== '' &&
    (post.title.toLowerCase().includes(keyword.toLowerCase()) ||
      post.tags.some(tag =>
        tag.name.toLowerCase().includes(keyword.toLowerCase()),
      ));

  useEffect(() => {
    const image = imageRef.current;
    if (image && image.complete && image.naturalWidth === 0) {
      setImageFailed(true);
    }
  }, []);

  return (
    <article
      className={`group relative overflow-hidden rounded-[14px] border bg-white transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-ftBlue/30 hover:shadow-[0_16px_40px_rgba(38,87,166,0.12)] ${
        isMatched
          ? 'border-ftBlue/40 shadow-[0_0_0_2px_rgba(38,87,166,0.08)]'
          : 'border-slate-200/90'
      }`}
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      <meta
        itemProp="mainEntityOfPage"
        content={`https://logme.cloud/article/content/${post.id}`}
      />
      <meta itemProp="dateModified" content={post.updated_at} />
      <meta
        itemProp="keywords"
        content={post.tags.map(tag => tag.name).join(', ')}
      />

      {imageUrl && !imageFailed && (
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
          {imageUrl.startsWith('http') ? (
            <img
              ref={imageRef}
              src={imageUrl}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              onError={() => setImageFailed(true)}
              itemProp="image"
            />
          ) : (
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(max-width: 1023px) 100vw, (max-width: 1439px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              onError={() => setImageFailed(true)}
              itemProp="image"
            />
          )}
        </div>
      )}

      <div className="p-5">
        <div className="mb-3 flex min-h-[22px] items-center justify-between gap-3 text-[11px] font-medium text-slate-400">
          <div className="min-w-0">
            {post.tags[0] && (
              <span className="truncate font-semibold text-ftBlue">
                <HighlightText text={post.tags[0].name} keyword={keyword} />
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            {mode === 'my' && (
              <span
                className={`flex items-center gap-1 font-semibold ${
                  post.public_status ? 'text-emerald-700' : 'text-slate-500'
                }`}
                aria-label={
                  post.public_status
                    ? '이 게시물은 공개되어 있습니다'
                    : '이 게시물은 나만 볼 수 있습니다'
                }
              >
                {post.public_status ? (
                  <IoGlobeOutline aria-hidden className="h-3.5 w-3.5" />
                ) : (
                  <IoLockClosedOutline aria-hidden className="h-3.5 w-3.5" />
                )}
                {post.public_status ? '공개됨' : '나만 보기'}
              </span>
            )}
            {publishedAt && (
              <time
                suppressHydrationWarning
                dateTime={publishedAt}
                itemProp="datePublished"
                className="shrink-0"
              >
                {formatTimeAgo(publishedAt)}
              </time>
            )}
          </div>
        </div>

        <h3
          className="m-0 text-[19px] font-bold leading-[1.35] tracking-[-0.025em] text-slate-900 transition-colors duration-200 group-hover:text-ftBlue"
          itemProp="headline"
        >
          <HighlightText text={post.title} keyword={keyword} />
        </h3>

        {excerpt && (
          <p
            className="mb-0 mt-3 line-clamp-3 text-[13px] leading-[1.75] text-slate-500"
            itemProp="description"
          >
            {excerpt}
          </p>
        )}

        {post.tags.length > 1 && (
          <div className="mt-5 flex flex-wrap gap-1.5 border-t border-slate-100 pt-4">
            {post.tags.slice(1, 4).map(tag => (
              <span
                key={tag.id}
                className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500"
              >
                <HighlightText text={tag.name} keyword={keyword} />
              </span>
            ))}
            {post.tags.length > 4 && (
              <span className="px-1 py-1 text-[10px] text-slate-400">
                +{post.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {mode === 'public' && post.user && (
        <div className="pointer-events-none absolute bottom-0 right-0 overflow-hidden p-2">
          <div
            className="flex translate-y-[calc(100%+8px)] items-center gap-2 rounded-full border border-ftBlue/20 bg-white/90 px-3 py-1.5 opacity-0 shadow-sm backdrop-blur-md transition-[transform,opacity] duration-300 ease-out group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus/card:translate-y-0 group-focus/card:opacity-100"
            itemProp="author"
            itemScope
            itemType="https://schema.org/Person"
            aria-label={`작성자 ${authorName}`}
          >
            <div className="relative flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ftBlue/10 text-[9px] font-bold text-ftBlue ring-1 ring-ftBlue/10">
              {post.user.profile_image ? (
                <Image
                  src={post.user.profile_image}
                  alt=""
                  fill
                  sizes="20px"
                  className="object-cover"
                />
              ) : (
                authorName.slice(0, 1).toUpperCase()
              )}
            </div>
            <span
              className="max-w-[150px] truncate text-xs font-semibold text-slate-600"
              itemProp="name"
            >
              {authorName}
            </span>
          </div>
        </div>
      )}
    </article>
  );
};

export default EditorialPostCard;
