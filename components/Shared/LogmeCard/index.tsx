import React from 'react';
import { Badge } from 'flowbite-react';
import markdownToText from 'markdown-to-text';
import Image from 'next/image';

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

const formatTimeAgo = (date: string): string => {
  try {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    switch (true) {
      case diff < minute:
        return `${diff}초 전`;
      case diff < hour:
        return `${Math.floor(diff / minute)}분 전`;
      case diff < day:
        return `${Math.floor(diff / hour)}시간 전`;
      case diff < week:
        return `${Math.floor(diff / day)}일 전`;
      case diff < month:
        return `${Math.floor(diff / week)}주 전`;
      case diff < year:
        return `${Math.floor(diff / month)}개월 전`;
      default:
        return `${Math.floor(diff / year)}년 전`;
    }
  } catch {
    return '';
  }
};

const Card: React.FC<CardProps> = ({ title, updated_at, content, tags }) => {
  const imageUrl = extractImageUrl(content);
  const cleanContent = removeImageFromContent(content);

  return (
    <article className="block w-full overflow-hidden transition-all duration-300 bg-white border rounded-lg shadow-sm hover:shadow-lg relative">
      <div
        className={`flex flex-col tablet:flex-row ${
          imageUrl ? 'tablet:h-[280px]' : 'tablet:h-[200px]'
        }`}
      >
        <div className="flex flex-col justify-between p-5 w-full">
          <div className="h-full flex flex-col">
            <h3 className="mb-2 text-2xl font-bold leading-tight text-gray-900 hover:text-blue-600 line-clamp-2">
              {title}
            </h3>
            <p
              className={`text-gray-600 ${
                imageUrl ? 'line-clamp-4' : 'line-clamp-3'
              } overflow-hidden`}
            >
              {markdownToText(cleanContent)}
            </p>
            <div className="flex items-center mt-auto">
              <div className="flex-1">
                {tags && tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge
                        key={tag.id}
                        className="relative flex items-center px-3  mx-2 mt-1 rounded-full border-2 border-blue-300 bg-blue-200 text-blue-800 hover:bg-blue-200 hover:border-blue-400 transition-all duration-300"
                        color="default"
                        size="sm"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
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
