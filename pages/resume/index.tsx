import { useState, useEffect, useCallback, useRef } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import AuthGuard from 'components/Shared/common/AuthGuard';
import ResumePreview from 'components/pages/resume/ResumePreview';
import DraftResumeModal from 'components/Shared/DraftResumeModal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type {
  ResumeData,
  SectionKey,
  BasicInfo,
  ExperienceItem,
  EducationItem,
  SkillGroup,
  ProjectItem,
} from 'components/pages/resume/types';
import { DEFAULT_RESUME, SECTION_LABELS } from 'components/pages/resume/types';

const STORAGE_KEY = 'logme_resume_v1';
const genId = () => Math.random().toString(36).slice(2, 9);

const inputCls =
  'w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-ftBlue/20 focus:border-ftBlue transition-colors placeholder:text-gray-300';
const labelCls = 'block text-xs font-medium text-gray-500 mb-1';

// ── Sortable section wrapper ──────────────────────────────────
interface SortableSectionProps {
  id: string;
  children: (props: { dragProps: React.HTMLAttributes<HTMLElement> }) => React.ReactNode;
}

const SortableSection = ({ id, children }: SortableSectionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 10 : undefined,
      }}
    >
      {children({ dragProps: { ...attributes, ...listeners } })}
    </div>
  );
};

// ── Section card wrapper ──────────────────────────────────────
const SectionCard = ({
  title,
  collapsed,
  onToggle,
  dragProps,
  children,
}: {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
  dragProps?: React.HTMLAttributes<HTMLElement>;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
      <span
        {...dragProps}
        className="cursor-grab text-gray-300 hover:text-gray-500 active:cursor-grabbing touch-none select-none"
        title="드래그하여 순서 변경"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </span>
      <span className="flex-1 text-sm font-semibold text-gray-700">{title}</span>
      <button
        type="button"
        onClick={onToggle}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg className={`w-4 h-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
    {!collapsed && <div className="p-4">{children}</div>}
  </div>
);

// ── Add button ────────────────────────────────────────────────
const AddBtn = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 mt-3 px-3 py-1.5 text-xs font-medium text-ftBlue border border-ftBlue/30 rounded-lg hover:bg-ftBlue/5 transition-colors"
  >
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
    {label}
  </button>
);

// ── Item remove button ────────────────────────────────────────
const RemoveBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-600 transition-colors mt-1"
  >
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
    삭제
  </button>
);

// ── Main builder ──────────────────────────────────────────────
const ResumeBuilder = () => {
  const [data, setData] = useState<ResumeData>(DEFAULT_RESUME);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load draft check on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: ResumeData = JSON.parse(raw);
        setDraftName(parsed.basicInfo?.name || '제목 없음');
        setShowModal(true);
      } catch {}
    }
  }, []);

  // Auto-save debounced
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 600);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [data]);

  // dnd-kit
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = data.sectionOrder.indexOf(active.id as SectionKey);
    const newIdx = data.sectionOrder.indexOf(over.id as SectionKey);
    setData(prev => ({ ...prev, sectionOrder: arrayMove(prev.sectionOrder, oldIdx, newIdx) }));
  };

  const toggleCollapse = (key: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  // ── BasicInfo helpers ────────────────
  const setBasic = (field: keyof BasicInfo, value: string) =>
    setData(prev => ({ ...prev, basicInfo: { ...prev.basicInfo, [field]: value } }));

  // ── Experience helpers ───────────────
  const addExp = () => setData(prev => ({
    ...prev,
    experience: [...prev.experience, { id: genId(), company: '', position: '', startDate: '', endDate: '', isCurrent: false, description: '' }],
  }));
  const setExp = (id: string, field: keyof ExperienceItem, value: string | boolean) =>
    setData(prev => ({ ...prev, experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  const removeExp = (id: string) =>
    setData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));

  // ── Education helpers ────────────────
  const addEdu = () => setData(prev => ({
    ...prev,
    education: [...prev.education, { id: genId(), school: '', major: '', degree: '', startDate: '', endDate: '' }],
  }));
  const setEdu = (id: string, field: keyof EducationItem, value: string) =>
    setData(prev => ({ ...prev, education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  const removeEdu = (id: string) =>
    setData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));

  // ── Skills helpers ───────────────────
  const addSkill = () => setData(prev => ({
    ...prev,
    skills: [...prev.skills, { id: genId(), category: '', items: '' }],
  }));
  const setSkill = (id: string, field: keyof SkillGroup, value: string) =>
    setData(prev => ({ ...prev, skills: prev.skills.map(s => s.id === id ? { ...s, [field]: value } : s) }));
  const removeSkill = (id: string) =>
    setData(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));

  // ── Projects helpers ─────────────────
  const addProj = () => setData(prev => ({
    ...prev,
    projects: [...prev.projects, { id: genId(), name: '', description: '', techStack: '', githubUrl: '', liveUrl: '', period: '' }],
  }));
  const setProj = (id: string, field: keyof ProjectItem, value: string) =>
    setData(prev => ({ ...prev, projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p) }));
  const removeProj = (id: string) =>
    setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));

  // ── Modal actions ────────────────────
  const handleResumeDraft = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setData(JSON.parse(raw)); } catch {}
    }
    setShowModal(false);
  };
  const handleFreshStart = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(DEFAULT_RESUME);
    setShowModal(false);
  };

  // ── Section form renderer ────────────
  const renderSectionForm = useCallback((key: SectionKey, dragProps: React.HTMLAttributes<HTMLElement>) => {
    const isCollapsed = collapsed.has(key);

    switch (key) {
      case 'experience':
        return (
          <SectionCard title={SECTION_LABELS.experience} collapsed={isCollapsed} onToggle={() => toggleCollapse(key)} dragProps={dragProps}>
            {data.experience.map((exp, i) => (
              <div key={exp.id} className={`${i > 0 ? 'mt-5 pt-5 border-t border-slate-100' : ''}`}>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className={labelCls}>회사명</label>
                    <input className={inputCls} placeholder="(주)회사이름" value={exp.company} onChange={e => setExp(exp.id, 'company', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>직책</label>
                    <input className={inputCls} placeholder="프론트엔드 개발자" value={exp.position} onChange={e => setExp(exp.id, 'position', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>시작</label>
                    <input className={inputCls} placeholder="2022.03" value={exp.startDate} onChange={e => setExp(exp.id, 'startDate', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>종료</label>
                    <input className={inputCls} placeholder="2024.02" value={exp.endDate} onChange={e => setExp(exp.id, 'endDate', e.target.value)} disabled={exp.isCurrent} />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-500 mb-2 cursor-pointer">
                  <input type="checkbox" checked={exp.isCurrent} onChange={e => setExp(exp.id, 'isCurrent', e.target.checked)} className="accent-ftBlue" />
                  재직 중
                </label>
                <label className={labelCls}>업무 내용</label>
                <textarea className={inputCls + ' resize-none'} rows={4} placeholder="• 주요 업무 및 성과를 입력하세요" value={exp.description} onChange={e => setExp(exp.id, 'description', e.target.value)} />
                <RemoveBtn onClick={() => removeExp(exp.id)} />
              </div>
            ))}
            <AddBtn label="경력 추가" onClick={addExp} />
          </SectionCard>
        );

      case 'education':
        return (
          <SectionCard title={SECTION_LABELS.education} collapsed={isCollapsed} onToggle={() => toggleCollapse(key)} dragProps={dragProps}>
            {data.education.map((edu, i) => (
              <div key={edu.id} className={`${i > 0 ? 'mt-4 pt-4 border-t border-slate-100' : ''}`}>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className={labelCls}>학교명</label>
                    <input className={inputCls} placeholder="OO대학교" value={edu.school} onChange={e => setEdu(edu.id, 'school', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>학위</label>
                    <input className={inputCls} placeholder="학사" value={edu.degree} onChange={e => setEdu(edu.id, 'degree', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>전공</label>
                    <input className={inputCls} placeholder="컴퓨터공학과" value={edu.major} onChange={e => setEdu(edu.id, 'major', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>입학</label>
                    <input className={inputCls} placeholder="2018.03" value={edu.startDate} onChange={e => setEdu(edu.id, 'startDate', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>졸업</label>
                    <input className={inputCls} placeholder="2022.02" value={edu.endDate} onChange={e => setEdu(edu.id, 'endDate', e.target.value)} />
                  </div>
                </div>
                <RemoveBtn onClick={() => removeEdu(edu.id)} />
              </div>
            ))}
            <AddBtn label="학력 추가" onClick={addEdu} />
          </SectionCard>
        );

      case 'skills':
        return (
          <SectionCard title={SECTION_LABELS.skills} collapsed={isCollapsed} onToggle={() => toggleCollapse(key)} dragProps={dragProps}>
            <p className="text-xs text-gray-400 mb-3">카테고리별로 기술을 묶어 입력하세요. 기술은 쉼표로 구분됩니다.</p>
            {data.skills.map((sg, i) => (
              <div key={sg.id} className={`${i > 0 ? 'mt-3 pt-3 border-t border-slate-100' : ''}`}>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className={labelCls}>카테고리</label>
                    <input className={inputCls} placeholder="Frontend" value={sg.category} onChange={e => setSkill(sg.id, 'category', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>기술 목록</label>
                    <input className={inputCls} placeholder="React, TypeScript, Next.js" value={sg.items} onChange={e => setSkill(sg.id, 'items', e.target.value)} />
                  </div>
                </div>
                <RemoveBtn onClick={() => removeSkill(sg.id)} />
              </div>
            ))}
            <AddBtn label="기술 그룹 추가" onClick={addSkill} />
          </SectionCard>
        );

      case 'projects':
        return (
          <SectionCard title={SECTION_LABELS.projects} collapsed={isCollapsed} onToggle={() => toggleCollapse(key)} dragProps={dragProps}>
            {data.projects.map((proj, i) => (
              <div key={proj.id} className={`${i > 0 ? 'mt-5 pt-5 border-t border-slate-100' : ''}`}>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className={labelCls}>프로젝트명</label>
                    <input className={inputCls} placeholder="LOGME" value={proj.name} onChange={e => setProj(proj.id, 'name', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>기간</label>
                    <input className={inputCls} placeholder="2024.01 – 2024.06" value={proj.period} onChange={e => setProj(proj.id, 'period', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>기술 스택</label>
                    <input className={inputCls} placeholder="Next.js, NestJS, PostgreSQL" value={proj.techStack} onChange={e => setProj(proj.id, 'techStack', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>GitHub URL</label>
                    <input className={inputCls} placeholder="github.com/..." value={proj.githubUrl} onChange={e => setProj(proj.id, 'githubUrl', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>배포 URL</label>
                    <input className={inputCls} placeholder="https://..." value={proj.liveUrl} onChange={e => setProj(proj.id, 'liveUrl', e.target.value)} />
                  </div>
                </div>
                <label className={labelCls}>설명</label>
                <textarea className={inputCls + ' resize-none'} rows={3} placeholder="• 주요 기능 및 성과를 입력하세요" value={proj.description} onChange={e => setProj(proj.id, 'description', e.target.value)} />
                <RemoveBtn onClick={() => removeProj(proj.id)} />
              </div>
            ))}
            <AddBtn label="프로젝트 추가" onClick={addProj} />
          </SectionCard>
        );

      default:
        return null;
    }
  }, [data, collapsed]);

  return (
    <>
      <Head>
        <title>이력서 | LOGME</title>
        <style>{`
          @media print {
            body > * { display: none !important; }
            #resume-print-root { display: block !important; position: fixed; top: 0; left: 0; width: 210mm; }
            #resume-print-root * { visibility: visible !important; }
            @page { size: A4; margin: 15mm; }
          }
        `}</style>
      </Head>

      {/* Print-only element */}
      <div id="resume-print-root" style={{ display: 'none' }}>
        <ResumePreview data={data} />
      </div>

      <DraftResumeModal
        isOpen={showModal}
        draftTitle={draftName}
        onResume={handleResumeDraft}
        onFresh={handleFreshStart}
        onClose={() => setShowModal(false)}
      />

      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">이력서 편집</h1>
            <p className="text-xs text-gray-400 mt-0.5">섹션을 드래그하여 순서를 바꿀 수 있어요</p>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs text-green-500 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                자동 저장됨
              </span>
            )}
            {/* Mobile tab toggle */}
            <div className="flex tablet:hidden rounded-lg border border-slate-200 overflow-hidden">
              <button
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${activeTab === 'form' ? 'bg-ftBlue text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                편집
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${activeTab === 'preview' ? 'bg-ftBlue text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                미리보기
              </button>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-ftBlue rounded-xl hover:bg-ftBlue/90 transition-colors shadow-sm shadow-ftBlue/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              PDF 저장
            </button>
          </div>
        </div>

        {/* Main layout */}
        <div className="flex gap-6">
          {/* Left: Form */}
          <div className={`flex-1 min-w-0 flex flex-col gap-4 ${activeTab === 'preview' ? 'hidden tablet:flex' : ''}`}>
            {/* Basic info — always first, not draggable */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
                <span className="flex-1 text-sm font-semibold text-gray-700">기본 정보</span>
                <button type="button" onClick={() => toggleCollapse('basicInfo')} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className={`w-4 h-4 transition-transform ${collapsed.has('basicInfo') ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {!collapsed.has('basicInfo') && (
                <div className="p-4 grid grid-cols-2 gap-3">
                  {([
                    ['name', '이름', '홍길동', 'col-span-2'],
                    ['title', '직함 / 한 줄 소개', '3년차 프론트엔드 개발자', 'col-span-2'],
                    ['email', '이메일', 'hello@example.com', ''],
                    ['phone', '전화번호', '010-0000-0000', ''],
                    ['location', '위치', '서울, 대한민국', ''],
                    ['github', 'GitHub', 'github.com/username', ''],
                    ['website', '웹사이트', 'https://mysite.com', ''],
                  ] as [keyof BasicInfo, string, string, string][]).map(([field, label, placeholder, colSpan]) => (
                    <div key={field} className={colSpan || ''}>
                      <label className={labelCls}>{label}</label>
                      <input
                        className={inputCls}
                        placeholder={placeholder}
                        value={data.basicInfo[field]}
                        onChange={e => setBasic(field, e.target.value)}
                      />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <label className={labelCls}>자기소개 (요약)</label>
                    <textarea
                      className={inputCls + ' resize-none'}
                      rows={3}
                      placeholder="간결하게 자신을 소개하는 2~3문장을 작성하세요"
                      value={data.basicInfo.summary}
                      onChange={e => setBasic('summary', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Draggable sections */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={data.sectionOrder} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-4">
                  {data.sectionOrder.map(key => (
                    <SortableSection key={key} id={key}>
                      {({ dragProps }) => renderSectionForm(key, dragProps)}
                    </SortableSection>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Right: Preview */}
          <div className={`hidden tablet:block w-[52%] flex-shrink-0 ${activeTab === 'form' ? 'hidden tablet:block' : 'block'}`}>
            <div className="sticky top-20">
              <div className="rounded-xl border border-slate-200 shadow-sm overflow-auto max-h-[calc(100vh-120px)] bg-white">
                <div className="transform origin-top-left" style={{ width: '100%' }}>
                  <ResumePreview data={data} />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Preview tab */}
          {activeTab === 'preview' && (
            <div className="flex-1 min-w-0 tablet:hidden overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <ResumePreview data={data} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const ResumePage: NextPage = () => (
  <AuthGuard>
    <ResumeBuilder />
  </AuthGuard>
);

export default ResumePage;
