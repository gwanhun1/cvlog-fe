import { UserIdType } from '../detail/type';

export interface Tag {
  id: number;
  name: string;
  postsCount: number;
}

export interface Folder {
  id: number;
  name: string;
  tags: Tag[];
}

export interface GetTagsFolderRes {
  success: boolean;
  data: Folder[];
}

export interface CreateTagsFolderReq {
  name: string;
}

export interface CreateTagsFolderRes {
  success: boolean;
  data: {
    name: string;
    user: {
      github_id: string;
      name: string;
      refresh_token: string;
      description: string;
      profile_image: string;
      created_at: string;
      updated_at: string;
      deleted_at: string;
    };
    id: number;
  };
}

export interface RemoveTagsFolderRes {
  success: boolean;
  data: {
    raw: [];
    affected: number;
  };
}

export interface PutTagsFolderRes {
  success: boolean;
  data: {
    generatedMaps: [];
    raw: [];
    affected: number;
  };
}

export interface UpdateForm {
  tag_id: number;
  folder_id: number;
}

export interface GetNewToken {
  headers: {
    refreshToken: string;
    Authorization: string;
  };
}

export interface DeleteDetail {
  success: boolean;
  data: {
    generatedMaps: [];
    raw: [];
    affected: number;
  };
}

export interface PatchDetail {
  success: boolean;
  data: {
    generatedMaps: [];
    raw: [];
    affected: number;
  };
}

export interface TagType {
  id: number;
  name: string;
}

export interface BlogType {
  id: number;
  title: string;
  content: string;
  user: UserIdType;
  public_status: boolean;
  created_at: string;
  updated_at: string;
  image: string;
  index: number;
  tags: TagType[];
}

export interface ListDataType {
  posts: BlogType[];
  maxPage: number;
}

export interface GetListType {
  success: boolean;
  data: ListDataType;
}
