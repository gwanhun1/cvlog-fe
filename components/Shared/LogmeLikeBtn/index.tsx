import * as Shared from 'components/Shared';

interface LogmeLikeBtnProps {
  isOwnPost: boolean;
}

const LogmeLikeBtn = ({ isOwnPost }: LogmeLikeBtnProps) => {
  if (isOwnPost) return null;
  
  return (
    <div className="fixed left-[calc(50%-450px)] top-[200px] z-10 hidden lg:block">
      <div className="border border-gray-200 rounded-lg w-10 h-20">
        <button className="rounded-full">
          <Shared.LogmeIcon.LikeIcon
            alt="like"
            width={50}
            height={50}
            cn="absolute w-3 h-3 right-[-5px] top-[-5px] hover:block hover:cursor-pointer text-blue-800 hover:text-blue-700 transition-all duration-200 transform hover:scale-110"
          />
        </button>
      </div>
    </div>
  );
};

export default LogmeLikeBtn;
