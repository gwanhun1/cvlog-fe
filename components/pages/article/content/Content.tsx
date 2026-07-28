import MarkdownContent from 'components/Shared/MarkdownContent';
import ContentSkeleton from './Skeleton';

interface ContentProps {
  id?: number;
  data?: string | null;
  isLoading: boolean;
  writerId?: number;
}

const Content = ({ id, data, isLoading, writerId }: ContentProps) => {
  return (
    <div className="w-full">
      {isLoading ? (
        <ContentSkeleton />
      ) : (
        <MarkdownContent content={data} writerId={writerId} id={id} />
      )}
    </div>
  );
};

export default Content;
