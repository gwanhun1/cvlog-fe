import { useRouter } from 'next/router';
import { FiBookOpen } from 'react-icons/fi';

type ActivityRowProps = {
  title: string;
  time: string;
  id: number;
};

const ActivityRow = ({ title, time, id }: ActivityRowProps) => {
  const router = useRouter();
  const handleClick = (id: number) => {
    router.push(`/article/content/${id}`);
  };

  return (
    <div
      className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg mb-4 transition-colors hover:bg-gray-100 hover:cursor-pointer"
      onClick={() => handleClick(id)}
    >
      <div className="p-3 bg-blue-100 rounded-lg">
        <FiBookOpen className="w-5 h-5 text-blue-600" aria-hidden="true" />
      </div>
      <div>
        <p className="text-gray-900 font-medium mb-1">{title}</p>
        <p className="mb-1 text-gray-500 text-xs">{time}</p>
      </div>
    </div>
  );
};
export default ActivityRow;
