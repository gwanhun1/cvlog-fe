import MarkdownContent from 'components/Shared/MarkdownContent';
import ContentSkeleton from './Skeleton';

interface ContentProps {
  id?: number;
  data?: string | null;
  isLoading: boolean;
  writer?: string;
}

const Content = ({ id, data, isLoading, writer }: ContentProps) => {
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
