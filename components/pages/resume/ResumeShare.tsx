import { useState } from 'react';
import { publishResume, revokeResume, ShareOptions } from 'service/api/resume';
import { trackEvent } from 'utils/analytics';
const defaults: ShareOptions = { email: false, phone: false, location: false, photo: false, onProfile: false };
export default function ResumeShare({ id }: { id: number | null }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState(defaults);
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const run = async (revoke: boolean) => {
    if (!id) return;
    setBusy(true); setMessage('');
    try {
      if (revoke) { await revokeResume(id); setLink(''); setMessage('공유를 종료했습니다. 기존 링크는 더 이상 열리지 않습니다.'); }
      else { const result = await publishResume(id, options); setLink(`${window.location.origin}/r/${result.token}`); setMessage('공개 사본이 발행되었습니다. 아래 링크로 확인하세요.'); trackEvent('resume_share'); }
    } catch { setMessage('요청에 실패했습니다. 로그인과 저장 상태를 확인해주세요.'); }
    finally { setBusy(false); }
  };
  return <div className="mt-3 rounded-xl border border-slate-300 bg-white p-4">
    <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="font-semibold text-blue-800">이력서 공유 {open ? '접기' : '설정'}</button>
    {open && <div className="mt-3 space-y-3 text-sm text-slate-700">
      <p>공유는 <strong>계정에 저장한 내용</strong>으로 발행합니다. 수정했다면 먼저 저장해주세요. 공유 링크를 가진 누구나 읽을 수 있습니다.</p>
      <p>아래 연락처 항목과 사진은 선택한 것만 포함됩니다. 자기소개·경력 등 본문에 직접 적은 개인정보는 그대로 공개되니 확인해주세요.</p>
      {(Object.keys(defaults) as (keyof ShareOptions)[]).map(key => <label key={key} className="flex items-center gap-3"><input type="checkbox" checked={options[key]} onChange={e => setOptions({ ...options, [key]: e.target.checked })} />{{ email: '이메일 공개', phone: '전화번호 공개', location: '주소 공개', photo: '사진 공개', onProfile: '내 공개 프로필에도 이력서 표시' }[key]}</label>)}
      <p className="text-xs text-slate-600">다시 발행하면 새 링크가 만들어지고 이전 링크는 종료됩니다. 저장만 하면 공개 사본은 바뀌지 않습니다.</p>
      {!id && <p className="font-semibold text-amber-800">계정에 이력서를 먼저 저장해주세요.</p>}
      <div className="flex flex-wrap gap-3"><button disabled={!id || busy} onClick={() => run(false)} className="rounded-lg bg-blue-700 px-4 py-2 text-white disabled:opacity-50">{busy ? '처리 중…' : '공유 사본 발행'}</button><button disabled={!id || busy} onClick={() => run(true)} className="rounded-lg border border-slate-300 px-4 py-2 disabled:opacity-50">공유 종료</button></div>
      {link && <div className="space-y-2"><a href={link} target="_blank" rel="noreferrer" className="block break-all text-blue-700 underline">공개 이력서 열기 ↗</a><input aria-label="공유 링크" readOnly value={link} className="w-full rounded border border-slate-300 p-2" onFocus={e => e.target.select()} /><button onClick={async () => { try { await navigator.clipboard.writeText(link); setMessage('링크를 복사했습니다.'); } catch { setMessage('위 링크를 선택해 복사해주세요.'); } }}>링크 복사</button></div>}
      <p role="status">{message}</p>
    </div>}
  </div>;
}
