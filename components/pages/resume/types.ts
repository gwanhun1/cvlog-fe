export type SectionKey = 'experience' | 'education' | 'skills' | 'projects';

export interface BasicInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  website: string;
  summary: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  techStack: string;
  githubUrl: string;
  liveUrl: string;
  period: string;
}

export interface ResumeData {
  basicInfo: BasicInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillGroup[];
  projects: ProjectItem[];
  sectionOrder: SectionKey[];
}

export const DEFAULT_RESUME: ResumeData = {
  basicInfo: { name: '', title: '', email: '', phone: '', location: '', github: '', website: '', summary: '' },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  sectionOrder: ['experience', 'projects', 'skills', 'education'],
};

export const SECTION_LABELS: Record<SectionKey, string> = {
  experience: '경력',
  education: '학력',
  skills: '기술 스택',
  projects: '프로젝트',
};
