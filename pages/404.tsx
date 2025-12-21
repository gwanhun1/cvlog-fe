import { ErrorScreen } from 'components/Shared/common/ErrorPage';

const NotFoundPage = () => (
  <ErrorScreen
    title="페이지를 찾을 수 없어요"
    description="요청하신 주소가 변경되었거나 존재하지 않습니다. 아래 옵션으로 바로 이동해 주세요."
    primaryCard={{
      title: '홈으로 이동',
      description: 'CVL 홈에서 다시 탐색을 시작하세요.',
      buttonLabel: '홈으로 가기',
      onClick: () => window.location.assign('/'),
    }}
    secondaryCard={{
      title: '최근 글 보기',
      description: '방금 발행된 글 목록으로 이동합니다.',
      buttonLabel: '글 목록 가기',
      onClick: () => window.location.assign('/posts'),
      variant: 'ghost',
    }}
  />
);

export default NotFoundPage;
