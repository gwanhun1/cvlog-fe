import React from 'react';
import markdownToText from 'markdown-to-text';
import Image from 'next/image';
import TagList from './TagList';
import { formatTimeAgo } from 'styles/utils/timeCheck';
import { useStore } from 'service/store/useStore';
import { UserIdType } from 'service/api/detail/type';

export interface TagItem {
  id: number;
  name: string;
}

export interface CardProps {
  title: string;
  content: string;
  updated_at?: string;
  tags: TagItem[];
  user?: UserIdType;
}

const extractImageUrl = (content: string): string | undefined => {
  const regex = /!\[.*?\]\((.*?)\)/;
  const match = regex.exec(content);
  return match?.[1];
};

const removeImageFromContent = (content: string): string => {
  const cleanContent = content.replace(/!\[([^\]]*)\]\([^)]+\)/g, '').trim();
  return cleanContent.replace(/\n\s*\n/g, '\n');
};

const HighlightText = ({ text, keyword }: { text: string; keyword: string }) => {
  if (!keyword.trim()) return <>{text}</>;

  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 text-slate-900 rounded-sm not-italic">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

const Card = ({ title, updated_at, content, tags, user }: CardProps) => {
  const imageUrl = extractImageUrl(content);
  const cleanContent = removeImageFromContent(content);
  const keyword = useStore(state => state.tagAtom);
  const isMatched =
    keyword.trim() !== '' &&
    (title.toLowerCase().includes(keyword.toLowerCase()) ||
      tags.some(tag => tag.name.toLowerCase().includes(keyword.toLowerCase())));

  const plainTextContent = markdownToText(cleanContent);
  const summary =
    plainTextContent.length > 160
      ? plainTextContent.substring(0, 157) + '...'
      : plainTextContent;

  return (
    <article
      className={`relative group block w-full overflow-hidden transition-all duration-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 ${
        isMatched ? 'ring-2 ring-ftBlue/40' : ''
      }`}
      itemScope
      itemType="http://schema.org/BlogPosting"
    >
      <div className="flex flex-col w-full h-full">
        {imageUrl && (
          <div className="relative w-full h-0 pb-[56%] overflow-hidden bg-gray-50">
            {imageUrl.includes('googleusercontent.com') ||
            imageUrl.startsWith('http') ? (
              <img
                src={imageUrl}
                alt={title}
                className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                onError={e => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <Image
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                src={imageUrl}
                alt={title}
                priority
                style={{ objectFit: 'cover' }}
                fill
                sizes="100vw"
                onError={e => {
                  const imgElement = e.target as HTMLImageElement;
                  imgElement.style.display = 'none';
                }}
                itemProp="image"
              />
            )}
            <meta itemProp="thumbnailUrl" content={imageUrl} />
          </div>
        )}

        <div className="flex flex-col flex-grow justify-between p-4 w-full">
          <div className="flex flex-col gap-2">
            <h3
              className="text-[16px] font-bold leading-snug transition-colors text-gray-900 group-hover:text-ftBlue line-clamp-2"
              itemProp="headline"
            >
              <HighlightText text={title} keyword={keyword} />
            </h3>
            <p
              className="text-[13px] leading-relaxed text-gray-500 line-clamp-2"
              itemProp="description"
            >
              <HighlightText text={summary} keyword={keyword} />
            </p>
            <meta
              itemProp="keywords"
              content={tags.map(tag => tag.name).join(', ')}
            />
          </div>

          <div className="flex justify-between items-center pt-2.5 mt-2.5 border-t border-gray-100">
            <div className="flex-1 min-w-0">
              <TagList tags={tags} keyword={keyword} />
            </div>
            {updated_at && (
              <time
                className="flex-shrink-0 ml-3 text-xs text-slate-400"
                itemProp="dateModified"
                dateTime={updated_at}
              >
                {formatTimeAgo(updated_at)}
              </time>
            )}
          </div>
          {updated_at && <meta itemProp="datePublished" content={updated_at} />}
        </div>

        {/* 작성자 정보 (호버 시 아래에서 위로 슬라이드) */}
        {user && (
          <div className="overflow-hidden absolute right-0 bottom-0 pointer-events-none">
            <div className="flex items-center gap-2 py-1.5 px-3 mb-2 mr-2 bg-white/80 backdrop-blur-md rounded-full border shadow-sm transition-all duration-300 translate-y-full opacity-0 border-ftBlue/20 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="overflow-hidden relative w-5 h-5 rounded-full ring-1 ring-ftBlue/10">
                {user.profile_image?.includes('googleusercontent.com') ? (
                  <img
                    src={user.profile_image}
                    alt={user.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Image
                    src={user.profile_image}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <span className="text-xs font-medium text-slate-600">
                {user.name}
              </span>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default Card;
