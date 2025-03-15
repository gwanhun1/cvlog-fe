import React, { useState, useEffect, useRef } from 'react';
import { NextPage } from 'next';
import 'easymde/dist/easymde.min.css';

import NewBtn from '../../../components/pages/article/new/NewBtn';
import NewContents from '../../../components/pages/article/new/NewContents';
import { EDITOR_CONSTANTS } from 'lib/constants';

export interface DocType {
  title: string;
  content: string;
  tags: string[];
}

const INIT_USER_INPUT = {
  title: '',
  content: '# Hello world',
  tags: [],
};

const NewPost: NextPage = () => {
  const [doc, setDoc] = useState<DocType>(INIT_USER_INPUT);
  const [isVisiblePreview, setIsVisiblePreview] = useState(true);
  const [imageArr, setImageArr] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

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
      setIsMobile(window.innerWidth < EDITOR_CONSTANTS.MOBILE_BREAKPOINT);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main className="h-screen min-h-screen px-10">
      <div className="flex flex-col h-full">
        <header className="flex-none">
          <NewBtn doc={doc} setDoc={setDoc} imageArr={imageArr} />
        </header>
        <main className="flex flex-col flex-1 w-full tablet:flex-row">
          <NewContents
            doc={doc}
            setDoc={setDoc}
            setImageArr={setImageArr}
            isVisiblePreview={isVisiblePreview}
            containerTopRef={containerTopRef}
            isMobile={isMobile}
          />
        </main>
      </div>
    </main>
  );
};

export default NewPost;
