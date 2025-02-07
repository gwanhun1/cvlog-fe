import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { Badge } from 'flowbite-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { CopyBlock, dracula } from 'react-code-blocks';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import * as Shared from 'components/Shared';
import { KeyMap } from 'lib/constants';
import LocalStorage from 'public/utils/Localstorage';
import { ErrorResponse, handleMutateErrors } from 'service/api/login';
import { useGetDetail, useModifyPost } from 'service/hooks/Detail';
import 'easymde/dist/easymde.min.css';
import { useGetUserInfo } from 'service/hooks/Login';
import { cn } from 'styles/utils';
import css from './new.module.scss';
import { languageArr } from 'pages/article/content/language';
import {
  MDE_OPTION,
  MDE_OPTIONMOBILE,
} from 'pages/article/content/markdownOpts';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});

type DocType = {
  title: string;
  content: string;
  tags: string[];
};

const ModifyPost = ({ pid }: ModifyPostType) => {
  const router = useRouter();
  const accessToken = LocalStorage.getItem('CVtoken') as string;
  const [doc, setDoc] = useState<DocType>({
    title: '',
    content: '',
    tags: [],
  });

  const getDetailData = useGetDetail(parseInt(pid));

  useEffect(() => {
    if (getDetailData.isSuccess) {
      const { post } = getDetailData.data;

      if (post) {
        const { title, content, tags } = post;
        const tagNames = tags?.map(e => e.name) || [];

        setDoc({
          title: title || '',
          content: content || '',
          tags: tagNames,
        });
      }
    }
  }, [getDetailData.isSuccess, getDetailData.data]);

  const [tag, setTag] = useState('');
  const [isVisiblePreview, setIsVisiblePreview] = useState(true);
  const [imageArr, setImageArr] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const getUserInfo = useGetUserInfo();

  const onChangeTextarea = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setDoc({ ...doc, [name as keyof DocType]: value });
    },
    [doc]
  );

  const handleOnChange = useCallback(
    (value: string) => {
      if (value.startsWith('![') && value.endsWith(')')) {
        const pastValue = doc.content;
        const newValue = pastValue + '\n\n' + value;
        setDoc({ ...doc, content: newValue });
      } else {
        setDoc({ ...doc, content: value });
      }
    },
    [doc]
  );

  const checkLanguage = (arr: string[], val: string) => {
    return arr.some((arrVal: string) => val === arrVal) ? val : '';
  };

  //TODO: implement auto focus
  const changeFocusContent = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== KeyMap.ENTER) return;
    e.preventDefault();
  };

  const handleCreateTags = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (tag && e.key === KeyMap.ENTER) {
      if (tag.length >= 22) {
        alert('너무 깁니다.');
        setTag('');
      } else {
        if (e.nativeEvent.isComposing === false) {
          if (doc.tags.some((item: string) => tag === item)) {
            alert('중복된 태그이름 입니다.');
            setTag('');
          } else {
            setDoc({ ...doc, tags: [...doc.tags, tag] });
            setTag('');
          }
        }
      }
    }
  };

  const handleRemoveTag = (tag: string) => {
    setDoc(prevDoc => ({
      ...prevDoc,
      tags: prevDoc.tags.filter(item => item !== tag),
    }));
  };

  console.log(doc);

  //FIXME  추후 기능 추가
  // const changePreviewMode = (id: string) => {
  //   if (id !== 'no-preview') {
  //     setIsVisiblePreview(true);
  //     setPreviewAlign(!previewAlign);
  //   } else if (id === 'no-preview') {
  //     setIsVisiblePreview(false);
  //   }
  // };

  const handleImageUpload = async (e: React.DragEvent<HTMLDivElement>) => {
    const file = e.dataTransfer.files[0];
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
    };
    const resizedImage = await imageCompression(file, options);
    const formData = new FormData();
    formData.append('file', resizedImage, resizedImage.name);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Bearer ${LocalStorage.getItem('CVtoken')}`,
      },
    };
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/upload`,
        formData,
        config
      );
      const imageUrl = data.data.url;
      const imageName = data.data.name;
      handleOnChange(`![${imageName}](${imageUrl})`);
      setImageArr([...imageArr, imageUrl]);
    } catch (errorRe) {
      const error = errorRe as ErrorResponse;
      if (error.response && error.response.status === 401) {
        handleMutateErrors(error);
      }
    }
  };

  //post
  const mutationCreatModifyPost = useModifyPost(parseInt(pid));
  const handleSaveModifyPost = () => {
    const userId = getUserInfo.data?.id;
    const { title, content, tags } = doc;
    if (userId !== undefined) {
      const createForm = {
        title: title,
        content: content,
        user_id: userId,
        category_id: 1,
        tags: tags,
        files: imageArr,
      };

      mutationCreatModifyPost.mutate(createForm);
    }
  };

  //스크롤 이동
  const containerTopRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      containerTopRef.current &&
      containerTopRef.current.scrollHeight >
        containerTopRef.current.clientHeight
    ) {
      containerTopRef.current.scrollTop =
        containerTopRef.current.scrollHeight -
        containerTopRef.current.clientHeight;
    }
  }, [doc]);

  //반응형 레이아웃
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main className="h-screen min-h-screen">
      <div className="flex flex-col h-full">
        <header className="flex-none">
          <div className="bg-[#f8f9fa]">
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
                    accessToken
                      ? handleSaveModifyPost()
                      : alert('로그인 먼저 해주세요..')
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
                  className="w-full h-10 text-gray-600 placeholder:text-gray-500 placeholder:text-xs tablet:text-2xl placeholder-zinc-600 tablet:placeholder:text-2xl"
                  name="title"
                  value={doc.title}
                  placeholder="오늘은 어떤 주제로 모두를 놀라게 해주실 건가요? 🥰"
                  onKeyDown={changeFocusContent}
                  onChange={onChangeTextarea}
                />
              </div>
              <div className="min-h-[83px]">
                <div className="relative flex px-2 pt-4 border-b border-gray">
                  <input
                    className="z-10 w-full text-sm text-gray-600 placeholder:text-gray-400 h-7 tablet:text-xl placeholder:text-xs placeholder-zinc-600 tablet:placeholder:text-lg placeholder:italic"
                    name="tag"
                    value={tag}
                    placeholder="태그를 만들어주세요."
                    onKeyDown={e => handleCreateTags(e)}
                    onChange={e => setTag(e.target.value)}
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
                    {/* FIXME 추후 기능 추가
                <Image
                  src="/images/mirror.png"
                  className={`w-4 m-2 ${
                    isVisiblePreview && (previewAlign ? 'bg-gray-300' : '')
                  }`}
                  alt="left-right"
                  id="left-right"
                  width="30"
                  height="30"
                  onClick={() => changePreviewMode('left-right')}
                />
                <Image
                  src="/images/mirror.png"
                  className={`w-4 m-2 rotate-90 ${
                    isVisiblePreview && (previewAlign ? '' : 'bg-gray-300')
                  }`}
                  alt="top-bottom"
                  id="top-bottom"
                  width="30"
                  height="30"
                  onClick={() => changePreviewMode('top-bottom')}
                /> */}
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
            <main className="relative flex flex-col justify-center flex-1 w-full tablet:flex-row ">
              <div
                className={cn(
                  css.mde,
                  `${isVisiblePreview ? 'tablet:w-1/2' : 'tablet:w-full'}`,
                  'w-full'
                )}
              >
                <SimpleMDE
                  style={{ color: '#fff' }}
                  options={isMobile ? MDE_OPTIONMOBILE : MDE_OPTION}
                  value={doc.content}
                  onChange={handleOnChange}
                  onDrop={e => {
                    e.preventDefault();
                    handleImageUpload(e);
                  }}
                />
              </div>
              {isVisiblePreview && (
                <div className="flex justify-center tablet:min-w-[50vw] tablet:w-[50vw]">
                  <div
                    ref={containerTopRef}
                    className=" w-[70vw] tablet:w-full desktop:pl-8 tablet:pl-5 max-h-[30vh] tablet:max-h-[35vh] desktop:max-h-[75vh] overflow-y-auto"
                  >
                    <ReactMarkdown
                      className="contentMarkdown"
                      rehypePlugins={[rehypeRaw]}
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <CopyBlock
                              language={checkLanguage(languageArr, match[1])}
                              text={String(children).replace(/\n$/, '')}
                              theme={dracula}
                              showLineNumbers={true}
                              wrapLines={true}
                              codeBlock
                            />
                          ) : (
                            <code
                              className={className}
                              style={{
                                color: '#eb5757',
                                padding: '2px 4px',
                              }}
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {doc?.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </main>
          </div>
        </header>
      </div>
    </main>
  );
};

export default ModifyPost;

export const getServerSideProps: GetServerSideProps = async context => {
  const pid = context.params?.pid;
  return { props: { pid } };
};

type ModifyPostType = { pid: string };
