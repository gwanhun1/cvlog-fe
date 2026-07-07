import { useState, useEffect, useCallback, useRef } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useIsLogin from 'hooks/useIsLogin';
import ResumePreview from 'components/pages/resume/ResumePreview';
import ResumeListModal from 'components/pages/resume/ResumeListModal';
import DraftResumeModal from 'components/Shared/DraftResumeModal';
import { createResume, updateResume, getResume } from 'service/api/resume';
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
  CertItem,
} from 'components/pages/resume/types';
import { DEFAULT_RESUME, SECTION_LABELS } from 'components/pages/resume/types';

const STORAGE_KEY = 'logme_resume_v2';
const PHOTO_KEY = 'logme_resume_photo';
const genId = () => Math.random().toString(36).slice(2, 9);

const inputCls =
  'w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-ftBlue/20 focus:border-ftBlue transition-all placeholder:text-gray-300';
const labelCls =
  'block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5';

// ── Drag handle icon ───────────────────────────────────────────
const GripIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
    <circle cx="5" cy="4" r="1.2" />
    <circle cx="11" cy="4" r="1.2" />
    <circle cx="5" cy="8" r="1.2" />
    <circle cx="11" cy="8" r="1.2" />
    <circle cx="5" cy="12" r="1.2" />
    <circle cx="11" cy="12" r="1.2" />
  </svg>
);

// ── Sortable wrapper ───────────────────────────────────────────
const SortableSection = ({
  id,
  children,
}: {
  id: string;
  children: (p: {
    dragProps: React.HTMLAttributes<HTMLElement>;
  }) => React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 50 : undefined,
      }}
    >
      {children({ dragProps: { ...attributes, ...listeners } })}
    </div>
  );
};

// ── Section card ───────────────────────────────────────────────
const SectionCard = ({
  title,
  collapsed,
  onToggle,
  dragProps,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  onAdd,
  children,
}: {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
  dragProps?: React.HTMLAttributes<HTMLElement>;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  onAdd?: () => void;
  children: React.ReactNode;
}) => (
  <div
    className={`rounded-2xl border bg-white overflow-hidden transition-all ${collapsed ? 'border-slate-200 shadow-sm' : 'border-ftBlue/20 shadow-md shadow-ftBlue/5'}`}
  >
    <div
      className="flex items-center gap-2 px-4 py-3 cursor-pointer select-none"
      onClick={onToggle}
    >
      {/* Drag grip */}
      <span
        {...dragProps}
        onClick={e => e.stopPropagation()}
        className="cursor-grab text-gray-300 hover:text-gray-400 active:cursor-grabbing touch-none p-1 -m-1 rounded flex-shrink-0"
        title="드래그로 순서 변경"
      >
        <GripIcon />
      </span>

      {/* Title */}
      <span className="flex-1 text-sm font-bold text-gray-800">{title}</span>

      {/* Order arrows — right side, inside header */}
      <div
        className="flex items-center gap-1 flex-shrink-0"
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          className="w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400 hover:bg-white hover:text-ftBlue hover:border-ftBlue/40 hover:shadow-sm disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          title="위로 이동"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          className="w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400 hover:bg-white hover:text-ftBlue hover:border-ftBlue/40 hover:shadow-sm disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          title="아래로 이동"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Quick-add button — always visible so items can be added while collapsed */}
      {onAdd && (
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onAdd();
          }}
          className="w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400 hover:bg-ftBlue/10 hover:text-ftBlue hover:border-ftBlue/40 transition-all flex-shrink-0"
          title="항목 추가"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      )}

      {/* Editing badge */}
      {!collapsed && (
        <span className="text-[10px] font-medium text-ftBlue bg-ftBlue/8 px-2 py-0.5 rounded-full flex-shrink-0">
          편집 중
        </span>
      )}

      {/* Collapse chevron */}
      <svg
        className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${collapsed ? '' : 'rotate-180'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
    {!collapsed && (
      <div className="px-5 pb-5 pt-1 border-t border-slate-100">{children}</div>
    )}
  </div>
);

// ── Field group label ──────────────────────────────────────────
const FieldGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-x-3 gap-y-3">{children}</div>
);

const Field = ({
  label,
  children,
  span2,
}: {
  label: string;
  children: React.ReactNode;
  span2?: boolean;
}) => (
  <div className={span2 ? 'col-span-2' : ''}>
    <label className={labelCls}>{label}</label>
    {children}
  </div>
);

// ── Item card (경력, 프로젝트 각 항목) ─────────────────────────
const ItemCard = ({
  index,
  onRemove,
  children,
}: {
  index: number;
  onRemove: () => void;
  children: React.ReactNode;
}) => (
  <div
    className={`relative rounded-xl border border-slate-100 bg-slate-50/60 p-4 ${index > 0 ? 'mt-3' : ''}`}
  >
    <button
      type="button"
      onClick={onRemove}
      className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all"
      title="삭제"
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
    {children}
  </div>
);

// ── Add button ─────────────────────────────────────────────────
const AddBtn = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-ftBlue rounded-xl border-2 border-dashed border-ftBlue/25 hover:border-ftBlue/50 hover:bg-ftBlue/5 transition-all"
  >
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M12 4v16m8-8H4"
      />
    </svg>
    {label} 추가
  </button>
);

// ── Photo Upload (compact inline) ─────────────────────────────
const PhotoUpload = ({
  photo,
  onUpload,
  onRemove,
  inputRef,
}: {
  photo: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}) => (
  <div className="flex-shrink-0 relative w-28 h-28">
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="relative w-full h-full rounded-lg overflow-hidden border-2 border-dashed border-slate-200 hover:border-ftBlue transition-all bg-slate-50 flex flex-col items-center justify-center group"
      title="프로필 사진 (선택)"
    >
      {photo ? (
        <>
          <img
            src={photo}
            alt="프로필"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </>
      ) : (
        <>
          <svg
            className="w-7 h-7 text-slate-300 mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-[9px] text-slate-400 font-medium leading-tight text-center">
            사진
            <br />
            추가
          </span>
        </>
      )}
    </button>
    {photo && (
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors z-10"
        title="삭제"
      >
        <svg
          className="w-2.5 h-2.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    )}
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={onUpload}
    />
  </div>
);

// ── Main builder ───────────────────────────────────────────────
const ResumeBuilder = () => {
  const router = useRouter();
  const { isAuthenticated } = useIsLogin();
  const [data, setData] = useState<ResumeData>(DEFAULT_RESUME);
  const [photo, setPhoto] = useState('');
  const [title, setTitle] = useState('제목 없는 이력서');
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(
    new Set(['certifications', 'education']),
  );
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [autoSaved, setAutoSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [titleError, setTitleError] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Prevent auto-save from overwriting localStorage while draft modal is pending
  const draftPendingRef = useRef(false);

  useEffect(() => {
    const savedPhoto = localStorage.getItem(PHOTO_KEY);
    if (savedPhoto) setPhoto(savedPhoto);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: ResumeData = JSON.parse(raw);
        const hasContent =
          parsed.basicInfo?.name?.trim() ||
          parsed.experience?.length > 0 ||
          parsed.projects?.length > 0 ||
          parsed.skills?.length > 0 ||
          parsed.education?.length > 0;
        if (hasContent) {
          draftPendingRef.current = true; // block auto-save until user resolves the modal
          setDraftName(parsed.basicInfo?.name || '이름 없음');
          setShowDraftModal(true);
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    setData(prev => ({ ...prev, photo }));
  }, [photo]);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (draftPendingRef.current) return; // don't overwrite while draft modal is pending
      const { photo: _, ...rest } = data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 2000);
    }, 600);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = data.sectionOrder.indexOf(active.id as SectionKey);
    const newIdx = data.sectionOrder.indexOf(over.id as SectionKey);
    setData(prev => ({
      ...prev,
      sectionOrder: arrayMove(prev.sectionOrder, oldIdx, newIdx),
    }));
  };

  const moveSection = (key: SectionKey, dir: -1 | 1) => {
    setData(prev => {
      const idx = prev.sectionOrder.indexOf(key);
      const next = idx + dir;
      if (next < 0 || next >= prev.sectionOrder.length) return prev;
      return { ...prev, sectionOrder: arrayMove(prev.sectionOrder, idx, next) };
    });
  };

  const toggleCollapse = (key: string) =>
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const expandSection = (key: string) =>
    setCollapsed(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });

  const handleSave = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    // 클라이언트 유효성 검사
    if (!title.trim()) {
      setTitleError('이력서 제목을 입력해주세요');
      return;
    }
    setTitleError('');
    setSaving(true);
    try {
      const payload = JSON.stringify({ ...data, photo });
      if (currentId) {
        await updateResume(currentId, title, payload);
      } else {
        const saved = await createResume(title, payload);
        setCurrentId(saved.id);
      }
      setSaveMsg('저장됨');
      setTimeout(() => setSaveMsg(''), 2500);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) setSaveMsg('로그인 필요');
      else if (!navigator.onLine) setSaveMsg('네트워크 오류');
      else if (status === 404) setSaveMsg('API 없음 — BE 실행 필요');
      else if (status >= 500) setSaveMsg('서버 오류');
      else setSaveMsg('저장 실패');
      setTimeout(() => setSaveMsg(''), 4000);
    }
    setSaving(false);
  };

  const handleLoadResume = async (id: number) => {
    try {
      const resume = await getResume(id);
      const parsed: ResumeData = JSON.parse(resume.data);
      if (parsed.photo) setPhoto(parsed.photo);
      setData({ ...parsed, photo: '' });
      setTitle(resume.title);
      setCurrentId(resume.id);
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      setSaveMsg('불러오기 실패');
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  const handleNewResume = () => {
    setData(DEFAULT_RESUME);
    setPhoto('');
    setTitle('');
    setCurrentId(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PHOTO_KEY);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      setPhoto(result);
      try {
        localStorage.setItem(PHOTO_KEY, result);
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhoto('');
    localStorage.removeItem(PHOTO_KEY);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const setBasic = (field: keyof BasicInfo, value: string) =>
    setData(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [field]: value },
    }));

  const addExp = () =>
    setData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: genId(),
          company: '',
          role: '',
          employmentType: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
          projectName: '',
          projectSubtitle: '',
          description: '',
          techStack: '',
        },
      ],
    }));
  const setExp = (
    id: string,
    field: keyof ExperienceItem,
    value: string | boolean,
  ) =>
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(e =>
        e.id === id ? { ...e, [field]: value } : e,
      ),
    }));
  const removeExp = (id: string) =>
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id),
    }));

  const addEdu = () =>
    setData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: genId(),
          school: '',
          major: '',
          degree: '',
          startDate: '',
          endDate: '',
        },
      ],
    }));
  const setEdu = (id: string, field: keyof EducationItem, value: string) =>
    setData(prev => ({
      ...prev,
      education: prev.education.map(e =>
        e.id === id ? { ...e, [field]: value } : e,
      ),
    }));
  const removeEdu = (id: string) =>
    setData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id),
    }));

  const addSkill = () =>
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, { id: genId(), category: '', items: '' }],
    }));
  const setSkill = (id: string, field: keyof SkillGroup, value: string) =>
    setData(prev => ({
      ...prev,
      skills: prev.skills.map(s =>
        s.id === id ? { ...s, [field]: value } : s,
      ),
    }));
  const removeSkill = (id: string) =>
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id),
    }));

  const addProj = () =>
    setData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: genId(),
          name: '',
          category: '',
          period: '',
          subtitle: '',
          description: '',
          techStack: '',
          githubUrl: '',
          liveUrl: '',
        },
      ],
    }));
  const setProj = (id: string, field: keyof ProjectItem, value: string) =>
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === id ? { ...p, [field]: value } : p,
      ),
    }));
  const removeProj = (id: string) =>
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
    }));

  const addCert = () =>
    setData(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { id: genId(), name: '', grade: '', issuer: '', date: '' },
      ],
    }));
  const setCert = (id: string, field: keyof CertItem, value: string) =>
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c =>
        c.id === id ? { ...c, [field]: value } : c,
      ),
    }));
  const removeCert = (id: string) =>
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id),
    }));

  const handleResumeDraft = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch {}
    }
    draftPendingRef.current = false;
    setShowDraftModal(false);
  };
  const handleFreshStart = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PHOTO_KEY);
    setData(DEFAULT_RESUME);
    setPhoto('');
    draftPendingRef.current = false;
    setShowDraftModal(false);
  };
  const handleDraftClose = () => {
    draftPendingRef.current = false;
    setShowDraftModal(false);
  };

  const renderSectionForm = useCallback(
    (
      key: SectionKey,
      dragProps: React.HTMLAttributes<HTMLElement>,
      idx: number,
      total: number,
    ) => {
      const isColl = collapsed.has(key);
      const orderProps = {
        onMoveUp: () => moveSection(key, -1),
        onMoveDown: () => moveSection(key, 1),
        isFirst: idx === 0,
        isLast: idx === total - 1,
      };

      switch (key) {
        case 'experience':
          return (
            <SectionCard
              key="exp"
              title={SECTION_LABELS.experience}
              collapsed={isColl}
              onToggle={() => toggleCollapse(key)}
              dragProps={dragProps}
              onAdd={() => {
                addExp();
                expandSection(key);
              }}
              {...orderProps}
            >
              {data.experience.map((exp, i) => (
                <ItemCard
                  key={exp.id}
                  index={i}
                  onRemove={() => removeExp(exp.id)}
                >
                  <FieldGroup>
                    <Field label="회사명">
                      <input
                        className={inputCls}
                        placeholder="주식회사OO"
                        value={exp.company}
                        onChange={e =>
                          setExp(exp.id, 'company', e.target.value)
                        }
                      />
                    </Field>
                    <Field label="고용 형태">
                      <input
                        className={inputCls}
                        placeholder="정규직"
                        value={exp.employmentType}
                        onChange={e =>
                          setExp(exp.id, 'employmentType', e.target.value)
                        }
                      />
                    </Field>
                    <Field label="직책">
                      <input
                        className={inputCls}
                        placeholder="프론트엔드 개발자"
                        value={exp.role}
                        onChange={e => setExp(exp.id, 'role', e.target.value)}
                      />
                    </Field>
                    <Field label="재직 기간">
                      <div className="flex gap-1.5 items-center">
                        <input
                          className={inputCls}
                          placeholder="2023.04"
                          value={exp.startDate}
                          onChange={e =>
                            setExp(exp.id, 'startDate', e.target.value)
                          }
                        />
                        <span className="text-gray-300 flex-shrink-0">~</span>
                        <input
                          className={`${inputCls} ${exp.isCurrent ? 'opacity-40' : ''}`}
                          placeholder="2024.12"
                          value={exp.endDate}
                          onChange={e =>
                            setExp(exp.id, 'endDate', e.target.value)
                          }
                          disabled={exp.isCurrent}
                        />
                      </div>
                    </Field>
                    <Field label="" span2>
                      <button
                        type="button"
                        onClick={() =>
                          setExp(exp.id, 'isCurrent', !exp.isCurrent)
                        }
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all select-none ${
                          exp.isCurrent
                            ? 'bg-ftBlue text-white border-ftBlue shadow-sm shadow-ftBlue/20'
                            : 'bg-white text-gray-400 border-slate-200 hover:border-ftBlue/40 hover:text-ftBlue/70'
                        }`}
                      >
                        <span
                          className={`relative inline-flex w-7 h-4 rounded-full transition-colors flex-shrink-0 ${exp.isCurrent ? 'bg-white/30' : 'bg-slate-200'}`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${exp.isCurrent ? 'translate-x-3' : 'translate-x-0'}`}
                          />
                        </span>
                        현재 재직 중
                      </button>
                    </Field>
                    <Field label="프로젝트명" span2>
                      <input
                        className={inputCls}
                        placeholder="프로젝트명"
                        value={exp.projectName}
                        onChange={e =>
                          setExp(exp.id, 'projectName', e.target.value)
                        }
                      />
                    </Field>
                    <Field label="프로젝트 설명" span2>
                      <input
                        className={inputCls}
                        placeholder="서비스 한 줄 설명"
                        value={exp.projectSubtitle}
                        onChange={e =>
                          setExp(exp.id, 'projectSubtitle', e.target.value)
                        }
                      />
                    </Field>
                    <Field label="업무 내용" span2>
                      <textarea
                        className={inputCls + ' resize-none'}
                        rows={5}
                        placeholder={
                          '• 주요 업무 및 성과\n• 구체적 수치 포함\n• 기여한 부분 명확히'
                        }
                        value={exp.description}
                        onChange={e =>
                          setExp(exp.id, 'description', e.target.value)
                        }
                      />
                    </Field>
                    <Field label="사용 언어 및 툴" span2>
                      <input
                        className={inputCls}
                        placeholder="TypeScript, React, Vite, ..."
                        value={exp.techStack}
                        onChange={e =>
                          setExp(exp.id, 'techStack', e.target.value)
                        }
                      />
                    </Field>
                  </FieldGroup>
                </ItemCard>
              ))}
              <AddBtn label="경력" onClick={addExp} />
            </SectionCard>
          );

        case 'projects':
          return (
            <SectionCard
              key="proj"
              title={SECTION_LABELS.projects}
              collapsed={isColl}
              onToggle={() => toggleCollapse(key)}
              dragProps={dragProps}
              onAdd={() => {
                addProj();
                expandSection(key);
              }}
              {...orderProps}
            >
              {data.projects.map((proj, i) => (
                <ItemCard
                  key={proj.id}
                  index={i}
                  onRemove={() => removeProj(proj.id)}
                >
                  <FieldGroup>
                    <Field label="프로젝트명">
                      <input
                        className={inputCls}
                        placeholder="프로젝트명"
                        value={proj.name}
                        onChange={e => setProj(proj.id, 'name', e.target.value)}
                      />
                    </Field>
                    <Field label="구분">
                      <input
                        className={inputCls}
                        placeholder="개인 / 팀"
                        value={proj.category}
                        onChange={e =>
                          setProj(proj.id, 'category', e.target.value)
                        }
                      />
                    </Field>
                    <Field label="기간" span2>
                      <input
                        className={inputCls}
                        placeholder="2025.01 ~ 2025.03"
                        value={proj.period}
                        onChange={e =>
                          setProj(proj.id, 'period', e.target.value)
                        }
                      />
                    </Field>
                    <Field label="한 줄 설명" span2>
                      <input
                        className={inputCls}
                        placeholder="프로젝트 한 줄 소개"
                        value={proj.subtitle}
                        onChange={e =>
                          setProj(proj.id, 'subtitle', e.target.value)
                        }
                      />
                    </Field>
                    <Field label="상세 내용" span2>
                      <textarea
                        className={inputCls + ' resize-none'}
                        rows={4}
                        placeholder={'• 주요 기능\n• 성과 및 기술적 도전'}
                        value={proj.description}
                        onChange={e =>
                          setProj(proj.id, 'description', e.target.value)
                        }
                      />
                    </Field>
                    <Field label="사용 언어 및 툴" span2>
                      <input
                        className={inputCls}
                        placeholder="React, Next.js, TypeScript, ..."
                        value={proj.techStack}
                        onChange={e =>
                          setProj(proj.id, 'techStack', e.target.value)
                        }
                      />
                    </Field>
                    <Field label="GitHub">
                      <input
                        className={inputCls}
                        placeholder="github.com/..."
                        value={proj.githubUrl}
                        onChange={e =>
                          setProj(proj.id, 'githubUrl', e.target.value)
                        }
                      />
                    </Field>
                    <Field label="배포 URL">
                      <input
                        className={inputCls}
                        placeholder="https://..."
                        value={proj.liveUrl}
                        onChange={e =>
                          setProj(proj.id, 'liveUrl', e.target.value)
                        }
                      />
                    </Field>
                  </FieldGroup>
                </ItemCard>
              ))}
              <AddBtn label="프로젝트" onClick={addProj} />
            </SectionCard>
          );

        case 'skills':
          return (
            <SectionCard
              key="skill"
              title={SECTION_LABELS.skills}
              collapsed={isColl}
              onToggle={() => toggleCollapse(key)}
              onAdd={() => {
                addSkill();
                expandSection(key);
              }}
              dragProps={dragProps}
              {...orderProps}
            >
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                카테고리별로 기술을 묶어 입력하세요. 예) Frontend | React,
                TypeScript, Next.js
              </p>
              {data.skills.map((sg, i) => (
                <ItemCard
                  key={sg.id}
                  index={i}
                  onRemove={() => removeSkill(sg.id)}
                >
                  <FieldGroup>
                    <Field label="카테고리">
                      <input
                        className={inputCls}
                        placeholder="Frontend"
                        value={sg.category}
                        onChange={e =>
                          setSkill(sg.id, 'category', e.target.value)
                        }
                      />
                    </Field>
                    <Field label="기술 목록">
                      <input
                        className={inputCls}
                        placeholder="React, TypeScript, Next.js"
                        value={sg.items}
                        onChange={e => setSkill(sg.id, 'items', e.target.value)}
                      />
                    </Field>
                  </FieldGroup>
                </ItemCard>
              ))}
              <AddBtn label="기술 그룹" onClick={addSkill} />
            </SectionCard>
          );

        case 'education':
          return (
            <SectionCard
              key="edu"
              title={SECTION_LABELS.education}
              collapsed={isColl}
              onToggle={() => toggleCollapse(key)}
              onAdd={() => {
                addEdu();
                expandSection(key);
              }}
              dragProps={dragProps}
              {...orderProps}
            >
              {data.education.map((edu, i) => (
                <ItemCard
                  key={edu.id}
                  index={i}
                  onRemove={() => removeEdu(edu.id)}
                >
                  <FieldGroup>
                    <Field label="학교명" span2>
                      <input
                        className={inputCls}
                        placeholder="○○대학교"
                        value={edu.school}
                        onChange={e => setEdu(edu.id, 'school', e.target.value)}
                      />
                    </Field>
                    <Field label="학위">
                      <input
                        className={inputCls}
                        placeholder="학사 / 전문학사"
                        value={edu.degree}
                        onChange={e => setEdu(edu.id, 'degree', e.target.value)}
                      />
                    </Field>
                    <Field label="전공">
                      <input
                        className={inputCls}
                        placeholder="컴퓨터공학과"
                        value={edu.major}
                        onChange={e => setEdu(edu.id, 'major', e.target.value)}
                      />
                    </Field>
                    <Field label="입학">
                      <input
                        className={inputCls}
                        placeholder="2019.03"
                        value={edu.startDate}
                        onChange={e =>
                          setEdu(edu.id, 'startDate', e.target.value)
                        }
                      />
                    </Field>
                    <Field label="졸업">
                      <input
                        className={inputCls}
                        placeholder="2023.08"
                        value={edu.endDate}
                        onChange={e =>
                          setEdu(edu.id, 'endDate', e.target.value)
                        }
                      />
                    </Field>
                  </FieldGroup>
                </ItemCard>
              ))}
              <AddBtn label="학력" onClick={addEdu} />
            </SectionCard>
          );

        case 'certifications':
          return (
            <SectionCard
              key="cert"
              title={SECTION_LABELS.certifications}
              collapsed={isColl}
              onToggle={() => toggleCollapse(key)}
              onAdd={() => {
                addCert();
                expandSection(key);
              }}
              dragProps={dragProps}
              {...orderProps}
            >
              {data.certifications.map((cert, i) => (
                <ItemCard
                  key={cert.id}
                  index={i}
                  onRemove={() => removeCert(cert.id)}
                >
                  <FieldGroup>
                    <Field label="자격증명" span2>
                      <input
                        className={inputCls}
                        placeholder="정보처리기사"
                        value={cert.name}
                        onChange={e => setCert(cert.id, 'name', e.target.value)}
                      />
                    </Field>
                    <Field label="등급">
                      <input
                        className={inputCls}
                        placeholder="기사"
                        value={cert.grade}
                        onChange={e =>
                          setCert(cert.id, 'grade', e.target.value)
                        }
                      />
                    </Field>
                    <Field label="발급 기관">
                      <input
                        className={inputCls}
                        placeholder="한국산업인력공단"
                        value={cert.issuer}
                        onChange={e =>
                          setCert(cert.id, 'issuer', e.target.value)
                        }
                      />
                    </Field>
                    <Field label="취득일">
                      <input
                        className={inputCls}
                        placeholder="2022.06"
                        value={cert.date}
                        onChange={e => setCert(cert.id, 'date', e.target.value)}
                      />
                    </Field>
                  </FieldGroup>
                </ItemCard>
              ))}
              <AddBtn label="자격증" onClick={addCert} />
            </SectionCard>
          );

        default:
          return null;
      }
    },
    [data, collapsed],
  );

  return (
    <>
      <Head>
        <title>무료 개발자 이력서 작성 | LOGME 이력서 빌더</title>
        <meta
          name="description"
          content="개발자 맞춤 이력서를 무료로 작성하세요. 경력·프로젝트·기술스택을 입력하면 A4 이력서가 완성됩니다. 실시간 미리보기, PDF 저장, 자동저장 제공."
        />
        <meta
          name="keywords"
          content="이력서 작성, 개발자 이력서, 무료 이력서, 이력서 빌더, 이력서 템플릿, 취업 이력서, IT 이력서, 프론트엔드 이력서"
        />
        <meta
          property="og:title"
          content="무료 개발자 이력서 작성 | LOGME 이력서 빌더"
        />
        <meta
          property="og:description"
          content="개발자 맞춤 이력서를 무료로 작성하세요. 실시간 미리보기, PDF 저장, 자동저장까지 모두 무료."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://logme.cloud/resume" />
        <meta
          property="og:image"
          content="https://logme.cloud/assets/logo.png"
        />
        <meta property="og:site_name" content="LOGME" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="무료 개발자 이력서 작성 | LOGME" />
        <meta
          name="twitter:description"
          content="개발자 맞춤 이력서 무료 작성. 실시간 미리보기 + PDF 저장."
        />
        <link rel="canonical" href="https://logme.cloud/resume" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'LOGME 이력서 빌더',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              url: 'https://logme.cloud/resume',
              description:
                '개발자 맞춤 무료 이력서 작성 도구. 경력, 프로젝트, 기술스택을 입력하면 A4 이력서로 완성됩니다. 실시간 미리보기, PDF 저장, 자동저장, 섹션 드래그 기능 제공.',
              inLanguage: 'ko-KR',
              author: { '@type': 'Organization', name: 'LOGME' },
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
              featureList: [
                '실시간 미리보기',
                'PDF 저장',
                '자동저장',
                '섹션 드래그 재정렬',
                '프로필 사진 업로드',
              ],
            }),
          }}
        />
        <style>{`
          @media print {
            header:not(#resume-print-root header) { display: none !important; }
            #resume-editor-wrap { display: none !important; }
            #resume-print-root {
              display: block !important;
              position: static !important;
              width: 100% !important;
              visibility: visible !important;
            }
            #resume-print-root * { visibility: visible !important; }
            @page { size: A4; margin: 0; }
          }
        `}</style>
      </Head>

      <div
        id="resume-print-root"
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '210mm',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <ResumePreview data={{ ...data, photo }} />
      </div>

      <div id="resume-editor-wrap" className="w-full max-w-7xl mx-auto">
        <DraftResumeModal
          isOpen={showDraftModal}
          draftTitle={draftName}
          onResume={handleResumeDraft}
          onFresh={handleFreshStart}
          onClose={handleDraftClose}
        />
        <ResumeListModal
          isOpen={showListModal}
          onClose={() => setShowListModal(false)}
          onSelect={handleLoadResume}
          onNewResume={() => {
            handleNewResume();
            setShowListModal(false);
          }}
          currentId={currentId}
        />

        {/* 로그인 유도 모달 */}
        {showLoginModal && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowLoginModal(false)}
            />
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
              <div className="w-12 h-12 rounded-2xl bg-ftBlue/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-ftBlue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-extrabold text-gray-900 mb-1">
                저장하려면 로그인이 필요해요
              </h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                로그인하면 이력서를 서버에 저장하고
                <br />
                어디서든 불러올 수 있어요.
                <br />
                <span className="text-xs text-gray-400 mt-1 block">
                  PDF 저장·임시저장은 로그인 없이도 가능해요.
                </span>
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => router.push('/login?redirect=/resume')}
                  className="w-full py-3 text-sm font-bold text-white bg-ftBlue rounded-xl hover:bg-ftBlue/90 transition-colors shadow-lg shadow-ftBlue/25"
                >
                  로그인하기
                </button>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="w-full py-3 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  계속 작성하기
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-6">
          {/* Left: Form */}
          <div className="flex-1 min-w-0 flex flex-col gap-3">
            {/* Top bar */}
            <div className="flex flex-col gap-2">
              {/* Row 1: 내 이력서 + 제목 + 상태 (tablet: + 저장/PDF) */}
              <div className="flex items-center gap-2">
                {/* 내 이력서 버튼 */}
                <button
                  onClick={() =>
                    isAuthenticated
                      ? setShowListModal(true)
                      : setShowLoginModal(true)
                  }
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-slate-200 rounded-xl hover:border-ftBlue/40 hover:text-ftBlue hover:bg-ftBlue/3 transition-all shadow-sm flex-shrink-0"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                  </svg>
                  <span className="hidden tablet:inline">내 이력서</span>
                </button>

                {/* 제목 인라인 편집 */}
                <div className="flex-1 min-w-0 relative">
                  <input
                    type="text"
                    value={title}
                    onChange={e => {
                      setTitle(e.target.value);
                      if (e.target.value.trim()) setTitleError('');
                    }}
                    className={`w-full px-3 py-2 text-sm font-bold text-gray-800 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all placeholder:text-gray-300
                      ${titleError ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : 'border-slate-200 focus:ring-ftBlue/20 focus:border-ftBlue'}`}
                    placeholder="이력서 제목 (필수)"
                  />
                  {titleError && (
                    <p className="absolute left-0 -bottom-5 text-[11px] text-red-400 font-medium whitespace-nowrap">
                      {titleError}
                    </p>
                  )}
                </div>

                {/* 상태 메시지 */}
                <div className="flex-shrink-0 text-right">
                  {saveMsg ? (
                    <span className={`text-xs font-semibold ${saveMsg === '저장됨' ? 'text-emerald-500' : 'text-red-400'}`}>
                      {saveMsg}
                    </span>
                  ) : autoSaved ? (
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      자동저장됨
                    </span>
                  ) : null}
                </div>

                {/* 저장 버튼 — tablet+ only */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="hidden tablet:flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-white bg-ftBlue rounded-xl hover:bg-ftBlue/90 disabled:opacity-50 active:scale-95 transition-all shadow-lg shadow-ftBlue/25 flex-shrink-0"
                >
                  {saving ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                  )}
                  저장
                </button>

                {/* PDF 버튼 — tablet+ only */}
                <button
                  onClick={() => window.print()}
                  className="hidden tablet:flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-ftBlue bg-ftBlue/8 rounded-xl hover:bg-ftBlue/15 active:scale-95 transition-all flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  PDF
                </button>
              </div>

              {/* Row 2: 액션 버튼 — mobile only */}
              <div className="flex items-center gap-2 tablet:hidden">
                <button
                  onClick={() => setActiveTab('preview')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-gray-600 bg-white border border-slate-200 rounded-xl hover:border-ftBlue/40 hover:text-ftBlue transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  미리보기
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-white bg-ftBlue rounded-xl hover:bg-ftBlue/90 disabled:opacity-50 active:scale-95 transition-all shadow-md shadow-ftBlue/25"
                >
                  {saving ? (
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                  )}
                  저장
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-ftBlue bg-ftBlue/8 rounded-xl hover:bg-ftBlue/15 active:scale-95 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  PDF
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div
              className={`rounded-2xl border bg-white overflow-hidden transition-all ${collapsed.has('basicInfo') ? 'border-slate-200 shadow-sm' : 'border-ftBlue/20 shadow-md shadow-ftBlue/5'}`}
            >
              <div
                className="flex items-center gap-3 px-5 py-3.5 cursor-pointer select-none"
                onClick={() => toggleCollapse('basicInfo')}
              >
                <span className="flex-1 text-sm font-bold text-gray-800">
                  기본 정보
                </span>
                {!collapsed.has('basicInfo') && (
                  <span className="text-[10px] font-medium text-ftBlue bg-ftBlue/8 px-2 py-0.5 rounded-full">
                    편집 중
                  </span>
                )}
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${collapsed.has('basicInfo') ? '' : 'rotate-180'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {!collapsed.has('basicInfo') && (
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex flex-col gap-3">
                  {/* 이름/직함 LEFT + 사진 RIGHT (미리보기와 동일한 구조) */}
                  <div className="flex items-start gap-4">
                    <div className="flex-1 flex flex-col gap-3">
                      <Field label="이름">
                        <input
                          className={inputCls}
                          placeholder="홍길동"
                          value={data.basicInfo.name}
                          onChange={e => setBasic('name', e.target.value)}
                        />
                      </Field>
                      <Field label="직함">
                        <input
                          className={inputCls}
                          placeholder="프론트엔드 개발자"
                          value={data.basicInfo.title}
                          onChange={e => setBasic('title', e.target.value)}
                        />
                      </Field>
                    </div>
                    <PhotoUpload
                      photo={photo}
                      onUpload={handlePhotoChange}
                      onRemove={removePhoto}
                      inputRef={photoInputRef}
                    />
                  </div>

                  {/* 연락처 + 링크 2열 그리드 */}
                  <FieldGroup>
                    <Field label="이메일">
                      <input
                        className={inputCls}
                        placeholder="hello@example.com"
                        value={data.basicInfo.email}
                        onChange={e => setBasic('email', e.target.value)}
                      />
                    </Field>
                    <Field label="전화번호">
                      <input
                        className={inputCls}
                        placeholder="010-0000-0000"
                        value={data.basicInfo.phone}
                        onChange={e => setBasic('phone', e.target.value)}
                      />
                    </Field>
                    <Field label="주소">
                      <input
                        className={inputCls}
                        placeholder="서울시 강남구"
                        value={data.basicInfo.location}
                        onChange={e => setBasic('location', e.target.value)}
                      />
                    </Field>
                    <Field label="GitHub">
                      <input
                        className={inputCls}
                        placeholder="github.com/username"
                        value={data.basicInfo.github}
                        onChange={e => setBasic('github', e.target.value)}
                      />
                    </Field>
                    <Field label="웹사이트">
                      <input
                        className={inputCls}
                        placeholder="https://logme.shop"
                        value={data.basicInfo.website}
                        onChange={e => setBasic('website', e.target.value)}
                      />
                    </Field>
                    <Field label="포트폴리오 링크">
                      <input
                        className={inputCls}
                        placeholder="https://portfolio.link"
                        value={data.basicInfo.portfolio}
                        onChange={e => setBasic('portfolio', e.target.value)}
                      />
                    </Field>
                    <Field label="핵심 요약" span2>
                      <textarea
                        className={inputCls + ' resize-none'}
                        rows={2}
                        placeholder="본인의 핵심 역량과 커리어 방향을 한두 문장으로 요약..."
                        value={data.basicInfo.summary}
                        onChange={e => setBasic('summary', e.target.value)}
                      />
                    </Field>
                    <Field label="자기소개 (상세)" span2>
                      <textarea
                        className={inputCls + ' resize-none'}
                        rows={4}
                        placeholder="본인의 개발 철학, 경험, 강점을 구체적으로 작성..."
                        value={data.basicInfo.about}
                        onChange={e => setBasic('about', e.target.value)}
                      />
                    </Field>
                  </FieldGroup>
                </div>
              )}
            </div>

            {/* Draggable sections */}
            <DndContext
              id="resume-sections-dnd"
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={data.sectionOrder}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-3">
                  {data.sectionOrder.map((key, idx) => (
                    <SortableSection key={key} id={key}>
                      {({ dragProps }) =>
                        renderSectionForm(
                          key,
                          dragProps,
                          idx,
                          data.sectionOrder.length,
                        )
                      }
                    </SortableSection>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Right: Preview */}
          <div className={`hidden tablet:block w-[50%] flex-shrink-0`}>
            <div className="sticky top-[68px] z-30">
              {/* 미리보기 라벨 (저장/PDF는 좌측 상단바에 이미 있어 중복 제거) */}
              <div className="flex items-center mb-2 px-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  미리보기
                </span>
              </div>
              <div className="rounded-2xl border border-slate-200 shadow-lg overflow-auto max-h-[calc(100vh-116px)] bg-white">
                <ResumePreview data={{ ...data, photo }} />
              </div>
            </div>
          </div>

          {/* Mobile fullscreen preview overlay */}
          {activeTab === 'preview' && (
            <div className="fixed inset-0 z-[60] bg-white overflow-y-auto tablet:hidden">
              <ResumePreview data={{ ...data, photo }} />

              {/* Floating controls */}
              <div className="fixed top-4 left-4 right-4 z-[61] flex items-center justify-between pointer-events-none tablet:hidden">
                <button
                  onClick={() => setActiveTab('form')}
                  className="pointer-events-auto flex items-center gap-1.5 pl-2.5 pr-3.5 py-2 text-xs font-bold text-gray-700 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/60 hover:bg-white transition-all active:scale-95"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  편집으로
                </button>
                <button
                  onClick={() => window.print()}
                  className="pointer-events-auto flex items-center gap-1.5 pl-3 pr-3.5 py-2 text-xs font-bold text-white bg-ftBlue/90 backdrop-blur-md rounded-full shadow-lg hover:bg-ftBlue transition-all active:scale-95"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  PDF 저장
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const ResumePage: NextPage = () => <ResumeBuilder />;

export default ResumePage;
