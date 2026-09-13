import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  FiArrowRight,
  FiBookOpen,
  FiEdit3,
  FiFileText,
  FiGithub,
  FiGrid,
  FiHeart,
  FiSettings,
  FiExternalLink,
  FiMonitor,
  FiPlus,
  FiLock,
  FiGlobe,
  FiAlertCircle,
} from 'react-icons/fi';
import type { BlogType } from 'service/api/tag/type';
import type { SavedResume } from 'service/api/resume';
import type { LocalDraft } from 'hooks/useLocalDrafts';
import {
  IdentitySkeleton,
  RecordSkeleton,
} from 'components/pages/design/LoadingShapes';
import s from 'styles/logmeDesign.module.scss';

export type LoadState = 'loading' | 'error' | 'ready';
export interface WorkspaceViewProps {
  displayName: string;
  username?: string | null;
  userState: LoadState;
  retryUser: () => void;
  userFetching: boolean;
  drafts: LocalDraft[];
  draftState: LoadState;
  posts: BlogType[];
  postState: LoadState;
  retryPosts: () => void;
  postsFetching: boolean;
  resumes: SavedResume[];
  resumeState: LoadState;
  retryResumes: () => void;
  resumesFetching: boolean;
  backup: ReactNode;
}

const navigation = [
  { href: '/workspace', label: '개요', icon: FiGrid },
  { href: '/article?view=my', label: '내 글', icon: FiBookOpen },
  { href: '/article/liked', label: '좋아요', icon: FiHeart },
  { href: '/github', label: 'GitHub', icon: FiGithub },
];
const formatDate = (value: string | number) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '날짜 없음'
    : date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
};

export default function WorkspaceView(p: WorkspaceViewProps) {
  return (
    <main className={`${s.root} ${s.workspace}`}>
      <aside className={s.rail} aria-label="작업 공간">
        {p.userState === 'loading' ? (
          <IdentitySkeleton />
        ) : (
          <div className={s.identity}>
            <span aria-hidden="true" className={s.avatar}>
              {p.userState === 'ready' ? p.displayName.slice(0, 1) : 'L'}
            </span>
            <span className={s.identityName}>
              {p.userState === 'ready' ? p.displayName : '내 작업 공간'}
            </span>
          </div>
        )}
        <nav className={s.railNav} aria-label="작업실 메뉴">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={href === '/workspace' ? 'page' : undefined}
              className={s.railLink}
            >
              <Icon aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className={s.railSecondary}>
          <Link href="/workspace/github" className={s.railLink}>
            <FiGithub aria-hidden="true" />
            백업 설정
          </Link>
          {p.username && (
            <Link href={`/u/${p.username}`} className={s.railLink}>
              <FiExternalLink aria-hidden="true" />
              공개 프로필
            </Link>
          )}
          <Link href="/mypage" className={s.railLink}>
            <FiSettings aria-hidden="true" />
            계정 설정
          </Link>
        </div>
      </aside>
      <div className={s.workspaceBody}>
        <header className={s.workspaceHeader}>
          <div>
            <h1>내 작업실</h1>
            <p>쓰던 글을 이어가고, 다음 지원을 준비하세요.</p>
          </div>
          <Link href="/article/new" className={s.primary}>
            <FiPlus aria-hidden="true" />새 글 쓰기
          </Link>
        </header>
        {p.userState === 'error' && (
          <div role="alert" className={s.issue}>
            <FiAlertCircle aria-hidden="true" />
            <span>계정 정보를 불러오지 못했습니다.</span>
            <button
              type="button"
              disabled={p.userFetching}
              onClick={p.retryUser}
            >
              {p.userFetching ? '확인 중…' : '다시 불러오기'}
            </button>
          </div>
        )}
        <div className={s.workGrid}>
          <div className={s.records}>
            <section
              aria-labelledby="draft-title"
              aria-busy={p.draftState === 'loading'}
            >
              <div className={s.sectionHead}>
                <div className={s.sectionTitle}>
                  <h2 id="draft-title">이어서 작성</h2>
                  {p.draftState === 'ready' && p.drafts.length > 0 && (
                    <span className={s.count}>{p.drafts.length}</span>
                  )}
                </div>
                <span
                  className={s.localNote}
                  title="이 브라우저에 저장된 초안이며 다른 기기와 자동 동기화되지 않습니다."
                >
                  <FiMonitor aria-hidden="true" />이 기기에 저장
                </span>
              </div>
              {p.draftState === 'loading' ? (
                <RecordSkeleton kind="drafts" />
              ) : p.draftState === 'error' ? (
                <p className={s.inlineError}>
                  브라우저 저장소를 사용할 수 없습니다. 저장소 접근 설정을
                  확인해주세요.
                </p>
              ) : p.drafts.length ? (
                <ul className={s.draftList}>
                  {p.drafts.map(draft => (
                    <li key={draft.key}>
                      <Link href={draft.href} className={s.draftLink}>
                        <FiFileText
                          aria-hidden="true"
                          className={s.documentIcon}
                        />
                        <div className={s.draftText}>
                          <h3>{draft.title}</h3>
                          <p>
                            {draft.key === 'logme_resume_v2'
                              ? '이력서 초안'
                              : '글 초안'}
                            {draft.updatedAt
                              ? ` · ${formatDate(draft.updatedAt)}`
                              : ''}
                          </p>
                        </div>
                        <FiArrowRight
                          className={s.rowArrow}
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={s.empty}>
                  <FiEdit3 aria-hidden="true" />
                  <div>
                    <h3>새로운 기록을 남겨보세요.</h3>
                    <p>작성 중인 초안이 없습니다.</p>
                    <Link href="/article/new" className={s.textLink}>
                      첫 문장 쓰기
                      <FiArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              )}
            </section>
            <section
              aria-labelledby="recent-title"
              aria-busy={p.postState === 'loading'}
            >
              <div className={s.sectionHead}>
                <h2 id="recent-title">최근 글</h2>
                <Link href="/article?view=my" className={s.textLink}>
                  전체 보기
                  <FiArrowRight aria-hidden="true" />
                </Link>
              </div>
              {p.userState === 'error' ? (
                <p className={s.inlineError}>
                  계정 확인 후 작성한 글을 표시합니다.
                </p>
              ) : p.postState === 'loading' ? (
                <RecordSkeleton />
              ) : p.postState === 'error' ? (
                <div className={s.inlineError}>
                  최근 글을 불러오지 못했습니다.
                  <button
                    type="button"
                    disabled={p.postsFetching}
                    onClick={p.retryPosts}
                  >
                    {p.postsFetching ? '불러오는 중…' : '다시 불러오기'}
                  </button>
                </div>
              ) : p.posts.length ? (
                <ul className={s.postList}>
                  {p.posts.map(post => (
                    <li className={s.postRow} key={post.id}>
                      <div>
                        <Link
                          href={`/article/content/${post.id}`}
                          className={s.postTitle}
                        >
                          {post.title || '제목 없는 글'}
                        </Link>
                        <div className={s.postMeta}>
                          <span className={s.status}>
                            {post.public_status ? (
                              <FiGlobe aria-hidden="true" />
                            ) : (
                              <FiLock aria-hidden="true" />
                            )}
                            {post.public_status ? '공개' : '비공개'}
                          </span>
                          <time dateTime={post.updated_at}>
                            {formatDate(post.updated_at)}
                          </time>
                        </div>
                      </div>
                      <Link
                        href={`/article/modify/${post.id}`}
                        aria-label={`${post.title || '제목 없는 글'} 수정`}
                        className={s.editLink}
                      >
                        <FiEdit3 aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={s.empty}>
                  <FiBookOpen aria-hidden="true" />
                  <div>
                    <h3>아직 작성한 글이 없어요.</h3>
                    <p>배운 것과 해결한 문제를 기록으로 남겨보세요.</p>
                    <Link href="/article/new" className={s.textLink}>
                      글 쓰기
                      <FiArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              )}
            </section>
          </div>
          <aside className={s.utilities} aria-label="커리어 도구">
            <section
              className={s.utility}
              aria-labelledby="resume-title"
              aria-busy={p.resumeState === 'loading'}
            >
              <h2 id="resume-title">
                <FiFileText aria-hidden="true" />내 이력서
              </h2>
              {p.userState === 'error' ? (
                <p>계정 확인 후 저장한 이력서를 표시합니다.</p>
              ) : p.resumeState === 'loading' ? (
                <RecordSkeleton kind="utility" />
              ) : p.resumeState === 'error' ? (
                <div className={s.inlineError}>
                  이력서를 불러오지 못했습니다.
                  <button
                    type="button"
                    disabled={p.resumesFetching}
                    onClick={p.retryResumes}
                  >
                    {p.resumesFetching ? '불러오는 중…' : '다시 불러오기'}
                  </button>
                </div>
              ) : p.resumes.length ? (
                <ul>
                  {p.resumes.map(resume => (
                    <li key={resume.id} className={s.resumeRow}>
                      <strong>{resume.title}</strong>
                      <time dateTime={resume.updated_at}>
                        {formatDate(resume.updated_at)} 수정
                      </time>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  경력과 프로젝트를 정리해보세요. 로그인 없이도 작성할 수
                  있어요.
                </p>
              )}
              <Link href="/resume" className={s.textLink}>
                이력서 열기
                <FiArrowRight aria-hidden="true" />
              </Link>
            </section>
            <section className={s.utility} aria-labelledby="github-title">
              <h2 id="github-title">
                <FiGithub aria-hidden="true" />
                GitHub
              </h2>
              <p>기여 활동과 저장소에서 개발 경험을 확인하세요.</p>
              <Link href="/github" className={s.textLink}>
                GitHub 활동 보기
                <FiArrowRight aria-hidden="true" />
              </Link>
              <div className={s.backup}>{p.backup}</div>
            </section>
          </aside>
        </div>
        <footer className={s.workspaceFooter}>
          <Link href="/workspace/github">GitHub 백업 설정</Link>
          {p.username && <Link href={`/u/${p.username}`}>공개 프로필</Link>}
          <Link href="/mypage">계정 설정</Link>
        </footer>
      </div>
    </main>
  );
}
