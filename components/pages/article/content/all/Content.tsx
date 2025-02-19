import Loader from 'components/Shared/common/Loader';
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
      {isLoading ? <Loader /> : <MarkdownContent content={data} />}
    </div>
  );
};

export default Content;
