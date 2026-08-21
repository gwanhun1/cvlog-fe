import { BlogType } from '../tag/type';

// 인기 글의 정렬 기준은 서버가 관리하고, 화면에는 게시물 정보만 노출한다.
export type PopularPost = BlogType;

export interface GetPopularRes {
  success: boolean;
  data: PopularPost[];
}
