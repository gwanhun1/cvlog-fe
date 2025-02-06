# WIP

## klog-client

> klog is a blog for me (not a platform for developersㅋㅋ). It provides compfy markdown editor with syntax highlighter enabled. Currently, this service (maybe) only supports Korean language.

Backend project of service is at another Repo - [klog-backend](https://github.com/yunkukpark/klog-server)

### Project Stack

- React
- React Router
- Next
- TypeScript
- Apollo GraphQL (이거 쓸까 swr or react-query 쓸까 고민중)
- module scss
- Remark
- Codemirror
- Sandpack

# cvlog-fe

## 로그인 유무 검사 페이지 도입

### 1. 설정 페이지 (로그인이 필요한 페이지)

- `/article`
- `/resume`
- `/github`

### 2. 미설정 페이지 (로그인이 필요 없는 페이지)

- `/about`
- `/mypage` → 로그인되지 않으면 `join` 버튼 노출 및 접근 제한

### 3. 도입 방법

#### 1) `authGuard` 활용 (Next.js 환경에서 `router` 미사용)

Next.js에서는 `router`를 직접 사용하지 않으므로, `middleware` 또는 `_app.tsx`에서 로그인 유무를 검사하여 접근을 제한하는 방식이 적절하다.

#### 2) `middleware.ts` 활용

Next.js 12 이상의 버전에서는 `middleware`를 사용해 특정 경로에 대한 접근을 제어할 수 있다.

```ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token'); // 로그인 여부 확인
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

#### 3) `_app.tsx`에서 `useEffect` 활용

클라이언트 사이드에서 로그인 여부를 체크하고, 보호된 페이지에 접근 시 로그인 페이지로 리디렉션할 수 있다.

```ts
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const protectedRoutes = ['/article', '/resume', '/github'];

  useEffect(() => {
    if (
      protectedRoutes.includes(router.pathname) &&
      status !== 'loading' &&
      !session
    ) {
      router.push('/login');
    }
  }, [session, status, router]);

  if (protectedRoutes.includes(router.pathname) && !session) {
    return null; // 로그인 체크 중 빈 화면 처리
  }

  return <>{children}</>;
}

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthGuard>
      <Component {...pageProps} />
    </AuthGuard>
  );
}
```

#### 4) 서버 사이드에서 로그인 검사 (`getServerSideProps` 활용)

```ts
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return { props: {} };
}
```

위 방법들을 활용하면 Next.js 환경에서 로그인 유무에 따른 페이지 접근 제한을 효과적으로 구현할 수 있다.

 추가로 
 URL을 직접 입력해서 보호된 페이지(/article, /resume, /github 등)에 접근하는 경우에도 차단하려면 middleware.ts 방식이 가장 효과적이다.

✅ middleware.ts 방식으로 직접 접근 차단
이점: 서버에서 로그인 여부를 검사하고, 미인증 사용자는 /login으로 강제 리디렉션
적용 효과:
URL 직접 입력으로 접근해도 차단
새로고침(F5)하거나 브라우저를 종료 후 다시 열어도 차단