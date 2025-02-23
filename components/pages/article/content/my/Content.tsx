import ContentSkeleton from '../all/Skeleton';
import MarkdownContent from 'components/Shared/MarkdownContent';

const Content = ({
  data,
  isLoading,
}: {
  data?: string;
  isLoading: boolean;
}) => {
  return (
    <div className="w-full">
      {isLoading ? <ContentSkeleton /> : <MarkdownContent content={data} />}
    </div>
  );
};

export default Content;
