import { useEffect, useState } from 'react';
import { getMyResumes, deleteResume, type SavedResume } from 'service/api/resume';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: number) => void;
  onNewResume: () => void;
  currentId: number | null;
}

const DocCardIcon = ({ active }: { active?: boolean }) => (
  <svg viewBox="0 0 48 60" fill="none" className="w-full h-full">
    <rect x="0.5" y="0.5" width="47" height="59" rx="4.5" fill={active ? '#EFF6FF' : '#F8FAFC'} stroke={active ? '#93C5FD' : '#E2E8F0'} />
    <path d="M30 0.5v13a1 1 0 001 1h13" stroke={active ? '#93C5FD' : '#E2E8F0'} />
    <rect x="8" y="24" width="32" height="2.5" rx="1.25" fill={active ? '#BFDBFE' : '#E2E8F0'} />
    <rect x="8" y="31" width="24" height="2.5" rx="1.25" fill={active ? '#BFDBFE' : '#E2E8F0'} />
    <rect x="8" y="38" width="28" height="2.5" rx="1.25" fill={active ? '#BFDBFE' : '#E2E8F0'} />
    <rect x="8" y="45" width="16" height="2.5" rx="1.25" fill={active ? '#BFDBFE' : '#E2E8F0'} />
  </svg>
);

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days === 1) return '어제';
  if (days < 7) return `${days}일 전`;
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
};

const ResumeListModal = ({ isOpen, onClose, onSelect, onNewResume, currentId }: Props) => {
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    getMyResumes()
      .then(setResumes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [isOpen, onClose]);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete !== id) { setConfirmDelete(id); return; }
    setDeletingId(id);
    try {
      await deleteResume(id);
      setResumes(prev => prev.filter(r => r.id !== id));
      setConfirmDelete(null);
    } catch {}
    setDeletingId(null);
  };

  if (!isOpen) return null;

  const hasResumes = !loading && resumes.length > 0;
  const isEmpty = !loading && resumes.length === 0;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
           style={{ maxHeight: 'min(80vh, 560px)' }}>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-gray-900">내 이력서</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {loading ? '불러오는 중...' : `총 ${resumes.length}개 저장됨`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onNewResume}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-ftBlue bg-ftBlue/8 rounded-lg hover:bg-ftBlue/15 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              새 이력서
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="h-px bg-slate-100 mx-6" />

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-100 p-3 animate-pulse">
                  <div className="w-full aspect-[4/5] bg-slate-100 rounded-lg mb-2" />
                  <div className="h-2.5 bg-slate-100 rounded-full mb-1.5" />
                  <div className="h-2 bg-slate-100 rounded-full w-2/3" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {isEmpty && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-20 opacity-30 mb-5">
                <DocCardIcon />
              </div>
              <p className="text-sm font-semibold text-gray-500 mb-1">저장된 이력서가 없어요</p>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                작성한 이력서를 저장하면<br />여기서 불러올 수 있어요
              </p>
              <button
                onClick={onNewResume}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-ftBlue rounded-xl hover:bg-ftBlue/90 transition-colors shadow-lg shadow-ftBlue/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                새 이력서 시작하기
              </button>
            </div>
          )}

          {/* Resume grid */}
          {hasResumes && (
            <div className="grid grid-cols-3 gap-3">
              {resumes.map(resume => {
                const isActive = currentId === resume.id;
                return (
                  <button
                    key={resume.id}
                    onClick={() => { onSelect(resume.id); onClose(); }}
                    className={`group relative text-left rounded-2xl border p-3 transition-all focus:outline-none
                      ${isActive
                        ? 'border-ftBlue/40 bg-blue-50/60 shadow-md shadow-ftBlue/10'
                        : 'border-slate-200 bg-white hover:border-ftBlue/30 hover:shadow-md hover:shadow-slate-200/60 hover:-translate-y-0.5'
                      }`}
                  >
                    {/* Doc icon */}
                    <div className="w-full mb-3" style={{ aspectRatio: '3/4' }}>
                      <DocCardIcon active={isActive} />
                    </div>

                    {/* Active badge */}
                    {isActive && (
                      <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-ftBlue flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}

                    {/* Title & date */}
                    <p className="text-[11px] font-bold text-gray-800 truncate leading-tight mb-0.5">{resume.title}</p>
                    <p className="text-[10px] text-gray-400">{formatDate(resume.updated_at)}</p>

                    {/* Delete button — trash icon */}
                    <button
                      type="button"
                      onClick={e => handleDelete(resume.id, e)}
                      disabled={deletingId === resume.id}
                      className={`absolute bottom-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-full transition-all
                        ${deletingId === resume.id
                          ? 'bg-red-100 text-red-400'
                          : confirmDelete === resume.id
                            ? 'bg-red-400 text-white'
                            : 'bg-slate-100 text-gray-400 hover:bg-red-50 hover:text-red-400'
                        }`}
                      title={confirmDelete === resume.id ? '한 번 더 클릭하면 삭제됩니다' : '삭제'}
                    >
                      {deletingId === resume.id ? (
                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                      ) : confirmDelete === resume.id ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeListModal;
