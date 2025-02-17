import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Avatar, Dropdown } from 'flowbite-react';
import dynamic from 'next/dynamic';
import { useGetUserInfo } from 'service/hooks/Login';
import { handleSignOut } from 'utils/auth';
import Loader from '../common/Loader';

// 클라이언트 사이드에서만 렌더링되는 드롭다운 컴포넌트
const ClientDropdown = dynamic(
  () =>
    Promise.resolve(({ info, onClickLogout }: any) => (
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
          onClick={onClickLogout}
        >
          로그아웃
        </Dropdown.Item>
      </Dropdown>
    )),
  { ssr: false }
);

const NavPriofile = ({ setAuthority }: Props) => {
  const { data: info, isLoading } = useGetUserInfo();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onClickLogout = async () => {
    await handleSignOut((value: string | null) => setAuthority(!!value));
  };

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <nav>
        <Loader />
      </nav>
    );
  }

  return (
    <nav>
      {info ? (
        <ClientDropdown info={info} onClickLogout={onClickLogout} />
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
