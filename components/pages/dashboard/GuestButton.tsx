import Link from 'next/link';
import * as Shared from 'components/Shared';

const GuestButton = () => {
  return (
    <Link href="/" className="w-full " prefetch={true}>
      <div className="p-4 bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl shadow-lg transition-all duration-300 hover:border-blue-200 hover:shadow-2xl hover:bg-blue-50/50 transform hover:-translate-y-2 text-center">
        <Shared.LogmeText
          type="caption"
          fontStyle="bold"
          className="text-gray-800 hover:text-blue-700 text-lg"
        >
          게스트 모드 시작하기
          <br />
          <span className="text-sm text-gray-500 hover:text-blue-600">
            Start with Guest Mode
          </span>
        </Shared.LogmeText>
      </div>
    </Link>
  );
};

export default GuestButton;
