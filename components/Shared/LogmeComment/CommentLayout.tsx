import React, { PropsWithChildren } from 'react';
import { cn } from 'styles/utils';

const CommentLayout = ({ children }: PropsWithChildren) => (
  <div
    className={cn(
      'container',
      'mx-auto',
      'pl-3',
      'mobile:pl-12',
      'mt-1',
      'tablet:mt-2'
    )}
  >
    {children}
  </div>
);

export default CommentLayout;
