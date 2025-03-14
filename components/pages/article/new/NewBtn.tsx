import { Badge } from 'flowbite-react';
import { useRouter } from 'next/router';
import { KeyboardEvent, useCallback, useState } from 'react';
import * as Shared from 'components/Shared';
import { EDITOR_CONSTANTS, ERROR_MESSAGES, KeyMap } from 'lib/constants';
import LocalStorage from 'public/utils/Localstorage';
import { useCreatePost } from 'service/hooks/New';
import { DocType } from 'pages/article/new';
import { useRecoilValue } from 'recoil';
import { userIdAtom } from 'service/atoms/atoms';
import { IoIosCloseCircle } from 'react-icons/io';
import Loader from 'components/Shared/common/Loader';
import Tooltip from 'components/Shared/common/Tooltip';

interface NewBtnProps {
  doc: DocType;
  setDoc: React.Dispatch<React.SetStateAction<DocType>>;
  imageArr: string[];
}

const NewBtn = ({ doc, setDoc, imageArr }: NewBtnProps) => {
  const [tag, setTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userInfo = useRecoilValue(userIdAtom);

  const mutationCreateNewPost = useCreatePost();
  const accessToken = LocalStorage.getItem('LogmeToken') as string;

  const onChangeTextarea = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setDoc(prev => ({ ...prev, [name as keyof DocType]: value }));
    },
    [setDoc]
  );

  const changeFocusContent = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== KeyMap.ENTER) return;
    e.preventDefault();
  };

  const createTags = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!tag || e.key !== KeyMap.ENTER || e.nativeEvent.isComposing) return;

      if (tag && tag.length >= EDITOR_CONSTANTS.TAG_MAX_LENGTH) {
        alert(ERROR_MESSAGES.TAG_TOO_LONG);
      } else if (doc.tags.includes(tag)) {
        alert(ERROR_MESSAGES.DUPLICATE_TAG);
      } else {
        setDoc(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      }
      setTag('');
    },
    [doc.tags, tag, setDoc]
  );

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      setDoc(prev => ({
        ...prev,
        tags: prev.tags.filter(item => item !== tagToRemove),
      }));
    },
    [setDoc]
  );

  const saveNewPost = useCallback(() => {
    const userId = userInfo?.id;

    if (!doc.title.trim()) {
      alert(ERROR_MESSAGES.TITLE_REQUIRED);
      return;
    }

    if (!doc.content.trim()) {
      alert(ERROR_MESSAGES.CONTENT_REQUIRED);
      return;
    }

    if (!userId) {
      alert(ERROR_MESSAGES.USER_INFO_REQUIRED);
      return;
    }

    const createForm = {
      title: doc.title.trim(),
      content: doc.content.trim(),
      user_id: userId,
      tags: doc.tags,
      files: imageArr,
    };

    try {
      setIsLoading(true);
      mutationCreateNewPost.mutate(createForm, {
        onSettled: () => {
          setIsLoading(false);
        },
      });
    } catch (error) {
      setIsLoading(false);
      console.error('게시글 저장 중 오류 발생:', error);
      alert(ERROR_MESSAGES.POST_SAVE_FAILED);
    }
  }, [doc, imageArr, userInfo?.id, mutationCreateNewPost]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}
      <div className="tablet:pt-4">
        <div className="flex relative px-2 border-b tablet:pt-2 border-gray-400">
          <input
            className="w-full h-10  font-bold  placeholder:text-gray-500 placeholder:text-xs tablet:text-2xl placeholder-zinc-600 tablet:placeholder:text-2xl"
            name="title"
            value={doc.title}
            placeholder="오늘의 특별한 주제는 무엇인가요? 🌟"
            onKeyDown={changeFocusContent}
            onChange={onChangeTextarea}
          />
          <div className="flex items-center justify-end gap-2 absolute right-0 top-0">
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
                accessToken
                  ? saveNewPost()
                  : alert(ERROR_MESSAGES.LOGIN_REQUIRED)
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
        </div>
        <div className="min-h-[83px]">
          <div className="relative flex px-2 pt-4 border-b border-gray-400">
            <Tooltip
              content="태그를 입력하면 검색, 필터, 하이라이트 기능을 사용할 수 있어요. Enter 키로 추가해 주세요."
              position="bottom"
            >
              <input
                className="z-10 w-full text-sm  placeholder:text-gray-500 h-7 tablet:text-xl placeholder:text-xs placeholder-zinc-600 tablet:placeholder:text-lg placeholder:italic"
                name="tag"
                value={tag}
                placeholder="태그를 만들어주세요."
                onKeyDown={createTags}
                onChange={e => setTag(e.target.value)}
              />
            </Tooltip>
          </div>
          <div className="flex justify-between mt-2">
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
                  <button onClick={() => handleRemoveTag(tag)}>
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

export default NewBtn;
