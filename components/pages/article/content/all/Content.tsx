import MarkdownContent from 'components/Shared/MarkdownContent';
import ContentSkeleton from './Skeleton';

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
