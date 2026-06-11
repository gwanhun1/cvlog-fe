import { UserIdType } from '../detail/type';

export interface ToggleLikeResponse {
  liked: boolean;
  like_count: number;
}

export interface LikePostSummary {
  id: number;
  title: string;
  content: string;
  user: UserIdType;
  created_at: string;
  like_count: number;
}

export interface GetLikedPostsResponse {
  posts: LikePostSummary[];
  maxPage: number;
}
