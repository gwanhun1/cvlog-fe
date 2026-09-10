import Head from 'next/head';
import Link from 'next/link';
import { useSharedResume } from 'hooks/useSharedResume';
import { SECTION_LABELS } from './types';
export default function SharedResumePage({ token }: { token: string }) {
  const query = useSharedResume(token);
  const unavailable = !/^[a-f0-9]{64}$/.test(token) || query.isError;
  if (unavailable) return <main className="mx-auto max-w-3xl p-8"><Head><meta name="robots" content="noindex,nofollow" /></Head><h1 className="text-2xl font-bold">이력서를 열 수 없습니다.</h1><p className="mt-3 text-slate-600">공유가 종료되었거나 연결에 문제가 있습니다. 새 링크를 확인해주세요.</p><button className="mt-5 rounded border p-3" onClick={() => query.refetch()}>다시 시도</button></main>;
  if (!query.data) return <main className="p-8" role="status">이력서를 불러오는 중입니다.</main>;
  const { data, title } = query.data;
  const info = data.basicInfo;
  const safeLink = (value: string) => { try { const url = new URL(value.includes('://') ? value : `https://${value}`); return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null; } catch { return null; } };
  return <main className="mx-auto max-w-3xl px-5 py-10 text-slate-900">
    <Head><title>{info.name || title} · 공개 이력서</title><meta name="robots" content="noindex,nofollow" /><meta name="referrer" content="no-referrer" /></Head>
    <div className="mb-6 flex items-center justify-between print:hidden"><Link href="/" className="text-blue-700">LOGME</Link><button onClick={() => window.print()} className="rounded-lg border border-slate-300 px-4 py-2">인쇄 / PDF</button></div>
    <article className="rounded-2xl border border-slate-200 bg-white p-6 tablet:p-10 print:border-0"><header className="border-b border-slate-200 pb-6"><h1 className="text-3xl font-bold">{info.name || title}</h1><p className="mt-2 text-lg text-slate-700">{info.title}</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">{[info.email, info.phone, info.location].filter(Boolean).map(value => <span key={value}>{value}</span>)}</div><div className="mt-3 flex flex-wrap gap-4">{[info.github, info.website, info.portfolio].filter(Boolean).map(value => safeLink(value) && <a className="break-all text-sm text-blue-700 underline" key={value} href={safeLink(value)!} rel="noreferrer" target="_blank">{value}</a>)}</div><p className="mt-5 whitespace-pre-line leading-7">{info.summary}</p>{info.about && <p className="mt-4 whitespace-pre-line leading-7 text-slate-700">{info.about}</p>}</header>
      {data.sectionOrder.map(section => data[section]?.length > 0 && <section key={section} className="mt-8"><h2 className="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">{SECTION_LABELS[section]}</h2><div className="space-y-6">{data[section].map((item, index) => { const row = item as unknown as Record<string, string | boolean>; return <div key={index} className="break-inside-avoid"><h3 className="font-bold">{String(row.company || row.name || row.school || row.category || '')}</h3><p className="mt-1 text-sm text-slate-600">{[row.role, row.degree, row.major, row.period, row.startDate, row.isCurrent ? '재직 중' : row.endDate, row.date, row.issuer].filter(Boolean).join(' · ')}</p>{[row.projectName, row.projectSubtitle, row.subtitle, row.description, row.techStack, row.items, row.grade].filter(Boolean).map((text, i) => <p key={i} className="mt-2 whitespace-pre-line leading-7">{String(text)}</p>)}{[row.githubUrl, row.liveUrl].filter(v => typeof v === 'string' && v).map(value => safeLink(String(value)) && <a key={String(value)} className="mr-4 mt-2 inline-block break-all text-blue-700 underline" href={safeLink(String(value))!} target="_blank" rel="noreferrer">{String(value)}</a>)}</div>; })}</div></section>)}
    </article>
  </main>;
}
