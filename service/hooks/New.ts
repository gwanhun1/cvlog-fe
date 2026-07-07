import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCreateNewPost } from 'service/api/detail';
import { CreateNewPostReq } from 'service/api/detail/type';
import { trackEvent } from 'utils/analytics';

export const useCreatePost = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: CreateNewPostReq) => fetchCreateNewPost(params),
    onSuccess: async (_data, variables) => {
      // GA4 이벤트: 글 작성 완료. "발행 전환"은 GA4 관리 콘솔에서
      // post_create(public_status=true) + post_visibility_change(to_public=true)
      // 파생 이벤트로 정의한다 (클라이언트는 사실만 전송).
      trackEvent('post_create', {
        public_status: variables?.public_status ?? false,
        tag_count: variables?.tags?.length ?? 0,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['list'] }),
        queryClient.invalidateQueries({ queryKey: ['publicList'] }),
        queryClient.invalidateQueries({ queryKey: ['tagsFolder'] }),
      ]);
      await router.push('/article');
    },
  });
};
