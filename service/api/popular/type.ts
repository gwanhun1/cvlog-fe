import { BlogType } from '../tag/type';

// 인기 글 = 공개 글 목록 항목 + 조회수
export type PopularPost = BlogType & { view_count: number };

export interface GetPopularRes {
  success: boolean;
  data: PopularPost[];
}
