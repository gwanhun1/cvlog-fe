import { ReactNode } from 'react';

export interface NewPostComment {
  post_id: number;
  content: string;
}

export interface User_id {
  profile_image: string;
  github_id: string;
  id: number;
}

export interface CommentType {
  map(
    arg0: (
      comment: React.JSX.IntrinsicAttributes & CommentProps
    ) => import('react').JSX.Element
  ): ReactNode;
  length: ReactNode;
  success: boolean;
  data: CommentProps[];
}

export interface CommentProps {
  id: number;
  content: string;
  created_at: string;
  user_id: User_id;
}

export interface CommentTypeData {
  data: CommentType[];
}
