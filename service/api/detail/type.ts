export interface DeleteDetail {
  success: boolean;
  data: {
    generatedMaps: [];
    raw: [];
    affected: number;
  };
}

export interface PatchDetailType {
  success: boolean;
  data: {
    generatedMaps: [];
    raw: [];
    affected: number;
  };
}

export interface Content {
  success: boolean;
  data: {
    post: ContentData;
    prevPostInfo: {
      id: number;
      title: string;
    } | null;
    nextPostInfo: {
      id: number;
      title: string;
    } | null;
  };
}

export interface UserIdType {
  id: number;
  github_id: string;
  name: string;
  profile_image: string;
  description: string | null;
  refresh_token: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ContentData {
  id: number;
  title: string;
  content: string;
  user_id: UserIdType;
  public_status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  tags: TagType[];
}

export interface TagType {
  id: number;
  name: string;
}

export interface ContentParams {
  content_id: number;
}

export interface CreateNewPostReq {
  title: string;
  content: string;
  user_id: number;
  category_id?: number;
  tags: string[];
  files: string[];
}
