import dynamic from 'next/dynamic';
import { useCallback, useRef, useState } from 'react';
import { useImageUpload } from 'hooks/useImageUpload';
import EditorPreview, { DocType } from './EditorPreview';
import type { ICommand } from '@uiw/react-md-editor';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface EditorContentsProps {
  doc: DocType;
  setDoc: React.Dispatch<React.SetStateAction<DocType>>;
  setImageArr: React.Dispatch<React.SetStateAction<string[]>>;
  isVisiblePreview: boolean;
  containerTopRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
}

const EditorContents = ({
  doc,
  setDoc,
  setImageArr,
  isVisiblePreview,
  containerTopRef,
  isMobile,
}: EditorContentsProps) => {
  const { uploadImage } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleContentChange = useCallback(
    (value?: string) => {
      setDoc(prev => ({ ...prev, content: value ?? '' }));
    },
    [setDoc],
  );

  const processFileAndUpload = useCallback(
    async (file: File) => {
      if (!file || !file.type.startsWith('image/')) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setIsUploadingImage(true);

      try {
        const { url: imageUrl, name: imageName } = await uploadImage(file, controller.signal);
        const imageMarkdown = `\n![${imageName}](${imageUrl})\n`;
        setDoc(prev => ({ ...prev, content: (prev.content || '') + imageMarkdown }));
        setImageArr(prev => [...prev, imageUrl]);
      } catch (error) {
        if (error instanceof Error && error.message === 'IMAGE_UPLOAD_CANCELED') return;
        console.error('이미지 업로드 실패:', error);
      } finally {
        setIsUploadingImage(false);
        abortRef.current = null;
      }
    },
    [uploadImage, setDoc, setImageArr],
  );

  const handleFileSelectUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await processFileAndUpload(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [processFileAndUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const file = e.dataTransfer?.files?.[0];
      if (file?.type.startsWith('image/')) {
        e.preventDefault();
        processFileAndUpload(file);
      }
    },
    [processFileAndUpload],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) processFileAndUpload(file);
          break;
        }
      }
    },
    [processFileAndUpload],
  );

  const imageUploadCommand: ICommand = {
    name: 'image-upload',
    keyCommand: 'image-upload',
    buttonProps: { 'aria-label': '이미지 업로드', title: '이미지 업로드' },
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    ),
    execute: () => fileInputRef.current?.click(),
  };

  const editorHeight = isMobile ? 300 : `calc(100vh - 180px)`;

  return (
    <div className="flex w-full" onDrop={handleDrop} onPaste={handlePaste}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelectUpload}
      />

      <div
        className={`relative ${isVisiblePreview ? 'w-full tablet:w-1/2' : 'w-full'}`}
        data-color-mode="light"
      >
        {isUploadingImage && (
          <div className="flex absolute inset-0 z-20 justify-center items-center backdrop-blur-sm bg-white/70">
            <div className="flex flex-col gap-3 items-center px-5 py-4 rounded-2xl border border-gray-200 shadow-sm bg-white/90">
              <div className="w-8 h-8 rounded-full border-2 border-gray-300 animate-spin border-t-ftBlue" />
              <span className="text-sm font-medium text-gray-700">이미지 업로드 중...</span>
              <button
                type="button"
                onClick={() => { abortRef.current?.abort(); setIsUploadingImage(false); }}
                className="px-3 py-1.5 text-sm font-semibold rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
              >
                취소
              </button>
            </div>
          </div>
        )}

        <MDEditor
          value={doc.content || ''}
          onChange={handleContentChange}
          height={editorHeight as number}
          preview="edit"
          hideToolbar={false}
          commands={[
            ...([] as ICommand[]),
            { name: 'bold', keyCommand: 'bold' } as ICommand,
            { name: 'italic', keyCommand: 'italic' } as ICommand,
            { name: 'divider' } as ICommand,
            { name: 'title1', keyCommand: 'title1' } as ICommand,
            { name: 'title2', keyCommand: 'title2' } as ICommand,
            { name: 'title3', keyCommand: 'title3' } as ICommand,
            { name: 'divider' } as ICommand,
            { name: 'quote', keyCommand: 'quote' } as ICommand,
            { name: 'unorderedListCommand', keyCommand: 'unorderedListCommand' } as ICommand,
            { name: 'orderedListCommand', keyCommand: 'orderedListCommand' } as ICommand,
            { name: 'divider' } as ICommand,
            { name: 'link', keyCommand: 'link' } as ICommand,
            imageUploadCommand,
            { name: 'code', keyCommand: 'code' } as ICommand,
            { name: 'table', keyCommand: 'table' } as ICommand,
          ]}
          extraCommands={[]}
          style={{ borderRadius: '0.5rem', overflow: 'hidden' }}
        />
      </div>

      {!isMobile && (
        <EditorPreview
          isVisiblePreview={isVisiblePreview}
          containerTopRef={containerTopRef}
          doc={doc}
        />
      )}
    </div>
  );
};

export default EditorContents;
