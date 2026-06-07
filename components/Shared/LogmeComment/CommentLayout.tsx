import React, { PropsWithChildren } from 'react';
import { cn } from 'styles/utils';

const CommentLayout = ({ children }: PropsWithChildren) => (
  <div className={cn('w-full')}>
    {children}
  </div>
);

export default CommentLayout;
