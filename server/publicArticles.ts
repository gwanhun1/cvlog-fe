import axios from 'axios';
import type { BlogType, ListDataType } from 'service/api/tag/type';
import { getServerApiBaseUrl } from 'utils/apiUrl';

export function parsePublicList(payload: any): ListDataType {
  const list = payload?.data;
  if (
    payload?.success === false ||
    !Array.isArray(list?.posts) ||
    !Number.isSafeInteger(list.maxPage) ||
    list.maxPage < 1 ||
    (list.posts.length === 0 && list.maxPage > 1)
  ) {
    throw new Error('Invalid public article list');
  }
  const posts = list.posts.map((post: any): BlogType => {
    if (
      !Number.isSafeInteger(post?.id) ||
      post.id < 1 ||
      post.public_status !== true ||
      typeof post.title !== 'string' ||
      typeof post.content !== 'string'
    ) {
      throw new Error('Invalid public article');
    }
    const user = post.user;
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      public_status: true,
      created_at: String(post.created_at ?? ''),
      updated_at: String(post.updated_at ?? post.created_at ?? ''),
      tags: Array.isArray(post.tags)
        ? post.tags.map((tag: any) => ({
            id: Number(tag.id),
            name: String(tag.name ?? ''),
          }))
        : [],
      ...(user
        ? {
            user: {
              id: Number(user.id),
              username:
                typeof user.username === 'string' ? user.username : null,
              name: typeof user.name === 'string' ? user.name : null,
              profile_image:
                typeof user.profile_image === 'string'
                  ? user.profile_image
                  : null,
            },
          }
        : {}),
    };
  });
  return { posts, maxPage: list.maxPage };
}

export async function getPublicArticlePage(page: number) {
  const response = await axios.get(
    `${getServerApiBaseUrl()}/posts/public/page/${page}`,
    {
      timeout: 8000,
      validateStatus: () => true,
    },
  );
  // The backend returns 400 for a positive page beyond the final page.
  if (page > 1 && (response.status === 400 || response.status === 404))
    return null;
  if (response.status !== 200)
    throw new Error(`Public article API returned ${response.status}`);
  return parsePublicList(response.data);
}
