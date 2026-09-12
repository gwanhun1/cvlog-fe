import Link from 'next/link';

const items = [
  { key: 'overview', label: '개요', href: '/workspace' },
  { key: 'posts', label: '내 글', href: '/article?view=my' },
  { key: 'liked', label: '좋아요한 글', href: '/article/liked' },
  { key: 'github', label: 'GitHub 백업', href: '/workspace/github' },
] as const;

export default function WorkspaceNav({
  active,
}: {
  active: 'overview' | 'github';
}) {
  return (
    <nav
      aria-label="작업실 메뉴"
      className="flex flex-wrap gap-x-5 border-b border-slate-200"
    >
      {items.map(item => (
        <Link
          key={item.key}
          href={item.href}
          aria-current={active === item.key ? 'page' : undefined}
          className={`inline-flex min-h-[44px] items-center border-b-2 py-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-ftBlue ${active === item.key ? 'border-ftBlue text-ftBlue' : 'border-transparent text-slate-600 hover:text-ftBlue'}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
