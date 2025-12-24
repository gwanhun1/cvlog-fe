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

### 🔐 인증 및 라우팅 시스템

사용자 경험과 보안을 동시에 고려한 인증 및 라우팅 시스템을 구축했습니다.

#### 주요 특징:

- **선택적 AuthGuard 적용** — 전역에서 AuthGuard를 제거하고 인증이 필요한 페이지에만 개별 적용하여, 공용 페이지(홈, 아티클 목록 등) 진입 속도를 극대화했습니다.
- **라우팅 시각화** — NProgress를 연동하여 페이지 전환 시 사용자에게 즉각적인 시각적 피드백을 제공합니다.
- **호버 프리페칭 (Hover Prefetching)** — 리스트에서 아티클 카드에 마우스를 올리면 상세 데이터를 미리 불러와서 클릭 시 즉시 렌더링되는 경험을 제공합니다.
- **토큰 기반 인증** — JWT 액세스 및 리프레시 토큰 관리 및 자동 갱신.

### ⚡ 성능 최적화 및 렌더링 전략

Velog 수준의 초고속 사용자 경험을 목표로 하여, 페이지별 특성에 맞는 최적의 렌더링 전략과 성능 최적화 기법을 적용했습니다.

#### 🏗️ 페이지별 렌더링 방식 (Rendering Strategy)

| 페이지 그룹 | 경로 | 전략 | 적용 이유 및 효과 |
| :--- | :--- | :--- | :--- |
| **공용 (Public)** | `/`, `/article`, `/article/content/all/[pid]` | **ISR (60s)** | **SEO 최적화.** 빌드 시점에 HTML을 생성하여 크롤러에게 즉각 응답하고, 정기적 갱신으로 최신성 유지. |
| **개인 (Private)** | `/article/content/[pid]` | **ISR (60s)** | 작성자 전용 상세 페이지도 빠른 조회를 위해 ISR 적용. 보안은 클라이언트 단 가드로 처리. |
| **마이페이지** | `/mypage` | **SSR** | 사용자 개인 정보를 실시간으로 반영하며, 서버 사이드에서 세션 유효성을 매번 검증. |
| **관리/분석** | `/article/new`, `/modify/[pid]`, `/github` | **CSR** | 에디터 라이브러리 활용 및 실시간 외부 API 연동(GitHub)을 위해 클라이언트에서 렌더링. |

#### 🚀 주요 성능 개선 결과 (Performance Impact)

| 개선 항목 | 작업 전 (Before) | 작업 후 (After) | 기대 효과 |
| :--- | :--- | :--- | :--- |
| **초기 로딩 (FCP)** | 전역 AuthGuard 체크로 인해 0.5~1초 로딩 지연 | 공용 페이지 가드 제거로 즉시 콘텐츠 노출 | 사용자 이탈률 감소 |
| **상세 페이지 이동** | 클릭 후 서버 사이드 페칭 완료까지 대기 (약 1초) | **호버 시 프리페칭**으로 클릭 즉시 화면 전환 | Near-Instant 경험 |
| **라우팅 피드백** | 화면 멈춤 현상 발생 (진행 상황 불분명) | **NProgress** 진행 바 표시로 체감 대기 시간 단축 | 사용자 인터랙션 강화 |
| **SEO 응답 속도** | SSR 기반으로 서버 연산 후 응답 (가변적) | ISR 정적 HTML 즉시 반환 (일관되게 빠름) | 검색 엔진 랭킹 긍정적 영향 |

#### 🔍 SEO 최적화 상세

이번 성능 개선 작업은 단순한 속도 향상을 넘어 **구글 검색 노출 최적화**를 최우선으로 고려했습니다.

1.  **LCP(Largest Contentful Paint) 단축**: 전역 인증 가드 제거 및 ISR 적용으로 브라우저가 첫 주요 콘텐츠를 그리는 시간이 비약적으로 단축되어, 핵심 웹 지표(Core Web Vitals) 점수가 크게 향상되었습니다.
2.  **크롤링 효율 증대**: 서버 사이드 연산 없이 정적 HTML을 서빙함으로써 검색봇이 더 많은 페이지를 더 빠르게 인덱싱할 수 있는 환경을 구축했습니다.
3.  **구조화 데이터 유지**: ISR 전환 후에도 JSON-LD와 Meta Tag가 HTML에 고스란히 정적으로 포함되어 있어, 검색 결과에서 풍부한 스니펫(Rich Snippets) 노출을 보장합니다.

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

### 1️⃣ Velog 수준의 고성능 라우팅 구현

<table>
<tr>
<td width="30%"><b>도전</b></td>
<td>
• 페이지 전환 시 발생하는 데이터 페칭 대기 시간으로 인한 UX 저하<br>
• 전역 AuthGuard 적용으로 인한 모든 페이지 진입 지연
</td>
</tr>
<tr>
<td><b>해결</b></td>
<td>
• <b>React Query Prefetching</b>: 목록에서 호버 시 상세 정보를 미리에 페칭하여 딜레이 제거<br>
• <b>Selective Guard</b>: 인증이 필요한 라우트만 선별적으로 감싸 public 접근 속도 극대화<br>
• <b>NProgress</b>: 시각적 라우팅 인터커넥션으로 체감 속도 향상
</td>
</tr>
</table>

### 2️⃣ 복잡한 폴더 구조 관리

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

### 3️⃣ 마크다운 렌더링 최적화

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

### 4️⃣ 인증 및 토큰 관리

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
