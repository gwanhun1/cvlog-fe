export const formatTimeAgo = (date: string): string => {
  try {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    switch (true) {
      case diff < minute:
        return `${diff}초 전`;
      case diff < hour:
        return `${Math.floor(diff / minute)}분 전`;
      case diff < day:
        return `${Math.floor(diff / hour)}시간 전`;
      case diff < week:
        return `${Math.floor(diff / day)}일 전`;
      case diff < month:
        return `${Math.floor(diff / week)}주 전`;
      case diff < year:
        return `${Math.floor(diff / month)}개월 전`;
      default:
        return `${Math.floor(diff / year)}년 전`;
    }
  } catch {
    return '';
  }
};
