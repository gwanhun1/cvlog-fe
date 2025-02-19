import MarkdownContent from 'components/Shared/MarkdownContent';
import ContentSkeleton from './Skeleton';
import LogmeLikeBtn from 'components/Shared/LogmeLikeBtn';

const Content = ({
  data,
  isLoading,
}: {
  data?: string;
  isLoading: boolean;
}) => {
  return (
    <div className="w-full">
      {isLoading ? (
        <ContentSkeleton />
      ) : (
        <div className="flex">
          <LogmeLikeBtn />
          <MarkdownContent content={data} />
        </div>
      )}
    </div>
  );
};

export default Content;
