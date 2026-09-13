import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FiArrowRight, FiGithub, FiFileText } from 'react-icons/fi';
import useIsLogin from 'hooks/useIsLogin';
import HomeData from 'public/mockData/aboutMockData.json';
import { DemoSkeleton } from 'components/pages/design/LoadingShapes';
import s from 'styles/logmeDesign.module.scss';

const FeaturesSection = dynamic(
  () => import('components/pages/home/FeaturesSection'),
  { ssr: false, loading: DemoSkeleton },
);

export default function Home() {
  const { isAuthenticated } = useIsLogin();
  return (
    <main className={s.root}>
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

      <section className={s.homeIntro}>
        <h1 className={s.homeTitle}>
          개발 기록을 쓰고,
          <br />
          <span>나를 소개하세요.</span>
        </h1>
        <div className={s.homePitch}>
          <p>
            배운 것은 글로, 만든 것은 포트폴리오로.
            <br />
            블로그 · 이력서 · GitHub, 커리어를 준비하는 한곳.
          </p>
          <div className={s.actions}>
            <Link
              href={
                isAuthenticated ? '/workspace' : '/login?redirect=/workspace'
              }
              className={s.primary}
            >
              {isAuthenticated ? '작업실 열기' : '기록 시작하기'}
              <FiArrowRight aria-hidden="true" />
            </Link>
            <Link href="/article?view=all" className={s.secondary}>
              글 둘러보기
            </Link>
          </div>
        </div>
      </section>
      <div className={s.demo}>
        <FeaturesSection data={HomeData.data} />
      </div>
      <div className={s.homePaths}>
        <section className={s.path}>
          <FiGithub className={s.pathIcon} aria-hidden="true" />
          <div>
            <h2>코드로 보여주는 나의 경험.</h2>
            <p>GitHub 활동과 저장소를 살펴보고, 개발 기록을 연결하세요.</p>
            <Link href="/github" className={s.textLink}>
              GitHub 살펴보기
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
        <section className={s.path}>
          <FiFileText className={s.pathIcon} aria-hidden="true" />
          <div>
            <h2>이력서부터 시작해도 좋아요.</h2>
            <p>
              로그인 없이 작성하고 PDF로 출력하세요. 계정에 저장하면 링크로
              공유할 수 있어요.
            </p>
            <Link href="/resume" className={s.textLink}>
              이력서 작성하기
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
      <footer className={s.homeFooter}>
        <span className={s.wordmark}>LOGME</span>
        <span>개발자의 블로그, 이력서, GitHub.</span>
      </footer>
    </main>
  );
}
