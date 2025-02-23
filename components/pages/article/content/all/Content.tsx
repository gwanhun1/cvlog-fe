import MarkdownContent from 'components/Shared/MarkdownContent';
import ContentSkeleton from './Skeleton';

const Content = ({
  data,
  isLoading,
  writer,
}: {
  data?: string;
  isLoading: boolean;
  writer: string;
}) => {
  return (
    <div className="w-full">
      {isLoading ? (
        <ContentSkeleton />
      ) : (
        <MarkdownContent content={data} writer={writer} />
      )}
    </div>
  );
};

export default Content;
