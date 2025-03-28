export interface NewPostComment {
  post_id: number;
  content: string;
}

export interface User_id {
  profile_image: string;
  github_id: string;
  id: number;
}

export interface CommentProps {
  id: number;
  content: string;
  created_at: string;
  user_id: User_id;
  refetch?: () => void;
}

export interface CommentTypeData {
  data: CommentProps[];
}
