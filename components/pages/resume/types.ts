export type SectionKey = 'experience' | 'education' | 'skills' | 'projects' | 'certifications';

export interface BasicInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  website: string;
  summary: string;
  about: string;
  portfolio: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  projectName: string;
  projectSubtitle: string;
  description: string;
  techStack: string;
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
  category: string;
  period: string;
  subtitle: string;
  description: string;
  techStack: string;
  githubUrl: string;
  liveUrl: string;
}

export interface CertItem {
  id: string;
  name: string;
  grade: string;
  issuer: string;
  date: string;
}

export interface ResumeData {
  photo: string;
  basicInfo: BasicInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillGroup[];
  projects: ProjectItem[];
  certifications: CertItem[];
  sectionOrder: SectionKey[];
}

export const DEFAULT_RESUME: ResumeData = {
  photo: '',
  basicInfo: {
    name: '', title: '', email: '', phone: '', location: '',
    github: '', website: '', summary: '', about: '', portfolio: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  sectionOrder: ['experience', 'projects', 'skills', 'education', 'certifications'],
};

export const SECTION_LABELS: Record<SectionKey, string> = {
  experience: '경력',
  education: '교육',
  skills: '기술 스택',
  projects: '프로젝트',
  certifications: '자격증',
};
