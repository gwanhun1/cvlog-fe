import type { ResumeData, SectionKey } from './types';

interface Props {
  data: ResumeData;
}

const SectionTitle = ({ label }: { label: string }) => (
  <h2 className="text-[10px] font-bold tracking-[0.14em] uppercase text-gray-400 border-b border-gray-200 pb-1 mb-3 mt-6 first:mt-0">
    {label}
  </h2>
);

const ResumePreview = ({ data }: Props) => {
  const { basicInfo, experience, education, skills, projects, sectionOrder } = data;

  const renderSection = (key: SectionKey) => {
    switch (key) {
      case 'experience':
        if (!experience.length) return null;
        return (
          <section key="experience">
            <SectionTitle label="경력" />
            {experience.map(exp => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-[13px] font-bold text-gray-900 leading-tight">{exp.company || '회사명'}</span>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                    {exp.startDate}{exp.startDate ? ' – ' : ''}{exp.isCurrent ? '현재' : exp.endDate}
                  </span>
                </div>
                {exp.position && (
                  <p className="text-[11px] text-ftBlue font-medium mt-0.5">{exp.position}</p>
                )}
                {exp.description && (
                  <p className="text-[11px] text-gray-600 mt-1.5 leading-relaxed whitespace-pre-line">{exp.description}</p>
                )}
              </div>
            ))}
          </section>
        );

      case 'education':
        if (!education.length) return null;
        return (
          <section key="education">
            <SectionTitle label="학력" />
            {education.map(edu => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-[13px] font-bold text-gray-900">{edu.school || '학교명'}</span>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                    {edu.startDate}{edu.startDate ? ' – ' : ''}{edu.endDate}
                  </span>
                </div>
                {(edu.major || edu.degree) && (
                  <p className="text-[11px] text-gray-500 mt-0.5">{[edu.major, edu.degree].filter(Boolean).join(' · ')}</p>
                )}
              </div>
            ))}
          </section>
        );

      case 'skills':
        if (!skills.length) return null;
        return (
          <section key="skills">
            <SectionTitle label="기술" />
            <div className="space-y-1.5">
              {skills.map(sg => (
                <div key={sg.id} className="flex gap-3">
                  {sg.category && (
                    <span className="text-[11px] font-semibold text-gray-700 w-20 flex-shrink-0 pt-px">{sg.category}</span>
                  )}
                  <span className="text-[11px] text-gray-600 leading-relaxed">{sg.items}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!projects.length) return null;
        return (
          <section key="projects">
            <SectionTitle label="프로젝트" />
            {projects.map(proj => (
              <div key={proj.id} className="mb-4">
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <span className="text-[13px] font-bold text-gray-900">{proj.name || '프로젝트명'}</span>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{proj.period}</span>
                </div>
                {proj.techStack && (
                  <p className="text-[10px] text-ftBlue font-medium mt-0.5">{proj.techStack}</p>
                )}
                {proj.description && (
                  <p className="text-[11px] text-gray-600 mt-1.5 leading-relaxed whitespace-pre-line">{proj.description}</p>
                )}
                {(proj.githubUrl || proj.liveUrl) && (
                  <div className="flex gap-4 mt-1">
                    {proj.githubUrl && <span className="text-[10px] text-gray-400 underline">{proj.githubUrl}</span>}
                    {proj.liveUrl && <span className="text-[10px] text-gray-400 underline">{proj.liveUrl}</span>}
                  </div>
                )}
              </div>
            ))}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div
      id="resume-preview"
      className="bg-white w-full min-h-[297mm] p-12 text-gray-900"
      style={{ fontFamily: "'Pretendard Variable', 'Pretendard', 'Noto Sans KR', sans-serif" }}
    >
      {/* Header */}
      <header className="mb-6">
        <div className="flex justify-between items-start gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-[22px] font-extrabold text-gray-900 tracking-tight leading-tight">
              {basicInfo.name || '이름을 입력하세요'}
            </h1>
            {basicInfo.title && (
              <p className="text-[13px] text-gray-500 font-medium mt-1">{basicInfo.title}</p>
            )}
          </div>
          <div className="text-right flex-shrink-0 space-y-0.5">
            {basicInfo.email && <p className="text-[11px] text-gray-500">{basicInfo.email}</p>}
            {basicInfo.phone && <p className="text-[11px] text-gray-500">{basicInfo.phone}</p>}
            {basicInfo.location && <p className="text-[11px] text-gray-500">{basicInfo.location}</p>}
            {basicInfo.github && <p className="text-[11px] text-gray-500">{basicInfo.github}</p>}
            {basicInfo.website && <p className="text-[11px] text-gray-500">{basicInfo.website}</p>}
          </div>
        </div>
        {basicInfo.summary && (
          <p className="mt-4 text-[11px] text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
            {basicInfo.summary}
          </p>
        )}
      </header>

      {/* Ordered sections */}
      {sectionOrder.map(key => renderSection(key))}
    </div>
  );
};

export default ResumePreview;
