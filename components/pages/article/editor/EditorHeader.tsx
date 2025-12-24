import { Badge } from 'flowbite-react';
import { useRouter } from 'next/router';
import { KeyboardEvent, useCallback, useState } from 'react';
import * as Shared from 'components/Shared';
import { useToast } from 'components/Shared';
import { EDITOR_CONSTANTS, ERROR_MESSAGES, KeyMap } from 'lib/constants';
import LocalStorage from 'public/utils/Localstorage';
import { useCreatePost } from 'service/hooks/New';
import { useModifyPost } from 'service/hooks/Detail';
import { useStore } from 'service/store/useStore';
import { IoIosCloseCircle } from 'react-icons/io';
import Tooltip from 'components/Shared/common/Tooltip';
import LoaderAnimation from 'components/Shared/common/LoaderAnimation';
import { DocType } from './EditorPreview';

interface EditorHeaderProps {
  doc: DocType;
  setDoc: React.Dispatch<React.SetStateAction<DocType>>;
  imageArr: string[];
  mode: 'create' | 'edit';
  pid?: string;
}

const EditorHeader = ({
  doc,
  setDoc,
  imageArr,
  mode,
  pid,
}: EditorHeaderProps) => {
  const [tag, setTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userInfo = useStore((state) => state.userIdAtom);
  const { showToast } = useToast();

  const accessToken = LocalStorage.getItem('LogmeToken') as string;

  // mode에 따라 다른 mutation 사용
  const mutationCreatePost = useCreatePost();
  const mutationModifyPost = useModifyPost(pid ? parseInt(pid) : 0);

  const onChangeTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setDoc(prev => ({ ...prev, title: value }));
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
        showToast(ERROR_MESSAGES.TAG_TOO_LONG, 'warning');
        setTag('');
        return;
      }

      if (doc.tags.includes(tag)) {
        showToast(ERROR_MESSAGES.DUPLICATE_TAG, 'warning');
        setTag('');
        return;
      }

      setDoc(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTag('');
    },
    [doc.tags, tag, setDoc, showToast]
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

  const handleSavePost = useCallback(() => {
    const userId = userInfo?.id;

    if (!doc.title.trim()) {
      showToast(ERROR_MESSAGES.TITLE_REQUIRED, 'warning');
      return;
    }

    if (!doc.content.trim()) {
      showToast(ERROR_MESSAGES.CONTENT_REQUIRED, 'warning');
      return;
    }

    if (!userId) {
      showToast(ERROR_MESSAGES.USER_INFO_REQUIRED, 'error');
      return;
    }

    if (mode === 'edit' && !accessToken) {
      showToast(ERROR_MESSAGES.LOGIN_REQUIRED, 'warning');
      return;
    }

    const formData = {
      title: doc.title.trim(),
      content: doc.content.trim(),
      user_id: userId,
      tags: doc.tags,
      files: imageArr,
      ...(mode === 'edit' && { category_id: 1 }),
    };

    setIsLoading(true);

    if (mode === 'create') {
      mutationCreatePost.mutate(formData, {
        onSettled: () => {
          setIsLoading(false);
        },
      });
    } else {
      mutationModifyPost.mutate(formData, {
        onSettled: () => {
          setIsLoading(false);
        },
      });
    }
  }, [
    doc,
    imageArr,
    userInfo?.id,
    accessToken,
    mode,
    mutationCreatePost,
    mutationModifyPost,
    showToast,
  ]);

  return (
    <>
      {isLoading && <LoaderAnimation />}
      <div className="tablet:pt-4 tablet:relative">
        <div className="flex absolute right-0 bottom-0 z-30 gap-2 justify-end items-center mb-2 tablet:top-0 tablet:bottom-auto tablet:mt-2 tablet:mb-0">
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
                ? handleSavePost()
                : showToast(ERROR_MESSAGES.LOGIN_REQUIRED, 'warning')
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

        <div className="flex relative px-2 border-b border-gray-400 tablet:pt-2">
          <input
            className="w-full h-10 font-bold tablet:mt-0 placeholder:text-gray-500 placeholder:text-xs tablet:text-2xl placeholder-zinc-600 tablet:placeholder:text-2xl"
            name="title"
            value={doc.title}
            placeholder="오늘의 특별한 주제는 무엇인가요? 🌟"
            onKeyDown={changeFocusContent}
            onChange={onChangeTitle}
          />
        </div>
        <div className="min-h-[83px]">
          <div className="flex relative px-2 pt-4 border-b border-gray-400">
            <Tooltip
              content="태그를 입력하면 검색, 필터, 하이라이트 기능을 사용할 수 있어요. Enter 키로 추가해 주세요."
              position="bottom"
            >
              <input
                className="z-10 w-full h-7 text-sm placeholder:text-gray-500 tablet:text-xl placeholder:text-xs placeholder-zinc-600 tablet:placeholder:text-lg placeholder:italic"
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
              className="overflow-x-scroll mb-1 h-10 whitespace-nowrap"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {doc.tags.map((tag, index) => (
                <Badge
                  className="inline-flex relative items-center px-3 mt-1 mr-1 text-blue-800 bg-blue-200 rounded-full border-2 border-blue-300 transition-all duration-300 hover:bg-blue-200 hover:border-blue-400"
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

export default EditorHeader;
