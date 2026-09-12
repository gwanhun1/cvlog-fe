import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import useIsLogin from 'hooks/useIsLogin';
import HomeData from 'public/mockData/aboutMockData.json';

const FeaturesSection = dynamic(
  () => import('components/pages/home/FeaturesSection'),
  {
    ssr: false,
    loading: () => (
      <section
        aria-label="기능 데모 불러오는 중"
        className="min-h-[420px] animate-pulse rounded-2xl border border-slate-200 bg-slate-50"
      />
    ),
  },
);

const features = [
  {
    number: '01',
    title: '경험을 기록하고',
    text: '마크다운으로 글을 쓰고 태그와 시리즈로 배운 내용을 정리하세요.',
  },
  {
    number: '02',
    title: 'GitHub에 보관하고',
    text: '공개 글을 저장소에 백업하고 반영되지 않은 기록을 확인하세요.',
  },
  {
    number: '03',
    title: '이력서로 전하세요',
    text: '프로젝트와 경력을 정리하고 원하는 정보만 링크로 공유하세요.',
  },
];
const actionClass =
  'inline-flex min-h-[44px] items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ftBlue';

export default function Home() {
  const { isAuthenticated } = useIsLogin();
  return (
    <main className="mx-auto w-full max-w-6xl px-3 py-6 tablet:px-0 tablet:py-10">
      <Head>
        <title>LOGME · 개발 기록을 포트폴리오로</title>
        <meta
          name="description"
          content="개발 경험을 기록하고 GitHub에 백업하세요. 글, 프로젝트, 이력서를 하나의 공개 프로필로 연결하는 LOGME."
        />
        <meta property="og:title" content="LOGME · 개발 기록을 포트폴리오로" />
        <meta
          property="og:description"
          content="글부터 GitHub 백업, 이력서 공유까지. 개발자의 기록이 이어지는 곳."
        />
        <meta property="og:url" content="https://logme.cloud" />
        <meta
          property="og:image"
          content="https://logme.cloud/assets/logo.png"
        />
        <link rel="canonical" href="https://logme.cloud" />
      </Head>
      <section className="border-b border-slate-200 pb-10 tablet:pb-14">
        <p className="text-sm font-semibold text-ftBlue">
          LOGME · 개발자의 기록 공간
        </p>
        <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 tablet:text-5xl">
          오늘의 개발 기록이
          <br />
          내일의 포트폴리오로.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
          배운 내용을 글로 남기고, GitHub에 보관하고, 이력서로 경험을 전하세요.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href={isAuthenticated ? '/workspace' : '/login?redirect=/workspace'}
            className={`${actionClass} bg-ftBlue text-white hover:bg-ftBlue/90`}
          >
            {isAuthenticated ? '내 작업 이어가기' : '내 기록 시작하기'}
          </Link>
          <Link
            href="/article?view=all"
            className={`${actionClass} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`}
          >
            공개 글 둘러보기
          </Link>
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-600">
          이력서부터 시작하고 싶다면{' '}
          <Link
            href="/resume"
            className="inline-flex min-h-[44px] items-center font-semibold text-ftBlue underline underline-offset-4"
          >
            로그인 없이 작성하기 →
          </Link>
        </p>
      </section>

      <section
        aria-labelledby="home-features-title"
        className="py-9 tablet:py-12"
      >
        <h2 id="home-features-title" className="sr-only">
          기록에서 공유까지
        </h2>
        <ol className="grid gap-7 tablet:grid-cols-3 tablet:gap-10">
          {features.map(feature => (
            <li key={feature.number}>
              <span
                aria-hidden="true"
                className="text-sm font-semibold text-ftBlue"
              >
                {feature.number}
              </span>
              <h3 className="mt-3 text-lg font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {feature.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="pb-12" aria-labelledby="feature-demo-title">
        <div className="mb-6">
          <p className="text-sm font-bold text-blue-700">직접 확인하는 LOGME</p>
          <h2
            id="feature-demo-title"
            className="mt-2 text-2xl font-bold text-slate-900"
          >
            글쓰기 기능을 움직이는 화면으로 확인하세요
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            마크다운 작성부터 이미지 업로드, 글 탐색과 태그 정리까지 실제 동작을
            탭별로 볼 수 있습니다.
          </p>
        </div>
        <FeaturesSection data={HomeData.data} />
      </section>
      <footer className="flex flex-wrap items-center justify-between gap-3 py-5 text-sm text-slate-500">
        <span>LOGME · logme.cloud</span>
        <Link
          href="/github"
          className="inline-flex min-h-[44px] items-center hover:text-ftBlue"
        >
          GitHub 활동 둘러보기 →
        </Link>
      </footer>
    </main>
  );
}
