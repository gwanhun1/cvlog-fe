export interface PublicProfile {
  user: { id: number; username: string; name: string | null; description: string | null; github_id: string | null; profile_image: string | null };
  posts: { id: number; title: string; created_at: string; series: string | null }[];
  total: number; page: number; pages: number;
  resumes: { title: string; token: string }[];
}
