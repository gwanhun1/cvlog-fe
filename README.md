# LOGME - 프론트엔드

![Next.js](https://img.shields.io/badge/Next.js-15.2.1-black)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue)
![React Query](https://img.shields.io/badge/React%20Query-3.39.3-ff4154)
![Recoil](https://img.shields.io/badge/Recoil-0.7.7-3578e5)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.3-38bdf8)

마크다운 지원, GitHub 통합 및 이력서 빌더를 갖춘 현대적인 개발자 블로그 플랫폼입니다.

## 📋 목차

- [개요](#개요)
- [기능](#기능)
- [프로젝트 구조](#프로젝트-구조)
- [기술 스택](#기술-스택)
- [인증](#인증)
- [시작하기](#시작하기)
- [관련 프로젝트](#관련-프로젝트)

## 🌟 개요

LOGME는 개발자가 자신의 작업을 선보이고, 기술 아티클을 작성하며, 온라인 존재감을 구축할 수 있는 종합 플랫폼입니다. 이 플랫폼은 GitHub와 통합되어 있으며 전문적인 이력서를 생성하고 관리하기 위한 도구를 제공합니다.

## ✨ 기능

- **아티클 관리**: 마크다운 지원으로 기술 아티클 생성, 편집 및 게시
- **GitHub 통합**: GitHub 저장소 연결 및 전시
- **이력서 빌더**: 전문적인 이력서 생성 및 관리
- **마크다운 에디터**: 풍부한 마크다운 편집 경험
- **반응형 디자인**: 데스크톱 및 모바일 기기에서 작동
- **인증**: 안전한 사용자 인증 및 보호된 라우트

## 🏗️ 프로젝트 구조

```
cvlog-fe/
├── components/       # 재사용 가능한 UI 컴포넌트
├── hooks/            # 커스텀 React 훅
├── lib/              # 유틸리티 라이브러리
├── pages/            # Next.js 페이지 및 라우트
├── public/           # 정적 자산
├── service/          # API 서비스
├── styles/           # 전역 스타일 및 CSS 모듈
└── utils/            # 헬퍼 함수
```

## 🛠️ 기술 스택

- **프레임워크**: [Next.js](https://nextjs.org/)
- **UI 라이브러리**: [React](https://reactjs.org/)
- **언어**: [TypeScript](https://www.typescriptlang.org/)
- **상태 관리**:
  - [Recoil](https://recoiljs.org/) - 전역 상태 관리
  - [React Query](https://react-query.tanstack.com/) - 서버 상태 관리
- **스타일링**:
  - [TailwindCSS](https://tailwindcss.com/)
  - [SCSS 모듈](https://sass-lang.com/)
  - [Styled Components](https://styled-components.com/)
- **마크다운**:
  - [React Markdown](https://github.com/remarkjs/react-markdown)
  - [Remark](https://github.com/remarkjs/remark)
  - [SimpleMDE 에디터](https://github.com/RIP21/react-simplemde-editor)
- **UI 컴포넌트**:
  - [Flowbite React](https://flowbite-react.com/)
  - [React Icons](https://react-icons.github.io/react-icons/)
- **드래그 앤 드롭**: [DND Kit](https://dndkit.com/)
- **가상화**: [React Window](https://github.com/bvaughn/react-window)

## 🔐 인증

애플리케이션은 특정 라우트와 기능을 보호하기 위해 인증을 구현합니다. 인증이 처리되는 방식은 다음과 같습니다:

### 보호된 라우트

- **로그인 필요**:

  - `/article` - 아티클 관리
  - `/resume` - 이력서 빌더
  - `/github` - GitHub 통합

- **공개 라우트**:
  - `/about` - 소개 페이지
  - `/mypage` - 사용자 프로필 (로그인하지 않은 경우 `join` 버튼 표시)
  - `/login` - 로그인 페이지
  - `/join` - 회원가입 페이지

### 인증 구현

프로젝트는 JWT를 사용한 토큰 기반 인증 시스템을 사용합니다:

- 액세스 토큰은 LocalStorage에 저장 (`LogmeToken`)
- 리프레시 토큰은 쿠키에 저장 (`refreshToken`)
- 자동 토큰 갱신 메커니즘
- 인증되지 않은 접근에 대한 보호된 라우트 리디렉션

#### 권장 구현

가장 효과적인 라우트 보호를 위해 `middleware.ts` 접근 방식을 구현하는 것이 좋습니다:

```ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token'); // 로그인 상태 확인
  const protectedRoutes = ['/article', '/resume', '/github'];

  if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/article', '/resume', '/github', '/mypage'],
};
```

이 접근 방식은 다음과 같은 이점을 제공합니다:

- 서버 측 인증 검사
- 직접 URL 접근에 대한 보호
- 페이지 새로고침 및 브라우저 재시작 시에도 일관된 보호

## 🚀 시작하기

### 사전 요구 사항

- Node.js (v14 이상)
- npm 또는 yarn

### 설치

```bash
# 저장소 복제
git clone https://github.com/your-username/cvlog-fe.git
cd cvlog-fe

# 의존성 설치
npm install
# 또는
yarn install

# 개발 서버 시작
npm run dev
# 또는
yarn dev
```

애플리케이션은 `http://localhost:3000`에서 사용할 수 있습니다.

### 프로덕션 빌드

```bash
npm run build
npm start
# 또는
yarn build
yarn start
```

## 🔗 관련 프로젝트

- 백엔드 API: [klog-backend](https://github.com/yunkukpark/klog-server)
