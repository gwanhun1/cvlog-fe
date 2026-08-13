const CardSkeleton = () => (
  <article
    aria-hidden
    className="overflow-hidden rounded-[14px] border border-slate-200 bg-white"
  >
    <div className="aspect-[16/9] animate-pulse bg-slate-100" />
    <div className="p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-10 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="h-5 w-5/6 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-5 w-3/5 animate-pulse rounded bg-slate-200" />
      <div className="mt-5 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
        <div className="h-5 w-14 animate-pulse rounded bg-slate-100" />
        <div className="h-5 w-16 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  </article>
);

const SkeletonLoader = () => (
  <div className="masonry-grid">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="masonry-item break-inside-avoid">
        <CardSkeleton />
      </div>
    ))}
  </div>
);

export default CardSkeleton;
export { SkeletonLoader };
