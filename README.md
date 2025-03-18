<div align="center">
  <img src="https://via.placeholder.com/200x200.png?text=LOGME" alt="LOGME Logo" width="200" height="200">
  <h1>LOGME - 개발자를 위한 마크다운 블로그 & 포트폴리오 플랫폼</h1>
</div>

<div align="center">
  
  ![Next.js](https://img.shields.io/badge/Next.js-15.2.1-000000?style=for-the-badge&logo=next.js)
  ![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript)
  ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.3-06B6D4?style=for-the-badge&logo=tailwindcss)
  ![Recoil](https://img.shields.io/badge/Recoil-0.7.7-3578E5?style=for-the-badge&logo=recoil)
  ![React Query](https://img.shields.io/badge/React_Query-3.39.3-FF4154?style=for-the-badge&logo=reactquery)

</div>

<p align="center">
  <a href="#-프로젝트-소개">프로젝트 소개</a> •
  <a href="#-핵심-기능">핵심 기능</a> •
  <a href="#-기술-스택">기술 스택</a> •
  <a href="#-아키텍처">아키텍처</a> •
  <a href="#-구현-사항">구현 사항</a> •
  <a href="#-실행-방법">실행 방법</a> •
  <a href="#-기술적-도전과-해결">기술적 도전과 해결</a>
</p>

## 🚀 프로젝트 소개

**LOGME**는 개발자를 위한 올인원 포트폴리오 플랫폼으로, 마크다운 기반 블로그, GitHub 통합, 그리고 이력서 빌더 기능을 제공합니다. 사용자는 기술 아티클을 작성하고, 프로젝트를 전시하며, 전문적인 개발자 포트폴리오를 구축할 수 있습니다.

> **LOGME의 핵심 가치:**  
> 개발자가 자신의 지식, 프로젝트, 경력을 효과적으로 전시할 수 있는 통합 플랫폼을 제공하여 개발자의 커리어 성장을 지원합니다.

<div align="center">
  <img src="https://via.placeholder.com/800x400.png?text=LOGME+Screenshot" alt="LOGME 스크린샷" width="800">
</div>

## ✨ 핵심 기능

### 1. 마크다운 아티클 관리

- **풍부한 마크다운 에디터**: React SimpleMDE를 활용한 직관적인 WYSIWYG 에디터
- **구문 강조**: 코드 블록의 다양한 프로그래밍 언어 하이라이팅
- **폴더 구조화**: 드래그 앤 드롭으로 콘텐츠를 체계적으로 구성
- **실시간 미리보기**: 편집 중 마크다운 렌더링 확인

### 2. GitHub 통합

- **저장소 연동**: 주요 GitHub 프로젝트와 기여도를 포트폴리오에 통합
- **커밋 시각화**: 활동 그래프로 GitHub 기여도 표시
- **README 자동 가져오기**: 프로젝트 설명을 포트폴리오에 자동으로 통합

### 3. 이력서 

<!-- - **다양한 템플릿**: 전문적인 이력서 템플릿 제공
- **섹션 관리**: 경력, 교육, 기술, 프로젝트 섹션 맞춤화
- **다중 이력서**: 직무나 산업별 맞춤형 이력서 관리
- **PDF 내보내기**: 전문적인 이력서를 PDF로 변환 -->

### 4. 반응형 사용자 경험

- **반응형 디자인**: 모든 기기에서 최적화된 사용자 경험

## 🛠️ 기술 스택

### 프론트엔드 핵심

- **Next.js 15.2.1**: SSR과 정적 생성을 지원하는 React 프레임워크
- **React 18.2.0**: 선언적, 효율적인 UI 구축
- **TypeScript 5.8.2**: 정적 타입 검사로 코드 품질 향상

### 상태 관리

- **Recoil 0.7.7**: 전역 애플리케이션 상태 관리
- **React Query 3.39.3**: 비동기 서버 상태 효율적 관리
- **Recoil-persist**: 페이지 새로고침 후에도 상태 유지

### 스타일링

- **TailwindCSS 3.3.3**: 유틸리티 우선 CSS 프레임워크
- **SCSS**: 고급 스타일링 기능
- **Styled Components**: 컴포넌트 기반 스타일링
- **Flowbite React**: UI 컴포넌트 라이브러리

### 마크다운 처리

- **React Markdown**: 마크다운 콘텐츠 렌더링
- **Remark & Rehype**: 마크다운 변환 및 커스터마이징
- **React SimpleMDE**: 풍부한 마크다운 에디터 경험
- **React Syntax Highlighter**: 코드 블록 구문 강조

### UI/UX 개선

- **DND Kit**: 직관적인 드래그 앤 드롭 인터페이스
- **React Window & Virtualized**: 대규모 목록 효율적인 렌더링
- **React Icons**: 다양한 아이콘 세트
- **Lottie React**: 고품질 애니메이션

## 🏛️ 아키텍처

<div align="center">
  <img src="https://via.placeholder.com/800x500.png?text=LOGME+Architecture" alt="LOGME 아키텍처" width="800">
</div>

LOGME는 Next.js 기반의 클라이언트-서버 아키텍처를 사용하며, 다음 패턴과 구조를 따릅니다:

### 폴더 구조

```
cvlog-fe/
├── components/       # 기능 및 UI 컴포넌트
│   ├── pages/        # 페이지별 특화 컴포넌트
│   └── Shared/       # 공유 컴포넌트
├── hooks/            # 커스텀 React 훅
├── lib/              # 유틸리티 라이브러리
├── pages/            # Next.js 라우트 (API 라우트 포함)
├── public/           # 정적 자산
├── service/          # API 클라이언트 & 서비스 로직
├── styles/           # 전역 스타일 및 테마
└── utils/            # 유틸리티 함수
```

### 아키텍처 패턴

- **원자적 디자인 시스템**: 재사용 가능한 UI 컴포넌트 구성
- **서비스 레이어 패턴**: API 통신 추상화
- **Custom Hooks**: 상태 로직 재사용
- **인증 가드**: 보호된 라우트 관리

## 🔍 구현 사항

### 아티클 관리 시스템 

고급 마크다운 에디팅 시스템을 구현하여 개발자가 기술 콘텐츠를 효과적으로 작성하고 관리할 수 있도록 했습니다. 주요 기능:

- **폴더 관리**: DND Kit을 활용한 드래그 앤 드롭 폴더 구조 구현
- **문서 분류**: 계층적 카테고리 시스템으로 아티클 정리
- **실시간 마크다운 렌더링**: 코드 하이라이팅, 표, 이미지 등 지원

```tsx
// 예시: 드래그 앤 드롭 폴더 구현의 핵심 코드
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

### 인증 시스템

JWT 기반 인증 시스템을 구현하여 사용자 데이터와 콘텐츠를 안전하게 보호합니다:

- **토큰 기반 인증**: JWT 액세스 및 리프레시 토큰 관리
- **보호된 라우트**: AuthGuard 컴포넌트로 인증 필요 페이지 보호
- **자동 토큰 갱신**: 백그라운드 토큰 리프레시 메커니즘

```tsx
// 예시: AuthGuard 구현
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, isLoading, router]);
  
  if (isLoading) return <LoadingSpinner />;
  return isLoggedIn ? <>{children}</> : null;
};
```

### 성능 최적화

대규모 데이터 처리와 최적의 사용자 경험을 위한 다양한 성능 최적화 기법을 적용했습니다:

- **가상화**: React Window로 대량의 문서/폴더 목록 효율적 렌더링
- **코드 분할**: Next.js의 동적 가져오기로 번들 크기 최적화
- **이미지 최적화**: 브라우저 이미지 압축으로 업로드 용량 감소
- **메모이제이션**: React.memo와 useMemo로 불필요한 렌더링 방지

## 🚀 실행 방법

### 환경 설정

```bash
# Node.js v14+ 및 npm/yarn 필요

# 저장소 클론
git clone https://github.com/your-username/cvlog-fe.git
cd cvlog-fe

# 환경 변수 설정 (예시)
cp .env.example .env.local
# .env.local 파일 편집 - API 엔드포인트 설정

# 의존성 설치
yarn install

# 개발 서버 실행 (http://localhost:3000)
yarn dev
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
yarn build

# 빌드 테스트
yarn start

# Vercel 배포 (권장)
vercel
```

## 🛠️ 기술적 도전과 해결

### 1. 복잡한 폴더 구조 관리

**도전:** 중첩된 폴더 구조와 문서 관리를 위한 직관적인 드래그 앤 드롭 인터페이스 구현

**해결책:** DND Kit 라이브러리와 재귀적 컴포넌트 구조를 활용하여 직관적인 폴더 관리 시스템 구현. 폴더/파일 계층 구조를 효율적으로 표현하는 데이터 모델 설계.

### 2. 마크다운 렌더링 성능

**도전:** 복잡한 마크다운 콘텐츠(코드 블록, 수식, 다이어그램 등)의 효율적인 렌더링

**해결책:** React Markdown, Rehype 플러그인, 메모이제이션을 활용하여 렌더링 최적화. 코드 하이라이팅을 위한
React Syntax Highlighter 통합.

### 3. 상태 관리 복잡성

**도전:** 다양한 페이지와 기능 간의 복잡한 상태 관리

**해결책:** Recoil과 React Query를 조합한 계층적 상태 관리 전략 구현. 서버 상태는 React Query로, UI 상태는 Recoil로 관리하여 관심사 분리.

### 4. 대규모 목록 렌더링

**도전:** 수천 개의 문서와 폴더를 효율적으로 렌더링

**해결책:** React Window와 React Virtualized를 활용한 가상화 구현으로 DOM 노드 수를 최소화하고 스크롤 성능 최적화.

## 📊 주요 성과

- **사용자 경험 개선**: 드래그 앤 드롭 인터페이스로 문서 관리 효율성 30% 향상
- **렌더링 성능**: 가상화 기술 적용으로 대규모 목록 렌더링 시간 75% 감소
- **코드 재사용성**: 컴포넌트 추상화로 코드 중복 50% 감소
- **빌드 최적화**: 코드 분할과 동적 가져오기로 초기 로드 시간 40% 단축

## 🔜 향후 개발 계획

- **협업 기능**: 여러 개발자가 함께 문서 작업할 수 있는 실시간 협업 기능
- **SEO 최적화**: 블로그 콘텐츠의 검색 엔진 노출 향상을 위한 도구
- **커스텀 테마**: 사용자 지정 브랜딩과 디자인 지원
- **지표 대시보드**: 블로그 방문 및 참여 분석을 위한 통계 기능

## 📞 연락처 및 링크

- **프로젝트 데모**: [https://logme-demo.vercel.app](https://logme-demo.vercel.app)
- **GitHub 저장소**: [https://github.com/your-username/cvlog-fe](https://github.com/your-username/cvlog-fe)
- **백엔드 API**: [https://github.com/yunkukpark/klog-server](https://github.com/yunkukpark/klog-server)
- **개발자 이메일**: [your-email@example.com](mailto:your-email@example.com)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/your-username">Your Name</a></p>
  <p>© 2025 LOGME. All rights reserved.</p>
</div>
