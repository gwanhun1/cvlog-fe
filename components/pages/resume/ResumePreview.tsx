import type { ResumeData, SectionKey } from './types';

interface Props {
  data: ResumeData;
}

const SectionHeader = ({ label }: { label: string }) => (
  <div className="mt-7 mb-3 first:mt-0">
    <h2 className="text-[15px] font-bold text-gray-900 pb-1.5 border-b-2 border-gray-900">
      {label}
    </h2>
  </div>
);

const ResumePreview = ({ data }: Props) => {
  const { photo, basicInfo, experience, education, skills, projects, certifications, sectionOrder } = data;

  const renderSection = (key: SectionKey) => {
    switch (key) {
      case 'experience':
        if (!experience.length) return null;
        return (
          <section key="experience">
            <SectionHeader label="경력" />
            {experience.map((exp, i) => (
              <div key={exp.id} className={i > 0 ? 'mt-6' : ''}>
                {/* Company header */}
                <div className="mb-1">
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="text-[14px] font-bold text-gray-900">{exp.company || '회사명'}</h3>
                    <span className="text-[11px] text-gray-500 whitespace-nowrap flex-shrink-0">
                      {[exp.role, exp.employmentType].filter(Boolean).join(' | ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {exp.startDate}{exp.startDate ? ' ~ ' : ''}{exp.isCurrent ? '재직 중' : exp.endDate}
                    {(exp.startDate && (exp.isCurrent || exp.endDate)) ? '' : ''}
                  </p>
                </div>
                {/* Project name */}
                {exp.projectName && (
                  <h4 className="text-[13px] font-bold text-gray-800 mt-2 mb-0.5">{exp.projectName}</h4>
                )}
                {exp.projectSubtitle && (
                  <p className="text-[11px] text-gray-500 italic mb-1.5">{exp.projectSubtitle}</p>
                )}
                {/* Bullets */}
                {exp.description && (
                  <div className="text-[11px] text-gray-700 leading-relaxed whitespace-pre-line mb-2">
                    {exp.description}
                  </div>
                )}
                {/* Tech stack */}
                {exp.techStack && (
                  <p className="text-[11px] text-gray-500">
                    <span className="font-semibold">사용 언어 및 툴</span>: {exp.techStack}
                  </p>
                )}
              </div>
            ))}
          </section>
        );

      case 'projects':
        if (!projects.length) return null;
        return (
          <section key="projects">
            <SectionHeader label="프로젝트" />
            {projects.map((proj, i) => (
              <div key={proj.id} className={i > 0 ? 'mt-6' : ''}>
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="text-[14px] font-bold text-gray-900">{proj.name || '프로젝트명'}</h3>
                  <span className="text-[11px] text-gray-400 whitespace-nowrap">{proj.category}</span>
                </div>
                <p className="text-[11px] text-gray-400 mb-1">{proj.period}</p>
                {proj.subtitle && (
                  <h4 className="text-[12px] font-semibold text-gray-700 mb-1">{proj.subtitle}</h4>
                )}
                {proj.description && (
                  <div className="text-[11px] text-gray-700 leading-relaxed whitespace-pre-line mb-2">
                    {proj.description}
                  </div>
                )}
                {proj.techStack && (
                  <p className="text-[11px] text-gray-500">
                    <span className="font-semibold">사용 언어 및 툴</span>: {proj.techStack}
                  </p>
                )}
                {(proj.githubUrl || proj.liveUrl) && (
                  <div className="flex gap-4 mt-1">
                    {proj.liveUrl && <span className="text-[10px] text-gray-400">{proj.liveUrl}</span>}
                    {proj.githubUrl && <span className="text-[10px] text-gray-400">{proj.githubUrl}</span>}
                  </div>
                )}
              </div>
            ))}
          </section>
        );

      case 'skills':
        if (!skills.length) return null;
        return (
          <section key="skills">
            <SectionHeader label="기술 스택" />
            <div className="space-y-1">
              {skills.map(sg => (
                <div key={sg.id} className="flex gap-2 text-[12px]">
                  {sg.category && (
                    <span className="font-semibold text-gray-700 flex-shrink-0">{sg.category}</span>
                  )}
                  {sg.category && <span className="text-gray-400">|</span>}
                  <span className="text-gray-600">{sg.items}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (!education.length) return null;
        return (
          <section key="education">
            <SectionHeader label="교육" />
            {education.map((edu, i) => (
              <div key={edu.id} className={i > 0 ? 'mt-4' : ''}>
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="text-[14px] font-bold text-gray-900">{edu.school || '학교명'}</h3>
                </div>
                <p className="text-[11px] text-gray-500">
                  {[edu.degree ? `졸업 | ${edu.degree}` : '', edu.major].filter(Boolean).join(' | ')}
                </p>
                <p className="text-[11px] text-gray-400">
                  {edu.startDate}{edu.startDate ? ' ~ ' : ''}{edu.endDate}
                </p>
              </div>
            ))}
          </section>
        );

      case 'certifications':
        if (!certifications.length) return null;
        return (
          <section key="certifications">
            <SectionHeader label="자격증" />
            {certifications.map((cert, i) => (
              <div key={cert.id} className={i > 0 ? 'mt-3' : ''}>
                <h3 className="text-[13px] font-bold text-gray-900">{cert.name || '자격증명'}</h3>
                <p className="text-[11px] text-gray-500">
                  {[cert.grade, cert.issuer].filter(Boolean).join(' | ')}
                </p>
                {cert.date && <p className="text-[11px] text-gray-400">{cert.date}</p>}
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
      className="bg-white w-full min-h-[297mm] p-10 text-gray-900"
      style={{ fontFamily: "'Pretendard Variable', 'Pretendard', 'Noto Sans KR', sans-serif" }}
    >
      {/* Header */}
      <header className="flex justify-between items-start gap-6 mb-5">
        <div className="flex-1 min-w-0">
          <h1 className="text-[26px] font-extrabold text-gray-900 tracking-tight leading-tight">
            {basicInfo.name || '이름'}
          </h1>
          {basicInfo.title && (
            <p className="text-[13px] text-gray-500 font-medium mt-0.5">{basicInfo.title}</p>
          )}
          <div className="mt-2 space-y-0.5">
            {basicInfo.phone && <p className="text-[11px] text-gray-500">{basicInfo.phone}</p>}
            {basicInfo.email && <p className="text-[11px] text-gray-500">{basicInfo.email}</p>}
            {basicInfo.location && <p className="text-[11px] text-gray-500">{basicInfo.location}</p>}
            {basicInfo.github && <p className="text-[11px] text-gray-500">{basicInfo.github}</p>}
            {basicInfo.website && <p className="text-[11px] text-gray-500">{basicInfo.website}</p>}
          </div>
        </div>
        {/* Photo */}
        {photo && (
          <div className="flex-shrink-0">
            <img
              src={photo}
              alt="프로필"
              className="w-20 h-24 object-cover rounded-lg border border-gray-100"
            />
          </div>
        )}
      </header>

      {/* Summary */}
      {basicInfo.summary && (
        <p className="text-[11px] text-gray-700 leading-relaxed mb-5 border-t border-gray-200 pt-4">
          {basicInfo.summary}
        </p>
      )}

      {/* About */}
      {basicInfo.about && (
        <section>
          <SectionHeader label="자기소개" />
          <p className="text-[11px] text-gray-700 leading-relaxed whitespace-pre-line">{basicInfo.about}</p>
        </section>
      )}

      {/* Portfolio */}
      {basicInfo.portfolio && (
        <section>
          <SectionHeader label="포트폴리오" />
          <p className="text-[11px] text-gray-500 font-semibold mb-0.5">링크</p>
          <p className="text-[11px] text-gray-700 underline">{basicInfo.portfolio}</p>
        </section>
      )}

      {/* Ordered sections */}
      {sectionOrder.map(key => renderSection(key))}
    </div>
  );
};

export default ResumePreview;
