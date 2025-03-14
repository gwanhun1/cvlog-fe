import ContentSkeleton from '../all/Skeleton';
import MarkdownContent from 'components/Shared/MarkdownContent';

interface ContentProps {
  id?: number;
  data?: string | null;
  isLoading: boolean;
}

const Content = ({ id, data, isLoading }: ContentProps) => {
  return (
    <div className="w-full">
      {isLoading ? (
        <ContentSkeleton />
      ) : (
        <MarkdownContent content={data} id={id} />
      )}
    </div>
  );
};

export default Content;
