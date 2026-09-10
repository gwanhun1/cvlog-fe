import { useRouter } from 'next/router';
import PublicProfilePage from 'components/pages/profile/PublicProfilePage';
export default function ProfileRoute() {
  const router = useRouter();
  return <PublicProfilePage username={typeof router.query.username === 'string' ? router.query.username : ''} page={Math.max(1, Number(router.query.page) || 1)} />;
}
