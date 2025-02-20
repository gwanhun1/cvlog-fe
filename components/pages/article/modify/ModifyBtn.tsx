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

interface ModifyBtnProps {
  doc: DocType;
  setDoc: React.Dispatch<React.SetStateAction<DocType>>;
  pid: string;
  imageArr: string[];
  isVisiblePreview: boolean;
  setIsVisiblePreview: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModifyBtn = ({
  doc,
  setDoc,
  pid,
  imageArr,
  isVisiblePreview,
  setIsVisiblePreview,
}: ModifyBtnProps) => {
  const router = useRouter();
  const accessToken = LocalStorage.getItem('CVtoken') as string;
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
      {isLoading && (
        <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}
      <div className="tablet:pt-2">
        <div className="flex items-center justify-end gap-2 px-4 py-2">
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
        <div className="relative px-2 border-b tablet:pt-2 border-gray">
          <input
            className="w-full h-10 text-gray-600 placeholder:text-gray-300 placeholder:text-xs tablet:text-2xl placeholder-zinc-600 tablet:placeholder:text-2xl"
            name="title"
            value={doc.title}
            placeholder="오늘은 어떤 주제로 모두를 놀라게 해주실 건가요? 🥰"
            onChange={handleTitleChange}
          />
        </div>
        <div className="min-h-[83px]">
          <div className="relative flex px-2 pt-4 border-b border-gray">
            <input
              className="z-10 w-full text-sm text-gray-600 placeholder:text-gray-300 h-7 tablet:text-xl placeholder:text-xs placeholder-zinc-600 tablet:placeholder:text-lg placeholder:italic"
              name="tag"
              value={tag}
              placeholder="태그를 만들어주세요."
              onKeyDown={handleCreateTag}
              onChange={handleTagChange}
            />
          </div>
          <div className="flex justify-between mt-2 ">
            <div
              className="h-10 overflow-x-scroll w-11/12 mb-1 whitespace-nowrap"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {doc.tags.map((tag, index) => (
                <Badge
                  className="relative inline-flex items-center px-3 mx-2 mt-1 rounded-full border-2 border-blue-300 bg-blue-200 text-blue-800 hover:bg-blue-200 hover:border-blue-400 transition-all duration-300"
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
                    <Shared.LogmeIcon.CloseIcon
                      alt="close"
                      width={50}
                      height={50}
                      cn="absolute w-3 h-3 right-[-5px] top-[-5px] hover:block hover:cursor-pointer text-blue-800 hover:text-blue-700 transition-all duration-200 transform hover:scale-110"
                    />
                  </button>
                </Badge>
              ))}
            </div>
            <label className=" text-gray-400 top-[-35px] right-4  flex justify-end w-10 h-8">
              <Shared.LogmeIcon.EyeIcon
                cn={`w-4 m-2 hover:cursor-pointer ${
                  !isVisiblePreview ? 'bg-gray-300 rounded-full' : ''
                }`}
                alt="no-preview"
                width={30}
                height={30}
                onClick={() => setIsVisiblePreview(!isVisiblePreview)}
              />
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModifyBtn;
