import { useEffect, useRef, useState } from 'react';
import type { ResumeData, SectionKey } from './types';

interface Props {
  data: ResumeData;
}

const SectionHeader = ({ label }: { label: string }) => (
  <div className="mt-10 mb-4 first:mt-0">
    <h2 className="text-[15px] font-bold text-gray-900 pb-1.5 border-b-2 border-gray-900">
      {label}
    </h2>
  </div>
);

const PAGE_BREAKS_MM = [297, 594, 891];
const MM_TO_PX = 3.7795275591;

const ResumePreview = ({ data }: Props) => {
  const { photo, basicInfo, experience, education, skills, projects, certifications, sectionOrder } = data;
  const containerRef = useRef<HTMLDivElement>(null);
  const [heightPx, setHeightPx] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setHeightPx(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Only show a guide if content actually extends past that page boundary
  const visibleBreaks = PAGE_BREAKS_MM.filter(mm => (mm + 10) * MM_TO_PX < heightPx);

  const renderSection = (key: SectionKey) => {
    switch (key) {
      case 'experience':
        if (!experience.length) return null;
        return (
          <section key="experience">
            <SectionHeader label="경력" />
            {experience.map((exp, i) => (
              <div key={exp.id} className={i > 0 ? 'mt-7' : ''}>
                <div className="mb-1">
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="text-[14px] font-bold text-gray-900">{exp.company}</h3>
                    <span className="text-[11px] text-gray-500 whitespace-nowrap flex-shrink-0">
                      {[exp.role, exp.employmentType].filter(Boolean).join(' | ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {exp.startDate}{exp.startDate ? ' ~ ' : ''}{exp.isCurrent ? '재직 중' : exp.endDate}
                  </p>
                </div>
                {exp.projectName && (
                  <h4 className="text-[13px] font-bold text-gray-800 mt-2 mb-0.5">{exp.projectName}</h4>
                )}
                {exp.projectSubtitle && (
                  <p className="text-[11px] text-gray-500 italic mb-1.5">{exp.projectSubtitle}</p>
                )}
                {exp.description && (
                  <div className="text-[11px] text-gray-700 leading-relaxed whitespace-pre-line mb-2">
                    {exp.description}
                  </div>
                )}
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
              <div key={proj.id} className={i > 0 ? 'mt-7' : ''}>
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="text-[14px] font-bold text-gray-900">{proj.name}</h3>
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
            <div className="space-y-1.5">
              {skills.map(sg => (
                <div key={sg.id} className="flex gap-2 text-[12px]">
                  {sg.category && (
                    <span className="font-semibold text-gray-700 flex-shrink-0 min-w-[72px]">{sg.category}</span>
                  )}
                  {sg.category && <span className="text-gray-300">|</span>}
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
              <div key={edu.id} className={i > 0 ? 'mt-5' : ''}>
                <h3 className="text-[14px] font-bold text-gray-900">{edu.school}</h3>
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
                <h3 className="text-[13px] font-bold text-gray-900">{cert.name}</h3>
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
      ref={containerRef}
      id="resume-preview"
      className="relative bg-white w-full min-h-[297mm] p-10 text-gray-900"
      style={{ fontFamily: "'Pretendard Variable', 'Pretendard', 'Noto Sans KR', sans-serif" }}
    >
      {/* Page break guides — screen only, only shown when content actually overflows */}
      {visibleBreaks.map(mm => (
        <div
          key={mm}
          className="print:hidden absolute left-0 right-0 pointer-events-none"
          style={{ top: `${mm}mm` }}
        >
          <div className="border-t border-dashed border-blue-200" />
          <span
            className="absolute right-0 text-[9px] font-medium text-blue-300 bg-white px-1.5 py-0.5 rounded-bl"
            style={{ marginTop: '-1px' }}
          >
            {mm / 297 + 1}p
          </span>
        </div>
      ))}

      {/* Header */}
      <header className="flex justify-between items-start gap-6 mb-5">
        <div className="flex-1 min-w-0">
          {basicInfo.name && (
            <h1 className="text-[26px] font-extrabold text-gray-900 tracking-tight leading-tight">
              {basicInfo.name}
            </h1>
          )}
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
        {photo && (
          <div className="flex-shrink-0">
            <img src={photo} alt="프로필" className="w-20 h-24 object-cover rounded-lg border border-gray-100" />
          </div>
        )}
      </header>

      {basicInfo.summary && (
        <p className="text-[11px] text-gray-700 leading-relaxed mb-5 border-t border-gray-200 pt-4">
          {basicInfo.summary}
        </p>
      )}

      {basicInfo.about && (
        <section>
          <SectionHeader label="자기소개" />
          <p className="text-[11px] text-gray-700 leading-relaxed whitespace-pre-line">{basicInfo.about}</p>
        </section>
      )}

      {basicInfo.portfolio && (
        <section>
          <SectionHeader label="포트폴리오" />
          <p className="text-[11px] text-gray-500 font-semibold mb-0.5">링크</p>
          <p className="text-[11px] text-gray-700 underline">{basicInfo.portfolio}</p>
        </section>
      )}

      {sectionOrder.map(key => renderSection(key))}
    </div>
  );
};

export default ResumePreview;
