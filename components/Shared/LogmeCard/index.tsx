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
  return content.replace(/!\[.*\]\(.+\)\n/g, '');
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

const Card: React.FC<CardProps> = ({
  title,
  updated_at,
  content,
  tags,
}) => {
  const imageUrl = extractImageUrl(content);
  const cleanContent = removeImageFromContent(content);

  return (
    <article className="w-full overflow-hidden transition-all duration-300 bg-white border rounded-lg shadow-sm hover:shadow-lg">
      <div className={`flex flex-col tablet:flex-row ${imageUrl ? 'tablet:h-[300px]' : 'tablet:h-[200px]'}`}>
        <div className="flex flex-col justify-between p-5 w-full">
          <div className="h-full flex flex-col">
            <h3 className="mb-2 text-4xl font-bold leading-tight text-gray-900 hover:text-blue-600 line-clamp-2">
              {title}
            </h3>
            <p className={`mb-4 text-gray-600 ${imageUrl ? 'line-clamp-3' : 'line-clamp-2'} flex-grow`}>
              {markdownToText(cleanContent)}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex-1">
                {tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge
                        key={tag.id}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-800"
                        color="info"
                        size="sm"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-none ml-4">
                {updated_at && (
                  <time className="text-sm text-gray-500">
                    {formatTimeAgo(updated_at)}
                  </time>
                )}
              </div>
            </div>
          </div>
        </div>
        {imageUrl && (
          <div className="relative tablet:w-1/3 h-full">
            <div className="aspect-w-16 aspect-h-9 tablet:aspect-h-full">
              <Image
                className="object-cover w-full h-full bg-gray-100 rounded-t-lg tablet:rounded-l-none tablet:rounded-r-lg"
                width={400}
                height={300}
                src={imageUrl}
                alt={title}
                priority
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default Card;
