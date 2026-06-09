import { useCallback, useEffect, useRef, useState } from 'react';
import type { ResumeData, SectionKey } from './types';

interface Props {
  data: ResumeData;
}

const PAGE_HEIGHT_PX = 297 * 3.7795275591;
const PAGE_BREAKS_MM = [297, 594, 891];
const MM_TO_PX = 3.7795275591;

// SectionHeader is rendered INSIDE each section's first data-entry div
// so header and first item always move together as one unit
const SectionHeader = ({ label }: { label: string }) => (
  <div className="mt-10 mb-4" data-section-header>
    <h2 className="text-[15px] font-bold text-gray-900 pb-1.5 border-b-2 border-gray-900">
      {label}
    </h2>
  </div>
);

const ResumePreview = ({ data }: Props) => {
  const { photo, basicInfo, experience, education, skills, projects, certifications, sectionOrder } = data;
  const containerRef = useRef<HTMLDivElement>(null);
  const [heightPx, setHeightPx] = useState(0);

  const adjustPageBreaks = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const entries = Array.from(container.querySelectorAll<HTMLElement>('[data-entry]'));

    // Reset all inline margins and capture natural CSS margins
    entries.forEach(el => { el.style.marginTop = ''; });
    entries.forEach(el => {
      const natural = parseFloat(window.getComputedStyle(el).marginTop) || 0;
      el.dataset.naturalMarginPx = String(natural);
      el.dataset.pushPx = '0';
    });

    // Iteratively push entries that cross page boundaries to the next page
    for (let pass = 0; pass < 20; pass++) {
      let changed = false;
      const cRect = container.getBoundingClientRect();

      entries.forEach(el => {
        const elHeight = el.offsetHeight;
        // Skip entries taller than a full page (can't avoid breaking them)
        if (elHeight >= PAGE_HEIGHT_PX) return;

        const eRect = el.getBoundingClientRect();
        const elTop = eRect.top - cRect.top;
        const elBottom = elTop + elHeight;

        const pageIdx = Math.floor(elTop / PAGE_HEIGHT_PX);
        const boundary = (pageIdx + 1) * PAGE_HEIGHT_PX;

        if (elTop < boundary && elBottom > boundary) {
          const additionalPush = boundary - elTop + 4;
          const naturalMargin = parseFloat(el.dataset.naturalMarginPx || '0');
          const currentPush = parseFloat(el.dataset.pushPx || '0');
          const newPush = currentPush + additionalPush;
          el.dataset.pushPx = String(newPush);
          el.style.marginTop = `${naturalMargin + newPush}px`;
          changed = true;
        }
      });

      if (!changed) break;
    }
  }, []);

  // Height tracking (for page guide lines) — separate from adjustment
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeightPx(el.scrollHeight));
    ro.observe(el);
    setHeightPx(el.scrollHeight);
    return () => ro.disconnect();
  }, []);

  // Page break adjustment — only when data changes
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(adjustPageBreaks)
    );
    return () => cancelAnimationFrame(id);
  }, [data, adjustPageBreaks]);

  const visibleBreaks = PAGE_BREAKS_MM.filter(mm => (mm + 10) * MM_TO_PX < heightPx);

  const renderSection = (key: SectionKey) => {
    switch (key) {
      case 'experience':
        if (!experience.length) return null;
        return (
          <section key="experience">
            {experience.map((exp, i) => (
              <div key={exp.id} data-entry className={`${i > 0 ? 'mt-7' : ''} print:break-inside-avoid`}>
                {i === 0 && <SectionHeader label="경력" />}
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
            {projects.map((proj, i) => (
              <div key={proj.id} data-entry className={`${i > 0 ? 'mt-7' : ''} print:break-inside-avoid`}>
                {i === 0 && <SectionHeader label="프로젝트" />}
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
            <div data-entry className="print:break-inside-avoid">
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
            </div>
          </section>
        );

      case 'education':
        if (!education.length) return null;
        return (
          <section key="education">
            {education.map((edu, i) => (
              <div key={edu.id} data-entry className={`${i > 0 ? 'mt-5' : ''} print:break-inside-avoid`}>
                {i === 0 && <SectionHeader label="교육" />}
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
            {certifications.map((cert, i) => (
              <div key={cert.id} data-entry className={`${i > 0 ? 'mt-3' : ''} print:break-inside-avoid`}>
                {i === 0 && <SectionHeader label="자격증" />}
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
            <img src={photo} alt="프로필" className="w-28 h-28 object-cover rounded-lg border border-gray-100" />
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
          <div data-entry className="print:break-inside-avoid">
            <SectionHeader label="자기소개" />
            <p className="text-[11px] text-gray-700 leading-relaxed whitespace-pre-line">{basicInfo.about}</p>
          </div>
        </section>
      )}

      {basicInfo.portfolio && (
        <section>
          <div data-entry className="print:break-inside-avoid">
            <SectionHeader label="포트폴리오" />
            <p className="text-[11px] text-gray-500 font-semibold mb-0.5">링크</p>
            <p className="text-[11px] text-gray-700 underline">{basicInfo.portfolio}</p>
          </div>
        </section>
      )}

      {sectionOrder.map(key => renderSection(key))}
    </div>
  );
};

export default ResumePreview;
