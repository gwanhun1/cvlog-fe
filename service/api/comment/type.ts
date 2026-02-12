export interface NewPostComment {
  post_id: number;
  content: string;
}

export interface CommentUser {
  profile_image: string;
  github_id: string;
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
