import { useRouter } from 'next/router';
import SharedResumePage from 'components/pages/resume/SharedResumePage';
export default function SharedResumeRoute() { const { query } = useRouter(); return <SharedResumePage token={typeof query.token === 'string' ? query.token : ''} />; }
