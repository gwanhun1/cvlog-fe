import MarkdownContent from 'components/Shared/MarkdownContent';
import ContentSkeleton from './Skeleton';

const Content = ({
  data,
  isLoading,
  writer,
  id,
}: {
  data?: string;
  isLoading: boolean;
  writer?: string;
  id?: number;
}) => {
  return (
    <div className="w-full">
      {isLoading ? (
        <ContentSkeleton />
      ) : (
        <MarkdownContent content={data} writer={writer} id={id} />
      )}
    </div>
  );
};

export default Content;
