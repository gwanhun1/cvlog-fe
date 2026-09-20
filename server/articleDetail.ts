import axios from 'axios';
import type { GetStaticProps } from 'next';
import { getServerApiBaseUrl } from 'utils/apiUrl';

export const getArticleStaticProps: GetStaticProps = async context => {
  const pid = context.params?.pid;
  if (
    typeof pid !== 'string' ||
    !/^[1-9]\d*$/.test(pid) ||
    !Number.isSafeInteger(Number(pid))
  ) {
    return { notFound: true };
  }
  const response = await axios.get(`${getServerApiBaseUrl()}/posts/${pid}`, {
    timeout: 8000,
    validateStatus: () => true,
  });
  if (response.status === 404) return { notFound: true, revalidate: 60 };
  // Private posts still let the owner retry in the browser with their token.
  if (response.status === 403)
    return { props: { pid, initialData: null }, revalidate: 60 };
  if (response.status !== 200)
    throw new Error(`Article API returned ${response.status}`);
  const data = response.data?.data;
  if (
    response.data?.success === false ||
    data?.post?.id !== Number(pid) ||
    typeof data.post.title !== 'string' ||
    typeof data.post.content !== 'string' ||
    typeof data.post.public_status !== 'boolean'
  ) {
    throw new Error('Invalid article response');
  }
  if (!data.post.public_status)
    return { props: { pid, initialData: null }, revalidate: 60 };
  // Network errors / 5xx / malformed responses must propagate: ISR keeps its
  // last good HTML rather than caching an empty 200 response during an outage.
  return { props: { pid, initialData: data }, revalidate: 60 };
};
