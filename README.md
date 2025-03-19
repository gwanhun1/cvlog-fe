<div align="center">
  <img src="https://github.com/user-attachments/assets/419ebbc0-5287-41d3-9fd0-e988efe92d2e" alt="LOGME Logo" width="200" height="200">
  <h1>LOGME</h1>
  <p><strong>개발자를 위한 마크다운 블로그 & 포트폴리오 플랫폼</strong></p>
</div>

<div align="center">
  
  ![Next.js](https://img.shields.io/badge/Next.js-15.2.1-000000?style=flat-square&logo=next.js)
  ![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=flat-square&logo=typescript)
  ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.3-06B6D4?style=flat-square&logo=tailwindcss)
  ![Recoil](https://img.shields.io/badge/Recoil-0.7.7-3578E5?style=flat-square&logo=recoil)
  ![React Query](https://img.shields.io/badge/React_Query-3.39.3-FF4154?style=flat-square&logo=reactquery)

</div>

<div align="center">
  <p>
    <a href="#-프로젝트-소개">🚀 소개</a> •
    <a href="#-핵심-기능">✨ 기능</a> •
    <a href="#-기술-스택">🛠️ 기술</a> •
    <a href="#-아키텍처">🏛️ 구조</a> •
    <a href="#-구현-사항">🔍 구현</a> •
    <a href="#-실행-방법">▶️ 실행</a> •
    <a href="#-기술적-도전과-해결">🔧 해결책</a>
  </p>
</div>

<br/>
<br/>
<br/>

## 🚀 프로젝트 소개

**LOGME**는 개발자를 위한 올인원 포트폴리오 플랫폼입니다.

> 📝 **마크다운 블로그** + 🔄 **GitHub 통합** + 📄 **이력서 빌더**

개발자가 자신의 지식, 프로젝트, 경력을 효과적으로 전시할 수 있는 통합 플랫폼을 제공하여 커리어 성장을 지원합니다.

<br/>

<div align="center">
  <img src="https://github.com/user-attachments/assets/7980123f-517e-4ac0-b75b-77adf2800f67" alt="LOGME 스크린샷" width="800">
</div>

<br/>

## ✨ 핵심 기능

### 📝 마크다운 아티클 관리

- **풍부한 에디터** — React SimpleMDE 기반 WYSIWYG 에디터
- **구문 강조** — 다양한 프로그래밍 언어 코드 하이라이팅
- **폴더 구조화** — 드래그 앤 드롭으로 콘텐츠 정리
- **실시간 미리보기** — 편집 중 렌더링 확인

### 🔄 GitHub 통합

- **저장소 연동** — GitHub 프로젝트와 포트폴리오 통합
- **커밋 시각화** — 활동 그래프로 기여도 표시
- **README 가져오기** — 프로젝트 설명 자동 통합

### 📱 반응형 사용자 경험

- **반응형 디자인** — 모든 기기에서 최적화된 경험

<br/>

<br/>

## 🛠️ 기술 스택

<div align="center">

### 프론트엔드 핵심

`Next.js 15.2.1` • `React 18.2.0` • `TypeScript 5.8.2`

### 상태 관리

`Recoil 0.7.7` • `React Query 3.39.3` • `Recoil-persist`

### 스타일링

`TailwindCSS 3.3.3` • `SCSS` • `Styled Components` • `Flowbite React`

### 마크다운 처리

`React Markdown` • `Remark & Rehype` • `React SimpleMDE` • `React Syntax Highlighter`

### UI/UX 개선

`DND Kit` • `React Window & Virtualized` • `React Icons` • `Lottie React`

</div>

<br/>
<br/>

### 📂 폴더 구조

```
cvlog-fe/
├── components/     # 기능 및 UI 컴포넌트
│   ├── pages/      # 페이지별 특화 컴포넌트
│   └── Shared/     # 공유 컴포넌트
├── hooks/          # 커스텀 React 훅
├── lib/            # 유틸리티 라이브러리
├── pages/          # Next.js 라우트
├── public/         # 정적 자산
├── service/        # API 클라이언트 & 서비스
├── styles/         # 전역 스타일 및 테마
└── utils/          # 유틸리티 함수
```

<br/>
<br/>
<br/>

## 🔍 구현 사항

### 📝 아티클 관리 시스템

고급 마크다운 에디팅 시스템으로 개발자가 기술 콘텐츠를 효과적으로 작성하고 관리할 수 있습니다.

#### 주요 특징:

- **폴더 관리** — DND Kit 활용 드래그 앤 드롭 구현
- **문서 분류** — 계층적 카테고리 시스템으로 정리
- **마크다운 렌더링** — 코드 하이라이팅, 표, 이미지 지원

```tsx
// 예시: 드래그 앤 드롭 폴더 구현
const DroppableFolder = ({ folder, onDrop }: DroppableFolderProps) => {
  const { setNodeRef } = useDroppable({ id: folder.id });

  return (
    <div ref={setNodeRef} className="folder-container">
      <FolderHeader title={folder.name} />
      {folder.children.map(item => (
        <DraggableItem key={item.id} item={item} />
      ))}
    </div>
  );
};
```

### 🔐 인증 시스템

JWT 기반 인증 시스템으로 사용자 데이터와 콘텐츠를 안전하게 보호합니다.

#### 주요 특징:

- **토큰 기반 인증** — JWT 액세스 및 리프레시 토큰 관리
- **보호된 라우트** — AuthGuard 컴포넌트로 페이지 보호
- **자동 토큰 갱신** — 백그라운드 토큰 리프레시

```tsx
// 예시: AuthGuard 구현
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.push('/login');
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) return <LoadingSpinner />;
  return isLoggedIn ? <>{children}</> : null;
};
```

### ⚡ 성능 최적화

대규모 데이터 처리와 최적의 사용자 경험을 위한 다양한 성능 최적화 기법을 적용했습니다.

| 최적화 전략       | 설명                                     |
| :---------------- | :--------------------------------------- |
| **가상화**        | React Window로 대량 목록 효율적 렌더링   |
| **코드 분할**     | Next.js의 동적 임포트로 번들 크기 최적화 |
| **이미지 최적화** | 브라우저 압축으로 업로드 용량 감소       |
| **메모이제이션**  | React.memo와 useMemo로 렌더링 최적화     |

---

<br/>
<br/>
<br/>
<br/>

## ▶️ 실행 방법

### 📋 환경 설정

```bash
# Node.js v14+ 및 npm/yarn 필요

# 저장소 클론
git clone https://github.com/your-username/cvlog-fe.git
cd cvlog-fe

# 환경 변수 설정 (.env.local 파일)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 🚀 설치 및 실행

```bash
# 의존성 설치
npm install
# 또는
yarn install

# 개발 서버 실행
npm run dev
# 또는
yarn dev
```

### 📦 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build
# 또는
yarn build

# 프로덕션 서버 실행
npm run start
# 또는
yarn start
```

<br/>
<br/>
<br/>
<br/>

## 🔧 기술적 도전과 해결

### 1️⃣ 복잡한 폴더 구조 관리

<table>
<tr>
<td width="30%"><b>도전</b></td>
<td>
• 중첩된 폴더 구조에서 드래그 앤 드롭 상태 관리 복잡성<br>
• 재귀적 구조 최적화 어려움
</td>
</tr>
<tr>
<td><b>해결</b></td>
<td>
• <a href="https://dndkit.com/">DND Kit</a> 라이브러리 활용한 직관적인 UI 구현<br>
• 가상화 기술로 렌더링 성능 향상
</td>
</tr>
</table>

### 2️⃣ 마크다운 렌더링 최적화

<table>
<tr>
<td width="30%"><b>도전</b></td>
<td>
• 마크다운의 HTML 변환 과정에서 XSS 및 보안 이슈<br>
• 복잡한 코드 블록, 표, 수식 등의 렌더링 최적화
</td>
</tr>
<tr>
<td><b>해결</b></td>
<td>
• Remark/Rehype 플러그인 체인으로 변환 프로세스 커스터마이징<br>
• React.memo와 동적 임포트로 렌더링 성능 최적화
</td>
</tr>
</table>

### 3️⃣ 인증 및 토큰 관리

<table>
<tr>
<td width="30%"><b>도전</b></td>
<td>
• JWT 토큰 만료 및 자동 갱신 관리<br>
• 보안 이슈 방지
</td>
</tr>
<tr>
<td><b>해결</b></td>
<td>
• 인터셉터 기반 토큰 리프레시 메커니즘 구현<br>
• 쿠키 기반 토큰 저장으로 XSS 위험 감소
</td>
</tr>
</table>

<br/>
<br/>
<br/>
<br/>

## 🔜 향후 개발 계획

- **협업 기능** — 여러 개발자가 함께 문서 작업할 수 있는 실시간 협업
- **SEO 최적화** — 블로그 콘텐츠의 검색 엔진 노출 향상
- **커스텀 테마** — 사용자 지정 브랜딩과 디자인 지원

<div align="center">
  <p> 2025 LOGME Team. All Rights Reserved.</p>
</div>
