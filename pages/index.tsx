import Head from 'next/head';
import Link from 'next/link';
import useIsLogin from 'hooks/useIsLogin';
const steps = [
  { number: '01', title: '경험을 기록하세요', text: '마크다운으로 글을 쓰고, 태그와 시리즈로 배운 내용을 정리합니다.', href: '/article/new', action: '글 작성하기' },
  { number: '02', title: '기록을 안전하게 보관하세요', text: 'GitHub에 공개 글을 백업하고, 누락 여부와 개발 활동을 확인합니다.', href: '/github', action: 'GitHub 살펴보기' },
  { number: '03', title: '나를 보여주는 포트폴리오로', text: '프로젝트와 경력을 이력서로 만들고, 공개할 정보만 골라 링크로 공유합니다.', href: '/resume', action: '이력서 만들기' },
];
export default function Home() {
  const { isAuthenticated } = useIsLogin();
  return <main className="mx-auto max-w-6xl px-5 py-10 tablet:py-16">
    <Head><title>LOGME · 개발 기록을 포트폴리오로</title><meta name="description" content="개발 경험을 기록하고 GitHub에 백업하세요. 글, 프로젝트, 이력서를 하나의 공개 프로필로 연결하는 LOGME." /><meta property="og:title" content="LOGME · 개발 기록을 포트폴리오로" /><meta property="og:description" content="글부터 GitHub 백업, 이력서 공유까지. 개발자의 기록이 이어지는 곳." /><meta property="og:url" content="https://logme.cloud" /><meta property="og:image" content="https://logme.cloud/assets/logo.png" /><link rel="canonical" href="https://logme.cloud" /></Head>
    <section className="grid gap-8 rounded-3xl bg-slate-900 p-7 text-white tablet:grid-cols-[1.3fr_1fr] tablet:p-12">
      <div><p className="text-sm font-semibold tracking-wider text-blue-200">LOGME · 개발자의 기록 공간</p><h1 className="mt-5 text-4xl font-extrabold leading-tight tablet:text-5xl">오늘의 개발 기록이<br />내일의 포트폴리오로.</h1><p className="mt-6 max-w-lg text-base leading-7 text-slate-200">글을 쓰고, GitHub에 보관하고, 이력서로 경험을 전하세요. 흩어진 개발 기록을 한곳에서 이어갑니다.</p><div className="mt-8 flex flex-wrap gap-3"><Link href={isAuthenticated ? '/workspace' : '/login?redirect=/workspace'} className="rounded-xl bg-white px-5 py-3 font-bold text-blue-900">{isAuthenticated ? '내 작업 이어가기' : '내 기록 시작하기'}</Link><Link href="/article?view=all" className="rounded-xl border border-slate-500 px-5 py-3 font-semibold">공개 글 둘러보기</Link></div></div>
      <aside className="self-center rounded-2xl border border-slate-600 bg-slate-800 p-6"><p className="text-sm font-semibold text-blue-200">하나로 이어지는 개발 경험</p><ol className="mt-5 space-y-5">{['배운 내용을 글과 시리즈로 정리', '공개 글을 GitHub 저장소에 백업', '프로젝트와 이력서를 프로필로 공유'].map((text, i) => <li key={text} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm">{i+1}</span><span className="leading-7">{text}</span></li>)}</ol><p className="mt-6 border-t border-slate-600 pt-4 text-sm leading-6 text-slate-300">글은 공개 범위를 선택하고, 이력서는 원하는 정보만 공유할 수 있습니다.</p></aside>
    </section>
    <section className="py-12"><h2 className="text-2xl font-bold text-slate-900">지금 필요한 곳에서 시작하세요</h2><div className="mt-6 grid gap-5 tablet:grid-cols-3">{steps.map(step => <article key={step.number} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6"><p className="font-bold text-blue-700">{step.number}</p><h3 className="mt-3 text-xl font-bold text-slate-900">{step.title}</h3><p className="mb-6 mt-3 flex-1 text-sm leading-7 text-slate-600">{step.text}</p><Link href={step.href} className="font-semibold text-blue-800">{step.action} →</Link></article>)}</div></section>
    <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6 tablet:p-8"><h2 className="text-xl font-bold text-slate-900">이력서부터 만들어도 괜찮아요</h2><p className="mt-3 leading-7 text-slate-700">로그인 없이 작성과 PDF 출력을 시작할 수 있습니다. 계정에 저장하면 다른 기기에서 이어 쓰고 공개 링크도 만들 수 있어요.</p><Link href="/resume" className="mt-5 inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white">무료 이력서 작성</Link></section>
    <footer className="mt-10 flex flex-wrap justify-between gap-4 border-t border-slate-200 py-6 text-sm text-slate-600"><span>LOGME · logme.cloud</span><Link href="/article?view=all">개발 기록 둘러보기 →</Link></footer>
  </main>;
}
