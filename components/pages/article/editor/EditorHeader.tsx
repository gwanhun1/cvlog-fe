import { useRouter } from 'next/router';
import { KeyboardEvent as ReactKeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from 'components/Shared';
import { EDITOR_CONSTANTS, ERROR_MESSAGES, KeyMap } from 'lib/constants';
import LocalStorage from 'public/utils/Localstorage';
import { useCreatePost } from 'service/hooks/New';
import { useModifyPost } from 'service/hooks/Detail';
import { useStore } from 'service/store/useStore';
import LoaderAnimation from 'components/Shared/common/LoaderAnimation';
import { useTagAutocomplete } from 'hooks/useTagAutocomplete';
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
  onCancel?: () => void;
  draftTitle?: string;
  onRestoreDraft?: () => void;
  onDiscardDraft?: () => void;
  saveStatus?: string;
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
  onCancel,
  draftTitle,
  onRestoreDraft,
  onDiscardDraft,
  saveStatus,
}: EditorHeaderProps) => {
  const [showPublish, setShowPublish] = useState(false);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [tag, setTag] = useState('');
  const [isTagInputOpen, setIsTagInputOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDraftMenuOpen, setIsDraftMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const publishRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!showPublish) return;
    const previous = document.activeElement as HTMLElement | null;
    publishRef.current?.querySelector<HTMLInputElement>('input:checked')?.focus();
    return () => previous?.focus();
  }, [showPublish]);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isTagInputOpen) tagInputRef.current?.focus();
  }, [isTagInputOpen]);

  useEffect(() => {
    if (!isSettingsOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!settingsRef.current?.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsSettingsOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isSettingsOpen]);
  const router = useRouter();
  const userInfo = useStore(state => state.userIdAtom);
  const { showToast } = useToast();
  const accessToken = LocalStorage.getItem('LogmeToken') as string;

  const { data: tagSuggestions = [] } = useTagAutocomplete(tag, {
    enabled: isTagInputOpen,
  });
  const visibleSuggestions = tagSuggestions.filter(
    s => !doc.tags.includes(s.name),
  );

  const mutationCreatePost = useCreatePost();
  const mutationModifyPost = useModifyPost(pid ? parseInt(pid) : 0);

  const onChangeTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDoc(prev => ({ ...prev, title: e.target.value }));
    },
    [setDoc],
  );

  const changeFocusContent = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key !== KeyMap.ENTER) return;
    e.preventDefault();
  };

  const createTags = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (!tag || e.key !== KeyMap.ENTER || e.nativeEvent.isComposing) return;
      if (tag.length > EDITOR_CONSTANTS.TAG_MAX_LENGTH) {
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

    const series = doc.series?.trim() || null;
    const formData = {
      title: doc.title.trim(),
      content: doc.content.trim(),
      user_id: userId,
      public_status: visibility === 'public',
      tags: doc.tags,
      files: imageArr,
      series,
      series_order: series ? doc.series_order ?? null : null,
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
    visibility,
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
      {showPublish && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4" onKeyDown={e => { if (e.key === 'Escape' && !isLoading) setShowPublish(false); }}>
          <section ref={publishRef} onKeyDown={event => {
            if (event.key !== 'Tab') return;
            const elements = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:checked, summary'));
            const first = elements[0], last = elements[elements.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
          }} role="dialog" aria-modal="true" aria-labelledby="publish-title" className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <h2 id="publish-title" className="text-lg font-bold text-slate-900">글 발행</h2>
              <button type="button" aria-label="발행 창 닫기" disabled={isLoading} onClick={() => setShowPublish(false)} className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100">×</button>
            </div>
            <p className="mt-3 break-words text-sm leading-6 text-slate-600">{doc.title || '제목을 입력해주세요'}</p>
            <fieldset className="mt-5">
              <legend className="mb-2 text-xs font-semibold text-slate-600">공개 범위</legend>
              <div className="grid grid-cols-2 gap-2">
                {(['public', 'private'] as const).map(option => (
                  <label key={option} className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 ${visibility === option ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input type="radio" name="publish-visibility" value={option} checked={visibility === option} disabled={isLoading} onChange={() => setVisibility(option)} className="mt-1 accent-blue-700" />
                    <span><span className="block text-sm font-semibold text-slate-900">{option === 'public' ? '공개' : '비공개'}</span><span className="mt-1 block text-xs text-slate-500">{option === 'public' ? '누구나 읽기' : '나만 읽기'}</span></span>
                  </label>
                ))}
              </div>
            </fieldset>
            <details className="mt-3 text-xs text-slate-500">
              <summary className="cursor-pointer py-1">GitHub 백업 안내</summary>
              <p className="mt-1 leading-5">{visibility === 'public' ? '동기화가 연결돼 있으면 공개 글을 백업합니다. 결과는 작업실에서 확인할 수 있습니다.' : '비공개 글은 GitHub에 업로드하지 않습니다.'}</p>
            </details>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" disabled={isLoading} onClick={() => setShowPublish(false)} className="rounded-lg border border-slate-300 px-4 py-2">계속 작성</button>
              <button type="button" disabled={isLoading} onClick={handleSavePost} className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white disabled:opacity-50">{isLoading ? '저장 중…' : visibility === 'public' ? '공개 발행' : '비공개 저장'}</button>
            </div>
          </section>
        </div>
      )}
      {isLoading && <LoaderAnimation />}
      <div className="w-full">
        {/* ① 제목 행 = 제목(flex-1) + 버튼들 */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-100">
          {/* 제목 입력 */}
          <input
            aria-label="글 제목"
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

            {draftTitle && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDraftMenuOpen(open => !open)}
                  className="px-3 py-1.5 text-xs font-semibold text-ftBlue rounded-lg border border-ftBlue/25 bg-ftBlue/5 hover:bg-ftBlue/10 transition-colors"
                  aria-expanded={isDraftMenuOpen}
                >
                  임시저장
                </button>
                {isDraftMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                    <p className="text-xs font-semibold text-ftBlack">임시 저장된 글</p>
                    <p className="mt-1 truncate text-xs text-gray-400">{draftTitle}</p>
                    <p className="mt-2 text-[11px] leading-relaxed text-gray-400">
                      불러오면 현재 편집 내용이 임시 저장된 내용으로 바뀝니다.
                    </p>
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onDiscardDraft?.();
                          setIsDraftMenuOpen(false);
                        }}
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-gray-500 hover:bg-slate-50"
                      >
                        삭제
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onRestoreDraft?.();
                          setIsDraftMenuOpen(false);
                        }}
                        className="rounded-lg bg-ftBlue px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-ftBlue/90"
                      >
                        불러오기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                onCancel?.();
                router.push(accessToken ? '/article' : '/');
              }}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              나가기
            </button>

            <button
              type="button"
              onClick={() =>
                accessToken
                  ? mode === 'create' ? setShowPublish(true) : handleSavePost()
                  : showToast(ERROR_MESSAGES.LOGIN_REQUIRED, 'warning')
              }
              disabled={isLoading}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-ftBlue rounded-lg hover:bg-[#1f4a8c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {mode === 'create' ? '발행' : '저장'}
            </button>
          </div>
        </div>

        {/* ② 태그 영역 — pills + 아이콘 버튼 (클릭 시 인풋 열림) */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
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
            <span className="text-xs text-slate-500 select-none">태그</span>
          )}

          {isTagInputOpen ? (
            <div className="relative">
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
              {tag.trim().length > 0 && visibleSuggestions.length > 0 && (
                <ul className="absolute top-full left-0 mt-1 min-w-[160px] bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-auto">
                  {visibleSuggestions.map(suggestion => (
                    <li key={suggestion.id}>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-1.5 text-xs text-ftBlack hover:bg-ftBlue/5 transition-colors"
                        onMouseDown={e => {
                          // blur로 인풋이 닫히기 전에 선택 처리
                          e.preventDefault();
                          setDoc(prev => ({
                            ...prev,
                            tags: [...prev.tags, suggestion.name],
                          }));
                          setTag('');
                          tagInputRef.current?.focus();
                        }}
                      >
                        {suggestion.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
          {saveStatus && (
            <span
              role="status"
              className={`hidden shrink-0 items-center gap-1.5 text-xs tablet:inline-flex ${
                saveStatus.includes('실패') ? 'text-red-600' : 'text-slate-500'
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${
                  saveStatus.includes('실패') ? 'bg-red-500' : 'bg-emerald-500'
                }`}
              />
              {saveStatus.includes('실패') ? '자동 저장 오류' : '자동 저장 켜짐'}
            </span>
          )}
          <div ref={settingsRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(open => !open)}
              aria-expanded={isSettingsOpen}
              aria-controls="editor-extra-settings"
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                isSettingsOpen || doc.series?.trim()
                  ? 'bg-ftBlue/10 text-ftBlue'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.75a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5zM12 3v1.5m0 15V21m9-9h-1.5M4.5 12H3m15.364-6.364l-1.06 1.06M6.696 17.304l-1.06 1.06m12.728 0l-1.06-1.06M6.696 6.696l-1.06-1.06" />
              </svg>
              추가 설정
              {doc.series?.trim() && <span className="h-1.5 w-1.5 rounded-full bg-ftBlue" aria-label="설정됨" />}
            </button>
            {isSettingsOpen && (
              <div
                id="editor-extra-settings"
                role="group"
                aria-label="추가 설정"
                className="absolute right-0 top-full z-30 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-4 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">시리즈 설정</p>
                  <button type="button" onClick={() => setIsSettingsOpen(false)} aria-label="추가 설정 닫기" className="rounded-md px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">×</button>
                </div>
                <label htmlFor="editor-series" className="mt-3 block text-xs font-medium text-slate-600">시리즈 이름</label>
                <input
                  id="editor-series"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-ftBlack outline-none placeholder:text-slate-400 focus:border-ftBlue focus:ring-2 focus:ring-ftBlue/15"
                  name="series"
                  value={doc.series || ''}
                  placeholder="예: React 시작하기"
                  onChange={e => setDoc(prev => ({ ...prev, series: e.target.value }))}
                />
                {doc.series?.trim() && (
                  <>
                    <label htmlFor="editor-series-order" className="mt-3 block text-xs font-medium text-slate-600">글 순서</label>
                    <input
                      id="editor-series-order"
                      type="number"
                      min={1}
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-ftBlack outline-none focus:border-ftBlue focus:ring-2 focus:ring-ftBlue/15"
                      name="series_order"
                      value={doc.series_order ?? ''}
                      placeholder="1"
                      onChange={e => setDoc(prev => ({ ...prev, series_order: e.target.value === '' ? null : Number(e.target.value) }))}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditorHeader;
