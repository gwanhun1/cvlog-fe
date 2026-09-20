import type { GetStaticPaths, GetStaticProps } from 'next';
import ArticlePage from 'components/pages/article/ArticlePage';
import { getPublicArticlePage } from 'server/publicArticles';
import { parseArticlePage } from 'utils/articlePagination';

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const page = parseArticlePage(params?.page);
  if (page === null) return { notFound: true };
  if (page === 1)
    return { redirect: { destination: '/article', permanent: true } };
  const initialList = await getPublicArticlePage(page);
  if (!initialList) return { notFound: true, revalidate: 60 };
  return { props: { initialList, initialPage: page }, revalidate: 60 };
};

export default ArticlePage;
