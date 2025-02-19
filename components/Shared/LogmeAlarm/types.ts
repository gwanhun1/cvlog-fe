export interface Post {
  id: number;
  title: string;
}

export interface User {
  id: number;
  name: string;
  avatar?: string;
}

export interface Notification {
  id: number;
  type: 'comment' | 'like';
  message: string;
  read: boolean;
  created_at: string;
  user: User;
  post: Post;
}
