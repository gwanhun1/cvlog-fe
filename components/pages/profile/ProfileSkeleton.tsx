export default function ProfileSkeleton() {
  return (
    <div role="status" aria-label="프로필 불러오는 중">
      <span className="sr-only">프로필을 불러오는 중입니다.</span>
      <div
        aria-hidden="true"
        className="space-y-6 motion-safe:animate-pulse tablet:space-y-8"
      >
        <div className="rounded-2xl bg-slate-900 p-5 mobile:p-7">
          <div className="h-4 w-36 max-w-full rounded bg-slate-600" />
          <div className="mt-3 h-9 w-40 max-w-full rounded bg-slate-500" />
          <div className="mt-3 h-5 w-full rounded bg-slate-600" />
          <div className="mt-2 h-5 w-2/3 rounded bg-slate-600" />
          <div className="mt-5 h-11 w-52 max-w-full rounded-lg bg-slate-500" />
        </div>
        <div>
          <div className="mb-4 h-7 w-36 rounded bg-slate-200" />
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {[0, 1, 2].map(index => (
              <div key={index} className="p-5">
                <div className="mb-2 h-4 w-24 rounded bg-slate-200" />
                <div
                  className={`h-6 rounded bg-slate-200 ${index === 1 ? 'w-2/3' : 'w-5/6'}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
