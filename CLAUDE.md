# cvlog-fe

Next.js 13 (Pages Router) 프론트엔드. 마크다운 블로그 + 이력서 에디터 + GitHub 연동.

## 기술 스택

- Next.js 13 (Pages Router, not App Router)
- TypeScript, Tailwind CSS, SCSS modules
- TanStack Query v5 (서버 상태)
- Zustand v5 (클라이언트 상태)
- Framer Motion (애니메이션)
- next-auth (세션 관리 보조)
- port: 5173 (dev)

## 4계층 파일 구조 패턴

새 기능을 추가할 때 **반드시 이 4계층**을 따른다:

```
pages/{domain}/index.tsx                    # 라우팅 진입점 (최소한의 로직)
components/pages/{domain}/{Component}.tsx   # UI 컴포넌트
hooks/use{Domain}.ts                        # 비즈니스 로직 + TanStack Query
service/api/{domain}/index.ts               # API 호출 함수
service/api/{domain}/type.ts                # 요청/응답 타입
```

기존 예시: `article/`, `mypage/`, `github/`, `resume/`

## API 호출 규칙

`utils/axios.ts`의 `axiosInstance`만 사용한다. 직접 `axios` import 금지.

```typescript
import { axiosInstance as axios } from 'utils/axios';

export const getPosts = async (page: number) => {
  const { data } = await axios.get<ResponseType>(`/posts/page/${page}`);
  return data.data;  // SuccessInterceptor가 data.data에 실제 값 있음
};
```

응답 타입: `{ success: boolean; data: T }` — 항상 `.data.data`로 꺼낸다.

## TanStack Query 패턴

```typescript
// hooks/useArticle.ts
export const useArticle = (id: number) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => getDetail(id),
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetchCreateNewPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
};
```

## 인증 처리

- Access token: `LocalStorage`의 `'LogmeToken'` 키
- Refresh token: `Cookie`의 `'refreshToken'` 키
- axiosInstance가 요청마다 토큰 자동 주입
- 401 응답 시 자동 토큰 갱신 → 실패 시 `/login` 리다이렉트

인증 필요 페이지: `components/Shared/common/AuthGuard.tsx` 래핑

## 컴포넌트 규칙

- 공통 컴포넌트: `components/Shared/common/` 또는 `components/Shared/Logme{Name}/`
- 페이지 전용 컴포넌트: `components/pages/{domain}/`
- 아이콘: `react-icons` 사용
- 버튼: `LogmeButton` 공통 컴포넌트 사용

## 스타일링

- 기본: Tailwind CSS
- 복잡한 애니메이션/레이아웃: SCSS module (`.module.scss`)
- 전역 스타일: `styles/` 디렉토리

## 스크립트

```bash
yarn dev      # 개발 서버 (port 5173)
yarn build    # 프로덕션 빌드
yarn lint     # ESLint
yarn format   # Prettier
```
