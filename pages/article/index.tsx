import ArticlePage from 'components/pages/article/ArticlePage';
import { getPublicArticlePage } from 'server/publicArticles';

export const getStaticProps = async () => {
  const initialList = await getPublicArticlePage(1);
  if (!initialList) throw new Error('Missing first article page');
  return { props: { initialList }, revalidate: 60 };
};

export default ArticlePage;
