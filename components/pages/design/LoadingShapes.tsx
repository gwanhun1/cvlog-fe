import s from 'styles/logmeDesign.module.scss';

export function IdentitySkeleton() {
  return (
    <div
      className={s.identity}
      role="status"
      aria-label="계정 정보 불러오는 중"
    >
      <span aria-hidden="true" className={`${s.bone} ${s.avatarBone}`} />
      <span aria-hidden="true" className={`${s.bone} ${s.identityBone}`} />
    </div>
  );
}

export function RecordSkeleton({
  kind = 'posts',
}: {
  kind?: 'posts' | 'drafts' | 'utility';
}) {
  return (
    <div
      role="status"
      aria-label={
        kind === 'drafts'
          ? '초안 불러오는 중'
          : kind === 'utility'
            ? '정보 불러오는 중'
            : '최근 글 불러오는 중'
      }
      className={s.loadingRows}
    >
      {kind === 'drafts' ? (
        <div className={s.draftLink} aria-hidden="true">
          <span className={`${s.bone} ${s.boneIcon}`} />
          <div className={s.draftText}>
            <span className={`${s.bone} ${s.boneTitle}`} />
            <span className={`${s.bone} ${s.boneMeta}`} />
          </div>
          <span className={`${s.bone} ${s.boneAction}`} />
        </div>
      ) : kind === 'utility' ? (
        <div className={s.loadingUtility} aria-hidden="true">
          <span className={`${s.bone} ${s.boneTitle}`} />
          <span className={`${s.bone} ${s.boneMeta}`} />
          <span className={`${s.bone} ${s.boneMeta}`} />
        </div>
      ) : (
        <div className={s.postList} aria-hidden="true">
          {[0, 1, 2].map(i => (
            <div key={i} className={s.postRow}>
              <div>
                <span className={`${s.bone} ${s.boneTitle}`} />
                <span className={`${s.bone} ${s.boneMeta}`} />
              </div>
              <span className={`${s.bone} ${s.boneAction}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DemoSkeleton() {
  return (
    <div
      className={s.demoSkeleton}
      role="status"
      aria-label="기능 영상 불러오는 중"
    >
      <div aria-hidden="true">
        <div className={s.demoSkeletonHead}>
          <span className={`${s.bone} ${s.boneMeta}`} />
          <span className={`${s.bone} ${s.boneTitle}`} />
          <span className={`${s.bone} ${s.boneMeta}`} />
        </div>
        <div className={s.demoSkeletonBody}>
          <div className={s.demoSkeletonTabs}>
            {[0, 1, 2, 3].map(i => (
              <span key={i} className={`${s.bone} ${s.demoSkeletonTab}`} />
            ))}
          </div>
          <span className={`${s.bone} ${s.demoSkeletonVideo}`} />
          <div className={s.demoSkeletonCopy}>
            <span className={`${s.bone} ${s.boneTitle}`} />
            <span className={s.bone} />
            <span className={s.bone} />
            <span className={`${s.bone} ${s.boneMeta}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
