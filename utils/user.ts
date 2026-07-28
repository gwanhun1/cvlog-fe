import type { UserCapabilities } from 'service/api/login/type';

/**
 * 유저 표시/판정 헬퍼.
 *
 * 이 프로젝트는 원래 github_id 하나를 ①로그인 여부 ②표시명 ③GitHub 기능 가능 여부로
 * 겸용했다. 소셜 로그인이 붙으면서 셋이 분리됐고, 화면 코드는 반드시 아래 함수를 통해야 한다.
 * (github_id를 직접 읽으면 소셜 유저에서 조용히 오작동한다)
 */

/**
 * 화면마다 유저 객체의 모양이 조금씩 다르다(전체 UserInfoType, 글 작성자 요약, 댓글 작성자…).
 * 표시·판정에 필요한 필드만 느슨하게 받는다.
 */
type MaybeUser =
  | {
      id?: number | null;
      username?: string | null;
      github_id?: string | null;
      name?: string | null;
      capabilities?: UserCapabilities | null;
    }
  | null
  | undefined;

/** 로그인 여부는 오직 id로 판단한다 */
export const isLoggedIn = (user: MaybeUser): boolean =>
  !!user && typeof user.id === 'number' && user.id > 0;

/** 같은 사람인지 비교. null == null 로 서로 남남인 유저가 일치 판정되는 것을 막는다 */
export const isSameUser = (
  a: { id?: number | null } | null | undefined,
  b: { id?: number | null } | null | undefined
): boolean =>
  typeof a?.id === 'number' && typeof b?.id === 'number' && a.id === b.id;

/**
 * 화면에 보여줄 핸들.
 *
 * username이 비어 있는 경우가 두 가지 있다.
 *  1. 배포 직후 localStorage(zustand persist)에 남아 있는 구버전 캐시
 *  2. 마이그레이션 이전에 만들어진 응답
 * 둘 다 github_id로 폴백하면 기존 유저의 표시가 그대로 유지된다.
 */
export const getDisplayName = (
  user: MaybeUser,
  fallback = '사용자'
): string => user?.username || user?.github_id || user?.name || fallback;

/**
 * GitHub 전용 기능 노출 여부.
 * 서버가 capabilities를 주면 그걸 쓰고, 구버전 캐시면 github_id 유무로 폴백한다.
 */
export const hasCapability = (
  user: MaybeUser,
  key: keyof UserCapabilities
): boolean => user?.capabilities?.[key] ?? !!user?.github_id;
