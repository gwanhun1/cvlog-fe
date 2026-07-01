export interface SeriesPost {
  id: number;
  title: string;
  series: string;
  series_order: number | null;
  created_at: string;
}

export interface GetSeriesRes {
  success: boolean;
  data: SeriesPost[];
}
