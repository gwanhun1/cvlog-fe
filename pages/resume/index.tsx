import { useState, useEffect, useCallback, useRef } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import AuthGuard from 'components/Shared/common/AuthGuard';
import ResumePreview from 'components/pages/resume/ResumePreview';
import DraftResumeModal from 'components/Shared/DraftResumeModal';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type {
  ResumeData, SectionKey, BasicInfo, ExperienceItem,
  EducationItem, SkillGroup, ProjectItem, CertItem,
} from 'components/pages/resume/types';
import { DEFAULT_RESUME, SECTION_LABELS } from 'components/pages/resume/types';

const STORAGE_KEY = 'logme_resume_v2';
const PHOTO_KEY = 'logme_resume_photo';
const genId = () => Math.random().toString(36).slice(2, 9);

const inputCls = 'w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-ftBlue/20 focus:border-ftBlue transition-colors placeholder:text-gray-300';
const labelCls = 'block text-xs font-medium text-gray-500 mb-1';

// ── Sortable wrapper ───────────────────────────────────────────
const SortableSection = ({ id, children }: { id: string; children: (p: { dragProps: React.HTMLAttributes<HTMLElement> }) => React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}>
      {children({ dragProps: { ...attributes, ...listeners } })}
    </div>
  );
};

// ── Section card ───────────────────────────────────────────────
const SectionCard = ({ title, collapsed, onToggle, dragProps, children }: {
  title: string; collapsed: boolean; onToggle: () => void;
  dragProps?: React.HTMLAttributes<HTMLElement>; children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
      <span {...dragProps} className="cursor-grab text-gray-300 hover:text-gray-500 active:cursor-grabbing touch-none select-none" title="드래그로 순서 변경">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </span>
      <span className="flex-1 text-sm font-semibold text-gray-700">{title}</span>
      <button type="button" onClick={onToggle} className="text-gray-400 hover:text-gray-600 transition-colors">
        <svg className={`w-4 h-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
    {!collapsed && <div className="p-4">{children}</div>}
  </div>
);

const AddBtn = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="flex items-center gap-1.5 mt-3 px-3 py-1.5 text-xs font-medium text-ftBlue border border-ftBlue/30 rounded-lg hover:bg-ftBlue/5 transition-colors">
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
    {label}
  </button>
);

const RemoveBtn = ({ onClick }: { onClick: () => void }) => (
  <button type="button" onClick={onClick} className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-600 transition-colors mt-1.5">
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
    삭제
  </button>
);

const Divider = () => <div className="mt-5 pt-5 border-t border-slate-100" />;

// ── Main builder ───────────────────────────────────────────────
const ResumeBuilder = () => {
  const [data, setData] = useState<ResumeData>(DEFAULT_RESUME);
  const [photo, setPhoto] = useState('');
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [saved, setSaved] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load on mount
  useEffect(() => {
    const savedPhoto = localStorage.getItem(PHOTO_KEY);
    if (savedPhoto) setPhoto(savedPhoto);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: ResumeData = JSON.parse(raw);
        setDraftName(parsed.basicInfo?.name || '이름 없음');
        setShowModal(true);
      } catch {}
    }
  }, []);

  // Sync photo to parent data
  useEffect(() => {
    setData(prev => ({ ...prev, photo }));
  }, [photo]);

  // Auto-save
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const { photo: _, ...rest } = data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 600);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [data]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = data.sectionOrder.indexOf(active.id as SectionKey);
    const newIdx = data.sectionOrder.indexOf(over.id as SectionKey);
    setData(prev => ({ ...prev, sectionOrder: arrayMove(prev.sectionOrder, oldIdx, newIdx) }));
  };

  const toggleCollapse = (key: string) => setCollapsed(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

  // Photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      setPhoto(result);
      try { localStorage.setItem(PHOTO_KEY, result); } catch { console.warn('사진 저장 실패: localStorage 용량 초과'); }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhoto('');
    localStorage.removeItem(PHOTO_KEY);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  // Helpers
  const setBasic = (field: keyof BasicInfo, value: string) =>
    setData(prev => ({ ...prev, basicInfo: { ...prev.basicInfo, [field]: value } }));

  const addExp = () => setData(prev => ({ ...prev, experience: [...prev.experience, { id: genId(), company: '', role: '', employmentType: '', startDate: '', endDate: '', isCurrent: false, projectName: '', projectSubtitle: '', description: '', techStack: '' }] }));
  const setExp = (id: string, field: keyof ExperienceItem, value: string | boolean) =>
    setData(prev => ({ ...prev, experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  const removeExp = (id: string) => setData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));

  const addEdu = () => setData(prev => ({ ...prev, education: [...prev.education, { id: genId(), school: '', major: '', degree: '', startDate: '', endDate: '' }] }));
  const setEdu = (id: string, field: keyof EducationItem, value: string) =>
    setData(prev => ({ ...prev, education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  const removeEdu = (id: string) => setData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));

  const addSkill = () => setData(prev => ({ ...prev, skills: [...prev.skills, { id: genId(), category: '', items: '' }] }));
  const setSkill = (id: string, field: keyof SkillGroup, value: string) =>
    setData(prev => ({ ...prev, skills: prev.skills.map(s => s.id === id ? { ...s, [field]: value } : s) }));
  const removeSkill = (id: string) => setData(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));

  const addProj = () => setData(prev => ({ ...prev, projects: [...prev.projects, { id: genId(), name: '', category: '', period: '', subtitle: '', description: '', techStack: '', githubUrl: '', liveUrl: '' }] }));
  const setProj = (id: string, field: keyof ProjectItem, value: string) =>
    setData(prev => ({ ...prev, projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p) }));
  const removeProj = (id: string) => setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));

  const addCert = () => setData(prev => ({ ...prev, certifications: [...prev.certifications, { id: genId(), name: '', grade: '', issuer: '', date: '' }] }));
  const setCert = (id: string, field: keyof CertItem, value: string) =>
    setData(prev => ({ ...prev, certifications: prev.certifications.map(c => c.id === id ? { ...c, [field]: value } : c) }));
  const removeCert = (id: string) => setData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }));

  // Modal
  const handleResumeDraft = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { try { setData(JSON.parse(raw)); } catch {} }
    setShowModal(false);
  };
  const handleFreshStart = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PHOTO_KEY);
    setData(DEFAULT_RESUME);
    setPhoto('');
    setShowModal(false);
  };

  // Section form renderer
  const renderSectionForm = useCallback((key: SectionKey, dragProps: React.HTMLAttributes<HTMLElement>) => {
    const isColl = collapsed.has(key);

    switch (key) {
      case 'experience':
        return (
          <SectionCard key="experience" title={SECTION_LABELS.experience} collapsed={isColl} onToggle={() => toggleCollapse(key)} dragProps={dragProps}>
            {data.experience.map((exp, i) => (
              <div key={exp.id}>
                {i > 0 && <Divider />}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className={labelCls}>회사명</label>
                    <input className={inputCls} placeholder="주식회사OO" value={exp.company} onChange={e => setExp(exp.id, 'company', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>고용 형태</label>
                    <input className={inputCls} placeholder="정규직 / 계약직" value={exp.employmentType} onChange={e => setExp(exp.id, 'employmentType', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>직책</label>
                    <input className={inputCls} placeholder="프론트엔드 개발자" value={exp.role} onChange={e => setExp(exp.id, 'role', e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className={labelCls}>시작</label>
                      <input className={inputCls} placeholder="2023.04" value={exp.startDate} onChange={e => setExp(exp.id, 'startDate', e.target.value)} />
                    </div>
                    <div className="flex-1">
                      <label className={labelCls}>종료</label>
                      <input className={inputCls} placeholder="2024.12" value={exp.endDate} onChange={e => setExp(exp.id, 'endDate', e.target.value)} disabled={exp.isCurrent} />
                    </div>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-500 mb-3 cursor-pointer">
                  <input type="checkbox" checked={exp.isCurrent} onChange={e => setExp(exp.id, 'isCurrent', e.target.checked)} className="accent-ftBlue" />
                  재직 중
                </label>
                <div className="mb-2">
                  <label className={labelCls}>프로젝트명</label>
                  <input className={inputCls} placeholder="FlowV" value={exp.projectName} onChange={e => setExp(exp.id, 'projectName', e.target.value)} />
                </div>
                <div className="mb-2">
                  <label className={labelCls}>프로젝트 한 줄 설명</label>
                  <input className={inputCls} placeholder="전력 입찰 및 관리 전력 중개 통합 서비스" value={exp.projectSubtitle} onChange={e => setExp(exp.id, 'projectSubtitle', e.target.value)} />
                </div>
                <div className="mb-2">
                  <label className={labelCls}>업무 내용 (• 로 시작하는 줄 구분)</label>
                  <textarea className={inputCls + ' resize-none'} rows={5} placeholder={'• 주요 업무 및 성과\n• 구체적 수치 포함'} value={exp.description} onChange={e => setExp(exp.id, 'description', e.target.value)} />
                </div>
                <div className="mb-1">
                  <label className={labelCls}>사용 언어 및 툴</label>
                  <input className={inputCls} placeholder="TypeScript, React, Vite, ..." value={exp.techStack} onChange={e => setExp(exp.id, 'techStack', e.target.value)} />
                </div>
                <RemoveBtn onClick={() => removeExp(exp.id)} />
              </div>
            ))}
            <AddBtn label="경력 추가" onClick={addExp} />
          </SectionCard>
        );

      case 'projects':
        return (
          <SectionCard key="projects" title={SECTION_LABELS.projects} collapsed={isColl} onToggle={() => toggleCollapse(key)} dragProps={dragProps}>
            {data.projects.map((proj, i) => (
              <div key={proj.id}>
                {i > 0 && <Divider />}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className={labelCls}>프로젝트명</label>
                    <input className={inputCls} placeholder="LOGME" value={proj.name} onChange={e => setProj(proj.id, 'name', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>구분</label>
                    <input className={inputCls} placeholder="개인 / 팀 / 기타" value={proj.category} onChange={e => setProj(proj.id, 'category', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>기간</label>
                    <input className={inputCls} placeholder="2025.01 ~ 2025.03" value={proj.period} onChange={e => setProj(proj.id, 'period', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>한 줄 설명</label>
                    <input className={inputCls} placeholder="이력서, GitHub, 블로그를 통합한 포트폴리오 서비스" value={proj.subtitle} onChange={e => setProj(proj.id, 'subtitle', e.target.value)} />
                  </div>
                </div>
                <div className="mb-2">
                  <label className={labelCls}>상세 내용 (• 로 시작하는 줄 구분)</label>
                  <textarea className={inputCls + ' resize-none'} rows={4} placeholder={'• 주요 기능\n• 성과 및 기술적 도전'} value={proj.description} onChange={e => setProj(proj.id, 'description', e.target.value)} />
                </div>
                <div className="mb-2">
                  <label className={labelCls}>사용 언어 및 툴</label>
                  <input className={inputCls} placeholder="React, Next.js, TypeScript, ..." value={proj.techStack} onChange={e => setProj(proj.id, 'techStack', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-1">
                  <div>
                    <label className={labelCls}>GitHub URL</label>
                    <input className={inputCls} placeholder="github.com/..." value={proj.githubUrl} onChange={e => setProj(proj.id, 'githubUrl', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>배포 URL</label>
                    <input className={inputCls} placeholder="https://..." value={proj.liveUrl} onChange={e => setProj(proj.id, 'liveUrl', e.target.value)} />
                  </div>
                </div>
                <RemoveBtn onClick={() => removeProj(proj.id)} />
              </div>
            ))}
            <AddBtn label="프로젝트 추가" onClick={addProj} />
          </SectionCard>
        );

      case 'skills':
        return (
          <SectionCard key="skills" title={SECTION_LABELS.skills} collapsed={isColl} onToggle={() => toggleCollapse(key)} dragProps={dragProps}>
            <p className="text-xs text-gray-400 mb-3">카테고리별로 기술을 묶어 입력하세요.</p>
            {data.skills.map((sg, i) => (
              <div key={sg.id}>
                {i > 0 && <div className="mt-3 pt-3 border-t border-slate-100" />}
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

      case 'education':
        return (
          <SectionCard key="education" title={SECTION_LABELS.education} collapsed={isColl} onToggle={() => toggleCollapse(key)} dragProps={dragProps}>
            {data.education.map((edu, i) => (
              <div key={edu.id}>
                {i > 0 && <Divider />}
                <div className="grid grid-cols-2 gap-2 mb-1">
                  <div className="col-span-2">
                    <label className={labelCls}>학교명</label>
                    <input className={inputCls} placeholder="조선대학교" value={edu.school} onChange={e => setEdu(edu.id, 'school', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>학위</label>
                    <input className={inputCls} placeholder="학사 / 전문학사" value={edu.degree} onChange={e => setEdu(edu.id, 'degree', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>전공</label>
                    <input className={inputCls} placeholder="전자공학과" value={edu.major} onChange={e => setEdu(edu.id, 'major', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>입학</label>
                    <input className={inputCls} placeholder="2016.03" value={edu.startDate} onChange={e => setEdu(edu.id, 'startDate', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>졸업</label>
                    <input className={inputCls} placeholder="2023.02" value={edu.endDate} onChange={e => setEdu(edu.id, 'endDate', e.target.value)} />
                  </div>
                </div>
                <RemoveBtn onClick={() => removeEdu(edu.id)} />
              </div>
            ))}
            <AddBtn label="학력 추가" onClick={addEdu} />
          </SectionCard>
        );

      case 'certifications':
        return (
          <SectionCard key="certifications" title={SECTION_LABELS.certifications} collapsed={isColl} onToggle={() => toggleCollapse(key)} dragProps={dragProps}>
            {data.certifications.map((cert, i) => (
              <div key={cert.id}>
                {i > 0 && <div className="mt-3 pt-3 border-t border-slate-100" />}
                <div className="grid grid-cols-2 gap-2 mb-1">
                  <div className="col-span-2">
                    <label className={labelCls}>자격증명</label>
                    <input className={inputCls} placeholder="전기기사" value={cert.name} onChange={e => setCert(cert.id, 'name', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>등급</label>
                    <input className={inputCls} placeholder="기사" value={cert.grade} onChange={e => setCert(cert.id, 'grade', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>발급 기관</label>
                    <input className={inputCls} placeholder="한국산업인력공단" value={cert.issuer} onChange={e => setCert(cert.id, 'issuer', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>취득일</label>
                    <input className={inputCls} placeholder="2021.09" value={cert.date} onChange={e => setCert(cert.id, 'date', e.target.value)} />
                  </div>
                </div>
                <RemoveBtn onClick={() => removeCert(cert.id)} />
              </div>
            ))}
            <AddBtn label="자격증 추가" onClick={addCert} />
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
            #resume-print-root { display: block !important; }
            #resume-print-root * { visibility: visible !important; }
            @page { size: A4; margin: 0; }
          }
        `}</style>
      </Head>

      <div id="resume-print-root" style={{ display: 'none' }}>
        <ResumePreview data={{ ...data, photo }} />
      </div>

      <DraftResumeModal isOpen={showModal} draftTitle={draftName} onResume={handleResumeDraft} onFresh={handleFreshStart} onClose={() => setShowModal(false)} />

      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">이력서 편집</h1>
            <p className="text-xs text-gray-400 mt-0.5">섹션 헤더를 드래그해 순서를 변경하세요</p>
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
            <div className="flex tablet:hidden rounded-lg border border-slate-200 overflow-hidden">
              <button onClick={() => setActiveTab('form')} className={`px-3 py-1.5 text-xs font-medium transition-colors ${activeTab === 'form' ? 'bg-ftBlue text-white' : 'text-gray-500'}`}>편집</button>
              <button onClick={() => setActiveTab('preview')} className={`px-3 py-1.5 text-xs font-medium transition-colors ${activeTab === 'preview' ? 'bg-ftBlue text-white' : 'text-gray-500'}`}>미리보기</button>
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

        <div className="flex gap-6">
          {/* Left: Form */}
          <div className={`flex-1 min-w-0 flex flex-col gap-4 ${activeTab === 'preview' ? 'hidden tablet:flex' : ''}`}>

            {/* Basic Info Card */}
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
                <div className="p-4">
                  {/* Photo upload */}
                  <div className="mb-4 flex items-center gap-4">
                    <div
                      onClick={() => !photo && photoInputRef.current?.click()}
                      className={`w-16 h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center flex-shrink-0 overflow-hidden transition-colors ${photo ? 'border-transparent' : 'border-slate-200 hover:border-ftBlue/40 cursor-pointer'}`}
                    >
                      {photo ? (
                        <img src={photo} alt="프로필" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <svg className="w-6 h-6 text-gray-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-[9px] text-gray-300">사진</span>
                        </>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-gray-600">프로필 사진 (선택)</span>
                      <span className="text-[11px] text-gray-400">JPG, PNG · 이력서 우측 상단에 표시됩니다</span>
                      <div className="flex gap-2 mt-1">
                        <button type="button" onClick={() => photoInputRef.current?.click()} className="text-xs px-2.5 py-1 rounded-lg border border-ftBlue/30 text-ftBlue hover:bg-ftBlue/5 transition-colors">
                          {photo ? '사진 변경' : '사진 업로드'}
                        </button>
                        {photo && (
                          <button type="button" onClick={removePhoto} className="text-xs px-2.5 py-1 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-colors">
                            삭제
                          </button>
                        )}
                      </div>
                    </div>
                    <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {([
                      ['name', '이름 *', '정관훈', 'col-span-1'],
                      ['title', '직함', '4년차 프론트엔드 개발자', 'col-span-1'],
                      ['email', '이메일', 'hello@example.com', ''],
                      ['phone', '전화번호', '010-0000-0000', ''],
                      ['location', '주소', '서울 동대문구 하정로 22', ''],
                      ['github', 'GitHub', 'github.com/gwanhun1', ''],
                      ['website', '웹사이트', 'https://logme.shop', ''],
                      ['portfolio', '포트폴리오 링크', 'https://portfolio.link', 'col-span-2'],
                    ] as [keyof BasicInfo, string, string, string][]).map(([field, label, placeholder, colSpan]) => (
                      <div key={field} className={colSpan || ''}>
                        <label className={labelCls}>{label}</label>
                        <input className={inputCls} placeholder={placeholder} value={data.basicInfo[field]} onChange={e => setBasic(field, e.target.value)} />
                      </div>
                    ))}
                    <div className="col-span-2">
                      <label className={labelCls}>핵심 요약 (상단 소개 문구)</label>
                      <textarea className={inputCls + ' resize-none'} rows={2} placeholder="명확한 아키텍처 표준 수립과 AI 파이프라인 통제를 통해..." value={data.basicInfo.summary} onChange={e => setBasic('summary', e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <label className={labelCls}>자기소개 (상세)</label>
                      <textarea className={inputCls + ' resize-none'} rows={5} placeholder="React · TypeScript 기반의 웹 서비스를 중심으로..." value={data.basicInfo.about} onChange={e => setBasic('about', e.target.value)} />
                    </div>
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
                <ResumePreview data={{ ...data, photo }} />
              </div>
            </div>
          </div>

          {/* Mobile preview tab */}
          {activeTab === 'preview' && (
            <div className="flex-1 min-w-0 tablet:hidden overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <ResumePreview data={{ ...data, photo }} />
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
