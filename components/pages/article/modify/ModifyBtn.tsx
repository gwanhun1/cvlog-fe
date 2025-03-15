import { IoIosCloseCircle } from 'react-icons/io';
import { useRouter } from 'next/router';
import { EDITOR_CONSTANTS, ERROR_MESSAGES, KeyMap } from 'lib/constants';
import * as Shared from 'components/Shared';
import { Badge } from 'flowbite-react';
import { useModifyPost } from 'service/hooks/Detail';
import { DocType } from 'pages/article/modify/[pid]';
import LocalStorage from 'public/utils/Localstorage';
import { useCallback, useState } from 'react';
import { userIdAtom } from 'service/atoms/atoms';
import { useRecoilValue } from 'recoil';
import Tooltip from 'components/Shared/common/Tooltip';
import LoaderAnimation from 'components/Shared/common/LoaderAnimation';

interface ModifyBtnProps {
  doc: DocType;
  setDoc: React.Dispatch<React.SetStateAction<DocType>>;
  pid: string;
  imageArr: string[];
}

const ModifyBtn = ({ doc, setDoc, pid, imageArr }: ModifyBtnProps) => {
  const router = useRouter();
  const accessToken = LocalStorage.getItem('LogmeToken') as string;
  const [tag, setTag] = useState('');
  const userInfo = useRecoilValue(userIdAtom);

  const mutationCreatModifyPost = useModifyPost(parseInt(pid));
  const [isLoading, setIsLoading] = useState(false);

  const handleTagChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setTag(value);
    },
    []
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setDoc(prev => ({ ...prev, title: value }));
    },
    [setDoc]
  );

  const handleCreateTag = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!tag || e.key !== KeyMap.ENTER || e.nativeEvent.isComposing) return;

      if (tag && tag.length >= EDITOR_CONSTANTS.TAG_MAX_LENGTH) {
        alert(ERROR_MESSAGES.TAG_TOO_LONG);
        setTag('');
        return;
      }

      if (doc.tags.includes(tag)) {
        alert(ERROR_MESSAGES.DUPLICATE_TAG);
        setTag('');
        return;
      }

      setDoc(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTag('');
    },
    [tag, doc.tags, setDoc]
  );

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      setDoc(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove),
      }));
    },
    [setDoc]
  );

  const handleSavePost = useCallback(() => {
    const userId = userInfo?.id;
    if (!userId || !accessToken) {
      alert(ERROR_MESSAGES.LOGIN_REQUIRED);
      return;
    }

    const createForm = {
      title: doc.title,
      content: doc.content,
      user_id: userId,
      category_id: 1,
      tags: doc.tags,
      files: imageArr,
    };

    setIsLoading(true);
    mutationCreatModifyPost.mutate(createForm, {
      onSettled: () => {
        setIsLoading(false);
      },
    });
  }, [doc, imageArr, userInfo?.id, accessToken, mutationCreatModifyPost]);

  return (
    <>
      {isLoading && <LoaderAnimation />}
      <div className="tablet:pt-4 tablet:relative">
        <div className="z-30 flex items-center justify-end gap-2 absolute bottom-0 tablet:top-0 tablet:bottom-auto right-0 tablet:mt-2 mb-2 tablet:mb-0">
          <Shared.LogmeButton
            variant="ghost"
            size="small"
            onClick={() =>
              accessToken ? router.push('/article') : router.push('/')
            }
          >
            <Shared.LogmeHeadline type="medium" fontStyle="semibold">
              취소
            </Shared.LogmeHeadline>
          </Shared.LogmeButton>

          <Shared.LogmeButton
            variant="classic"
            size="small"
            onClick={() =>
              accessToken ? handleSavePost() : alert('로그인 먼저 해주세요..')
            }
          >
            <Shared.LogmeHeadline
              type="medium"
              fontStyle="semibold"
              style={{ color: '#fff' }}
            >
              저장
            </Shared.LogmeHeadline>
          </Shared.LogmeButton>
        </div>
        <div className="flex relative px-2 border-b tablet:pt-2 border-gray-400">
          <input
            className="w-full h-10 font-bold placeholder:text-gray-500 placeholder:text-xs tablet:text-2xl placeholder-zinc-600 tablet:placeholder:text-2xl"
            name="title"
            value={doc.title}
            placeholder="오늘의 특별한 주제는 무엇인가요? 🌟"
            onChange={handleTitleChange}
          />
        </div>
        <div className="min-h-[83px]">
          <div className="relative flex px-2 pt-4 border-b border-gray-400">
            <Tooltip
              content="태그를 입력하면 검색, 필터, 하이라이트 기능을 사용할 수 있어요. Enter 키로 추가해 주세요."
              position="bottom"
            >
              <input
                className="z-10 w-full text-sm placeholder:text-gray-500 h-7 tablet:text-xl placeholder:text-xs placeholder-zinc-600 tablet:placeholder:text-lg placeholder:italic"
                name="tag"
                value={tag}
                placeholder="태그를 만들어주세요."
                onKeyDown={handleCreateTag}
                onChange={handleTagChange}
              />
            </Tooltip>
          </div>
          <div className="flex justify-between mt-2 ">
            <div
              className="h-10 overflow-x-scroll mb-1 whitespace-nowrap"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {doc.tags.map((tag, index) => (
                <Badge
                  className="relative inline-flex items-center px-3 mr-1 mt-1 rounded-full border-2 border-blue-300 bg-blue-200 text-blue-800 hover:bg-blue-200 hover:border-blue-400 transition-all duration-300"
                  color="default"
                  size="sm"
                  key={`${tag}-${index}`}
                >
                  {tag}
                  <button
                    onClick={() => {
                      handleRemoveTag(tag);
                    }}
                  >
                    <IoIosCloseCircle className="absolute w-4 h-4 right-[-5px] top-[-5px] hover:block hover:cursor-pointer text-red-600 hover:text-red-700 transition-all duration-200 transform hover:scale-110" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModifyBtn;
