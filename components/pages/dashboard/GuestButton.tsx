import Link from 'next/link';
import * as Shared from 'components/Shared';

const GuestButton = () => {
  return (
    <Link href="/" className="w-full">
      <div className="h-11 flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm font-medium text-gray-600">
        게스트로 둘러보기
      </div>
    </Link>
  );
};

export default GuestButton;
