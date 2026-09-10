import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useGetUserInfo } from 'service/hooks/Login';
import { getMyResumes } from 'service/api/resume';
import { useLocalDrafts } from 'hooks/useLocalDrafts';
import GithubSync from 'components/pages/mypage/GithubSync';
import RecentActivity from 'components/pages/mypage/RecentActivity';
export default function Workspace() {
  const { data: user } = useGetUserInfo();
  const { drafts, error } = useLocalDrafts();
  const resumes = useQuery({ queryKey: ['workspaceResumes'], queryFn: getMyResumes, enabled: !!user?.id });
  return <main className="mx-auto max-w-6xl space-y-7 px-5 py-9">
    <Head><title>내 작업실 · LOGME</title><meta name="robots" content="noindex" /></Head>
    <header className="rounded-2xl bg-slate-900 p-6 text-white tablet:p-8"><p className="text-sm text-blue-200">내 작업실</p><h1 className="mt-2 text-2xl font-bold">{user?.name || user?.username || '개발자'}님의 기록을 이어가세요</h1><p className="mt-3 text-slate-200">글, 이력서, GitHub 백업을 한곳에서 관리합니다.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/article/new" className="rounded-lg bg-white px-4 py-3 font-bold text-blue-800">새 글 작성</Link><Link href="/resume" className="rounded-lg border border-slate-500 px-4 py-3">이력서 작성</Link>{user?.username && <Link href={`/u/${user.username}`} className="rounded-lg border border-slate-500 px-4 py-3">내 공개 프로필</Link>}</div></header>
    <div className="grid gap-6 tablet:grid-cols-2"><section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-bold">이어서 작성</h2><p className="mt-2 text-sm text-slate-600">이 브라우저에 보관된 임시글입니다. 다른 기기와 자동 동기화되지 않습니다.</p><div className="mt-4 divide-y divide-slate-200">{drafts.map(draft => <Link key={draft.key} href={draft.href} className="block py-4"><h3 className="font-semibold text-blue-800">{draft.title}</h3><p className="mt-1 text-xs text-slate-600">{draft.updatedAt ? new Date(draft.updatedAt).toLocaleString('ko-KR') : '이 기기에 저장됨'} · 이어서 작성 →</p></Link>)}{!drafts.length && <p className="py-5 text-slate-600">{error ? '브라우저 저장소에 접근할 수 없습니다.' : '작성 중인 임시글이 없습니다. 새 기록을 시작해보세요.'}</p>}</div></section>
    <section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-bold">계정에 저장한 이력서</h2><p className="mt-2 text-sm text-slate-600">저장한 이력서를 불러와 수정하거나 공개 사본을 공유하세요.</p>{resumes.isError ? <button className="mt-4 text-blue-700" onClick={() => resumes.refetch()}>이력서 목록 다시 불러오기</button> : <ul className="my-4 space-y-3">{resumes.data?.slice(0, 3).map(r => <li key={r.id} className="text-sm"><strong>{r.title}</strong><span className="ml-2 text-slate-600">{r.updated_at.slice(0,10)}</span></li>)}</ul>}<Link className="inline-block rounded-lg border border-slate-300 px-4 py-2 font-semibold text-blue-800" href="/resume">내 이력서 열기{resumes.data ? ` · ${resumes.data.length}개` : ''}</Link></section></div>
    <section className="rounded-2xl border border-slate-200 bg-white p-6"><GithubSync /></section>
    <section className="rounded-2xl border border-slate-200 bg-white p-6"><div className="mb-3 flex justify-between"><h2 className="text-lg font-bold">최근 기록</h2><Link href="/article?view=my" className="text-sm text-blue-700">내 글 전체 보기 →</Link></div><RecentActivity /></section>
    <Link href="/mypage" className="inline-block text-sm text-slate-700 underline">프로필과 계정 설정</Link>
  </main>;
}
