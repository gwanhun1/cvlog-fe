import axiosInstance from 'utils/axios';

export interface SavedResume {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface SavedResumeDetail extends SavedResume {
  data: string;
}

export const getMyResumes = async (): Promise<SavedResume[]> => {
  const res = await axiosInstance.get('/resumes');
  return res.data.data;
};

export const getResume = async (id: number): Promise<SavedResumeDetail> => {
  const res = await axiosInstance.get(`/resumes/${id}`);
  return res.data.data;
};

export const createResume = async (title: string, data: string): Promise<SavedResumeDetail> => {
  const res = await axiosInstance.post('/resumes', { title, data });
  return res.data.data;
};

export const updateResume = async (id: number, title: string, data: string): Promise<SavedResumeDetail> => {
  const res = await axiosInstance.put(`/resumes/${id}`, { title, data });
  return res.data.data;
};

export const deleteResume = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/resumes/${id}`);
};
