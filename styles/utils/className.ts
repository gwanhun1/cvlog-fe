export const cn = (...args: (string | undefined | null | false)[]) => args.filter(Boolean).join(' ');

export const cond = (condition: boolean, className: string) =>
  condition ? className : '';
