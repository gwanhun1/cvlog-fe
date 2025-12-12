import React from 'react';
import markdownToText from 'markdown-to-text';
import Image from 'next/image';
import TagList from './TagList';
import { formatTimeAgo } from 'styles/utils/timeCheck';
import { useRecoilValue } from 'recoil';
import { tagAtom } from 'service/atoms/atoms';

export interface TagItem {
  id: number;
  name: string;
}

export interface CardProps {
  title: string;
  content: string;
  updated_at?: string;
  tags: TagItem[];
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

const Card = ({ title, updated_at, content, tags }: CardProps) => {
  const imageUrl = extractImageUrl(content);
  const cleanContent = removeImageFromContent(content);
  const keyword = useRecoilValue(tagAtom);
  const isMatched = tags.some(tag => tag.name.toLocaleLowerCase() === keyword);

  const plainTextContent = markdownToText(cleanContent);
  const summary =
    plainTextContent.length > 160
      ? plainTextContent.substring(0, 157) + '...'
      : plainTextContent;

  return (
    <article
      className={`group block w-full overflow-hidden transition-all duration-300 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-xl hover:-translate-y-1 ${
        isMatched ? 'border-blue-300 ring-2 ring-blue-400' : ''
      }`}
      itemScope
      itemType="http://schema.org/BlogPosting"
    >
      <div className="flex flex-col w-full h-full">
        {imageUrl && (
          <div className="relative w-full h-0 pb-[56%] overflow-hidden">
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
            <meta itemProp="thumbnailUrl" content={imageUrl} />
          </div>
        )}

        <div className="flex flex-col flex-grow justify-between p-5 w-full">
          <div className="flex flex-col gap-3">
            <h3
              className="text-lg font-bold leading-snug transition-colors text-slate-800 group-hover:text-blue-600 line-clamp-2"
              itemProp="headline"
            >
              {title}
            </h3>
            <p
              className="text-sm leading-relaxed text-slate-500 line-clamp-2"
              itemProp="description"
            >
              {summary}
            </p>
            <meta
              itemProp="keywords"
              content={tags.map(tag => tag.name).join(', ')}
            />
          </div>

          <div className="flex justify-between items-center pt-3 mt-4 border-t border-slate-100">
            <div className="flex-1 min-w-0">
              <TagList tags={tags} />
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
      </div>
    </article>
  );
};

export default Card;
