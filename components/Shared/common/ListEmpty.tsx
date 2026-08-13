interface ListEmptyProps {
  message?: string;
  subMessage?: string;
}

const ListEmpty = ({
  message = '아직 작성된 글이 없어요',
  subMessage = '첫 번째 기록을 작성해보세요.',
}: ListEmptyProps) => (
  <div className="flex min-h-[280px] w-full flex-col items-center justify-center border-y border-slate-200 bg-white px-6 text-center">
    <h3 className="m-0 text-xl font-bold tracking-[-0.025em] text-slate-800">
      {message}
    </h3>
    <p className="mb-0 mt-2 text-sm leading-relaxed text-slate-500">
      {subMessage}
    </p>
  </div>
);

export default ListEmpty;
