export interface NewPostComment {
  post_id: number;
  content: string;
}

export interface CommentUser {
  profile_image: string;
  /** 표시용 핸들. 소셜 유저에게도 항상 존재한다 */
  username: string | null;
  /** GitHub 연동 유저에게만 존재 — 표시/판정에 쓰지 말 것 */
  github_id: string | null;
  id: number;
}

export interface CommentProps {
  id: number;
  content: string;
  created_at: string;
  user: CommentUser | null;
  refetch?: () => void;
}

export interface CommentTypeData {
  data: CommentProps[];
}
