import { useState, useEffect, useRef } from 'react';
import { NextPage } from 'next';
import 'easymde/dist/easymde.min.css';

import {
  EditorHeader,
  EditorContents,
  DocType,
} from '../../../components/pages/article/editor';
import { EDITOR_CONSTANTS } from 'lib/constants';

const INIT_USER_INPUT: DocType = {
  title: '',
  content: '# Hello world',
  tags: [],
};

const NewPost: NextPage = () => {
  const [doc, setDoc] = useState<DocType>(INIT_USER_INPUT);
  const [isVisiblePreview, setIsVisiblePreview] = useState(true);
  const [imageArr, setImageArr] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

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
    <main className="h-screen min-h-screen px-2 tablet:px-10">
      <div className="flex flex-col h-full">
        <header className="flex-none">
          <EditorHeader
            doc={doc}
            setDoc={setDoc}
            imageArr={imageArr}
            mode="create"
          />
        </header>
        <main className="flex flex-col flex-1 w-full tablet:flex-row">
          <EditorContents
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
