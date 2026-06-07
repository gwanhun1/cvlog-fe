import { useRouter } from 'next/router';
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from 'components/Shared';
import { EDITOR_CONSTANTS, ERROR_MESSAGES, KeyMap } from 'lib/constants';
import LocalStorage from 'public/utils/Localstorage';
import { useCreatePost } from 'service/hooks/New';
import { useModifyPost } from 'service/hooks/Detail';
import { useStore } from 'service/store/useStore';
import LoaderAnimation from 'components/Shared/common/LoaderAnimation';
import { DocType } from './EditorPreview';

interface EditorHeaderProps {
  doc: DocType;
  setDoc: React.Dispatch<React.SetStateAction<DocType>>;
  imageArr: string[];
  mode: 'create' | 'edit';
  pid?: string;
  isVisiblePreview: boolean;
  onTogglePreview: () => void;
  onSaveSuccess?: () => void;
}

const EditorHeader = ({
  doc,
  setDoc,
  imageArr,
  mode,
  pid,
  isVisiblePreview,
  onTogglePreview,
  onSaveSuccess,
}: EditorHeaderProps) => {
  const [tag, setTag] = useState('');
  const [isTagInputOpen, setIsTagInputOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isTagInputOpen) tagInputRef.current?.focus();
  }, [isTagInputOpen]);
  const router = useRouter();
  const userInfo = useStore(state => state.userIdAtom);
  const { showToast } = useToast();
  const accessToken = LocalStorage.getItem('LogmeToken') as string;

  const mutationCreatePost = useCreatePost();
  const mutationModifyPost = useModifyPost(pid ? parseInt(pid) : 0);

  const onChangeTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDoc(prev => ({ ...prev, title: e.target.value }));
    },
    [setDoc],
  );

  const changeFocusContent = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== KeyMap.ENTER) return;
    e.preventDefault();
  };

  const createTags = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!tag || e.key !== KeyMap.ENTER || e.nativeEvent.isComposing) return;
      if (tag.length >= EDITOR_CONSTANTS.TAG_MAX_LENGTH) {
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
    [doc.tags, tag, setDoc, showToast],
  );

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      setDoc(prev => ({
        ...prev,
        tags: prev.tags.filter(t => t !== tagToRemove),
      }));
    },
    [setDoc],
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
    const mutation =
      mode === 'create' ? mutationCreatePost : mutationModifyPost;
    mutation.mutate(formData, {
      onSettled: () => setIsLoading(false),
      onSuccess: () => onSaveSuccess?.(),
    });
  }, [
    doc,
    imageArr,
    userInfo?.id,
    accessToken,
    mode,
    mutationCreatePost,
    mutationModifyPost,
    showToast,
    onSaveSuccess,
  ]);

  return (
    <>
      {isLoading && <LoaderAnimation />}
      <div className="w-full">
        {/* ① 제목 행 = 배지 + 제목(flex-1) + 버튼들 */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-100">
          {/* 모드 배지 */}
          {mode === 'create' ? (
            <div className="hidden tablet:inline-flex flex-shrink-0 items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md border border-ftBlue/20 bg-ftBlue/5 text-ftBlue tracking-wide">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              새 글
            </div>
          ) : (
            <span className="hidden tablet:inline-flex flex-shrink-0 items-center gap-1 text-[11px] text-gray-400 select-none">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              수정 중
            </span>
          )}

          {/* 제목 입력 */}
          <input
            className="flex-1 min-w-0 font-bold text-ftBlack placeholder:text-gray-300 text-lg tablet:text-2xl focus:outline-none bg-transparent"
            name="title"
            value={doc.title}
            placeholder="제목을 입력하세요"
            onKeyDown={changeFocusContent}
            onChange={onChangeTitle}
          />

          {/* 액션 버튼 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={onTogglePreview}
              className={`hidden tablet:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                isVisiblePreview
                  ? 'text-ftBlue border-ftBlue/30 bg-ftBlue/5 hover:bg-ftBlue/10'
                  : 'text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {isVisiblePreview ? (
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
              {isVisiblePreview ? '미리보기 끄기' : '미리보기'}
            </button>

            <button
              type="button"
              onClick={() => router.push(accessToken ? '/article' : '/')}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>

            <button
              type="button"
              onClick={() =>
                accessToken
                  ? handleSavePost()
                  : showToast(ERROR_MESSAGES.LOGIN_REQUIRED, 'warning')
              }
              disabled={isLoading}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-ftBlue rounded-lg hover:bg-[#1f4a8c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {mode === 'create' ? '출간' : '저장'}
            </button>
          </div>
        </div>

        {/* ② 태그 영역 — pills + 아이콘 버튼 (클릭 시 인풋 열림) */}
        <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 ">
          {doc.tags.map(t => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium text-ftBlue bg-ftBlue/5 rounded-full border border-ftBlue/20 flex-shrink-0"
            >
              {t}
              <button
                type="button"
                onClick={() => handleRemoveTag(t)}
                className="text-ftBlue/50 hover:text-red-500 transition-colors leading-none"
                aria-label={`${t} 태그 삭제`}
              >
                ×
              </button>
            </span>
          ))}

          {doc.tags.length === 0 && !isTagInputOpen && (
            <span className="text-xs text-gray-300 select-none">태그를 추가해보세요</span>
          )}

          {isTagInputOpen ? (
            <input
              ref={tagInputRef}
              className="px-2 py-0.5 text-xs text-ftBlack placeholder:text-gray-400 focus:outline-none bg-transparent border-b border-ftBlue/40 min-w-[120px]"
              name="tag"
              value={tag}
              placeholder="태그 입력 후 Enter"
              onKeyDown={e => {
                if (e.key === 'Escape') {
                  setIsTagInputOpen(false);
                  setTag('');
                  return;
                }
                if (e.key === 'Enter' && tag && !e.nativeEvent.isComposing) {
                  createTags(e);
                  setIsTagInputOpen(false);
                  return;
                }
                createTags(e);
              }}
              onBlur={() => {
                setIsTagInputOpen(false);
                setTag('');
              }}
              onChange={e => setTag(e.target.value)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsTagInputOpen(true)}
              className="flex items-center justify-center w-5 h-5 rounded-full border border-dashed border-gray-300 text-gray-400 hover:border-ftBlue hover:text-ftBlue transition-colors flex-shrink-0"
              aria-label="태그 추가"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default EditorHeader;
