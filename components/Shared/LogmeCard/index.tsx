import React from 'react';
import { Badge } from 'flowbite-react';
import markdownToText from 'markdown-to-text';
import Image from 'next/image';
import TagList from './TagList';
import { formatTimeAgo } from 'styles/utils/timeCheck';

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
  // 이미지 마크다운 구문을 완전히 제거
  const cleanContent = content.replace(/!\[([^\]]*)\]\([^)]+\)/g, '').trim();
  // 연속된 빈 줄 제거
  return cleanContent.replace(/\n\s*\n/g, '\n');
};

const Card: React.FC<CardProps> = ({ title, updated_at, content, tags }) => {
  const imageUrl = extractImageUrl(content);
  const cleanContent = removeImageFromContent(content);

  return (
    <article className="group block w-full hover:bg-blue-50 overflow-hidden transition-all duration-300 bg-white border border-blue-100 rounded-lg shadow-sm hover:shadow-lg relative">
      <div
        className={`flex flex-col tablet:flex-row ${
          imageUrl ? 'tablet:h-[280px]' : 'tablet:h-[200px]'
        }`}
      >
        <div className="flex flex-col justify-between p-5 w-full">
          <div className="h-full flex flex-col">
            <h3 className="mb-2 text-2xl font-bold leading-tight text-gray-900 group-hover:text-blue-600 line-clamp-2">
              {title}
            </h3>
            <p
              className={`text-gray-600 ${
                imageUrl ? 'line-clamp-4' : 'line-clamp-3'
              } overflow-hidden group-hover:text-blue-600`}
            >
              {markdownToText(cleanContent)}
            </p>
            <div className="flex items-center mt-auto">
              <div className="flex-1">
                <TagList tags={tags} />
              </div>
            </div>
          </div>
        </div>
        {imageUrl && (
          <div className="relative tablet:w-3/5 h-full">
            <div className="relative w-full h-full">
              <Image
                className="object-cover rounded-t-lg tablet:rounded-l-none tablet:rounded-r-lg"
                src={imageUrl}
                alt={title}
                priority
                style={{ objectFit: 'cover' }}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                onError={e => {
                  const imgElement = e.target as HTMLImageElement;
                  imgElement.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
      </div>
      {updated_at && (
        <div className="absolute bottom-3 right-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full px-3 py-1 border border-blue-100/50 shadow-sm">
          <time className="text-xs font-medium text-blue-600/70">
            {formatTimeAgo(updated_at)}
          </time>
        </div>
      )}
    </article>
  );
};

export default Card;
