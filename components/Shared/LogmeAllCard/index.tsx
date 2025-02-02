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
  const cleanContent = content.replace(/!\[([^\]]*)\]\([^)]+\)/g, '').trim();
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

const LogmeAllCard: React.FC<CardProps> = ({
  title,
  content,
  updated_at,
  tags,
}) => {
  const imageUrl = extractImageUrl(content);
  const cleanContent = removeImageFromContent(content);

  return (
    <div className="rounded-lg h-[280px] w-full bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">
      {/* Image Section */}
      <div className="relative h-32 w-full bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            className="object-cover rounded-t-lg"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority
            onError={e => {
              const imgElement = e.target as HTMLImageElement;
              imgElement.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50" />
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col h-[calc(280px-128px)]">
        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
          {title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {markdownToText(cleanContent)}
        </p>

        {/* Tags and Time */}
        <div className="mt-auto">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.slice(0, 2).map(tag => (
              <Badge
                key={tag.id}
                className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700"
                color="info"
                size="sm"
              >
                {tag.name}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge
                className="px-2 py-0.5 text-xs bg-gray-50 text-gray-600"
                color="gray"
                size="sm"
              >
                +{tags.length - 2}
              </Badge>
            )}
          </div>

          {updated_at && (
            <time className="text-xs text-gray-500">
              {formatTimeAgo(updated_at)}
            </time>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogmeAllCard;
