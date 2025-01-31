import React, { Dispatch, SetStateAction } from 'react';
import { Avatar, Dropdown } from 'flowbite-react';
import Sessionstorage from 'public/utils/Sessionstorage';
import { useGetUserInfo } from 'service/hooks/Login';
import { signOut } from '../../../service/api/login/index';
import Loader from '../Loader';

const NavPriofile = ({ setAuthority }: Props) => {
  const info = useGetUserInfo().data;

  const handleSignOut = () => {
    if (window.confirm('로그아웃 하십니까?')) {
      signOut();
      const deleteCookie = function (name: string) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
      };
      deleteCookie('refreshToken');
      localStorage.removeItem('CVtoken');
      Sessionstorage.removeItem('recoil-persist');
      setAuthority(false);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  return (
    <nav>
      {info ? (
        <Dropdown
          arrowIcon={false}
          inline={true}
          label={
            <Avatar
              alt="User settings"
              img={`${info && info.profile_image}`}
              rounded={true}
            />
          }
          className="!bg-white shadow-lg border border-gray-200"
          theme={{
            floating: {
              target: 'w-fit',
              base: 'z-10 w-fit rounded-xl divide-y divide-gray-100 shadow-lg border border-gray-200',
              content: 'py-1 bg-white rounded-xl text-gray-900',
              header: 'block py-2 px-4 text-sm text-gray-900 bg-white',
              item: {
                base: 'block w-full py-2 px-4 text-sm text-gray-900 bg-white hover:bg-gray-50',
                icon: 'mr-2 h-4 w-4',
              },
            },
          }}
        >
          <Dropdown.Header className="flex justify-center py-2 border-b border-gray-100 bg-white">
            <div className="flex flex-col items-center gap-3">
              <span className="text-sm font-semibold text-gray-900">
                {info ? info.github_id : '아이디가 없어요'}
              </span>
              <span className="text-xs text-gray-600">
                {info && info.name !== null
                  ? info.name + '님 환영합니다'
                  : '이름을 등록해주세요'}
              </span>
            </div>
          </Dropdown.Header>
          <Dropdown.Item
            className="flex justify-center py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            onClick={() => handleSignOut()}
          >
            로그아웃
          </Dropdown.Item>
        </Dropdown>
      ) : (
        <Loader />
      )}
    </nav>
  );
};

export default NavPriofile;

interface Props {
  setAuthority: Dispatch<SetStateAction<boolean>>;
}
