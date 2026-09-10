import Head from 'next/head';
import Link from 'next/link';
import { usePublicProfile } from 'hooks/usePublicProfile';
export default function PublicProfilePage({ username, page }: { username: string; page: number }) {
  const query = usePublicProfile(username, page);
  if (query.isPending) return <main className="mx-auto max-w-4xl p-8" role="status">프로필을 불러오는 중입니다.</main>;
  if (!query.data) return <main className="mx-auto max-w-4xl p-8"><h1 className="text-xl font-bold">프로필을 불러오지 못했습니다.</h1><button onClick={() => query.refetch()} className="mt-4 rounded-lg border p-3">다시 시도</button><Link href="/article?view=all" className="ml-4 text-blue-700">글 탐색</Link></main>;
  const { user, posts, resumes, total, pages } = query.data;
  return <main className="mx-auto max-w-4xl space-y-8 px-5 py-10">
    <Head><title>{user.name || username}의 개발 기록 · LOGME</title><meta name="description" content={user.description || `${username}의 공개 글과 포트폴리오`} /></Head>
    <header className="rounded-2xl bg-slate-900 p-7 text-white"><p className="text-sm text-blue-200">개발자 프로필 · @{username}</p><h1 className="mt-3 text-3xl font-bold">{user.name || username}</h1><p className="mt-3 whitespace-pre-line text-slate-200">{user.description || '글과 프로젝트로 개발 경험을 기록합니다.'}</p>{user.github_id && <Link href={`/github?user=${encodeURIComponent(user.github_id)}`} className="mt-5 inline-block rounded-lg bg-white px-4 py-2 font-semibold text-blue-800">GitHub 활동과 프로젝트 보기</Link>}</header>
    {resumes.length > 0 && <section><h2 className="mb-3 text-xl font-bold">공개 이력서</h2><div className="space-y-2">{resumes.map(r => <a key={r.token} href={`/r/${r.token}`} className="block rounded-xl border border-slate-300 bg-white p-4 font-semibold text-blue-800">{r.title} ↗</a>)}</div></section>}
    <section><h2 className="mb-4 text-xl font-bold">개발 기록 <span className="text-sm font-normal text-slate-600">{total}개 공개 글</span></h2><div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">{posts.map(post => <Link key={post.id} href={`/article/content/${post.id}`} className="block p-5 hover:bg-slate-50"><p className="mb-2 text-xs text-slate-600">{post.created_at.slice(0, 10)}{post.series ? ` · ${post.series}` : ''}</p><h3 className="font-semibold text-slate-900">{post.title}</h3></Link>)}{!posts.length && <p className="p-6 text-slate-600">아직 공개한 글이 없습니다.</p>}</div>
    <nav aria-label="작성자 글 페이지" className="mt-5 flex justify-between">{page > 1 ? <Link href={`/u/${username}?page=${page-1}`} className="text-blue-700">이전</Link> : <span />}{page < pages && <Link href={`/u/${username}?page=${page+1}`} className="text-blue-700">다음</Link>}</nav></section>
  </main>;
}
