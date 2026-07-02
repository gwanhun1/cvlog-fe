import React from 'react';
import markdownToText from 'markdown-to-text';
import Image from 'next/image';
import { formatTimeAgo } from 'styles/utils/timeCheck';

export interface TagItem {
  id: number;
  name: string;
}

export interface CardProps {
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  tags: TagItem[];
}

const extractImageUrl = (content: string): string | undefined => {
  const regex = /!\[.*?\]\((.*?)\)/;
  const match = regex.exec(content);
  return match?.[1];
};

const removeImageFromContent = (content: string): string => {
  return content.replace(/!\[([^\]]*)\]\([^)]+\)/g, '').trim().replace(/\n\s*\n/g, '\n');
};

const LogmeAllCard: React.FC<CardProps> = ({ title, content, created_at, updated_at, tags }) => {
  const publishedAt = created_at ?? updated_at;
  const imageUrl = extractImageUrl(content);
  const cleanContent = removeImageFromContent(content);
  const plainText = markdownToText(cleanContent);
  const summary = plainText.length > 160 ? plainText.substring(0, 157) + '...' : plainText;

  return (
    <article className="group relative w-full overflow-hidden bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
      {imageUrl && (
        <div className="relative w-full h-0 pb-[52%] overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={title}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            priority
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}

      <div className="flex flex-col flex-grow justify-between p-4">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[16px] font-bold leading-snug text-gray-900 group-hover:text-ftBlue transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-[13px] leading-relaxed text-gray-500 line-clamp-2">
            {summary}
          </p>
        </div>

        <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
            {tags?.slice(0, 3).map(tag => (
              <span key={tag.id} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-medium">
                {tag.name}
              </span>
            ))}
            {tags && tags.length > 3 && (
              <span className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-400 rounded-md">
                +{tags.length - 3}
              </span>
            )}
          </div>
          {publishedAt && (
            <time
              suppressHydrationWarning
              className="flex-shrink-0 ml-3 text-xs text-gray-400"
            >
              {formatTimeAgo(publishedAt)}
            </time>
          )}
        </div>
      </div>
    </article>
  );
};

export default LogmeAllCard;
