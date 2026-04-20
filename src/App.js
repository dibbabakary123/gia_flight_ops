import { useState, useEffect, useCallback } from 'react';
import { supabase, saveFlightRecord, loadRecentRecords } from './lib/supabase';
import {
  CHECK_IN_ITEMS, GATE_ITEMS, EVAL_ROLES, STAFF_ROLES,
  emptyCheckIn, emptyGate, emptyEvals
} from './lib/data';

const GIA_LOGO = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAoHBwkHBgoJCAkLCwoMDxkQDw4ODx4WFxIZJCAmJSMgIyIoLTkwKCo2KyIjMkQyNjs9QEBAJjBGS0U+Sjk/QD3/2wBDAQsLCw8NDx0QEB09KSMpPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT3/wAARCADcANwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2SiiiAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAC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';


// ─── Styles ──────────────────────────────────────────────────────────
const C = {
  bg: '#0d1117', surface: '#161b26', border: '#1e2d3d',
  blue: '#3b82f6', blueDim: '#1e3a5f', blueText: '#93c5fd',
  green: '#22c55e', greenDim: '#14532d', greenText: '#4ade80',
  red: '#ef4444', redDim: '#450a0a', redText: '#f87171',
  amber: '#f59e0b', text: '#e2e8f0', muted: '#64748b', faint: '#475569',
  mono: "'DM Mono', monospace", sans: "'DM Sans', sans-serif",
};

const s = {
  app: { minHeight: '100vh', background: C.bg, fontFamily: C.sans, color: C.text, paddingBottom: 80 },
  header: { background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '14px 16px', position: 'sticky', top: 0, zIndex: 100 },
  headerRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logoWrap: { display: 'flex', alignItems: 'center', gap: 10 },
  logoIcon: { height: 32, width: 'auto', objectFit: 'contain' },
  logoText: { fontSize: 13, fontWeight: 700, color: C.blueText, letterSpacing: 1 },
  logoSub: { fontSize: 10, color: C.muted, marginTop: 1 },
  pill: (color = C.blueDim, textColor = C.blueText) => ({ background: color, color: textColor, border: `1px solid ${textColor}33`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontFamily: C.mono, letterSpacing: 0.5 }),
  body: { padding: '16px', maxWidth: 560, margin: '0 auto' },
  card: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 16px', marginBottom: 16 },
  sectionTitle: { fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: C.blue, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 },
  label: { fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: C.faint, marginBottom: 5, fontWeight: 600 },
  input: { width: '100%', background: C.bg, border: `1px solid ${C.blueDim}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontSize: 14, fontFamily: C.mono, outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', background: C.bg, border: `1px solid ${C.blueDim}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontSize: 14, outline: 'none', resize: 'vertical', minHeight: 80, boxSizing: 'border-box', fontFamily: C.sans },
  row: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 },
  field: { flex: '1 1 140px' },
  btn: (bg = C.blue, color = '#fff') => ({ background: bg, border: 'none', color, padding: '12px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: C.sans, width: '100%', marginTop: 8 }),
  ynBtn: (val, target) => ({
    padding: '7px 14px', borderRadius: 7, border: `1px solid ${val === target ? (target === 'YES' ? C.green : C.red) : C.border}`,
    background: val === target ? (target === 'YES' ? C.greenDim : C.redDim) : C.bg,
    color: val === target ? (target === 'YES' ? C.greenText : C.redText) : C.faint,
    fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: C.mono, letterSpacing: 1, marginRight: 4,
  }),
  checkRow: (i) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0', borderBottom: `1px solid ${C.border}22`, background: i % 2 === 0 ? 'transparent' : '#0d111755' }),
  navBar: { position: 'fixed', bottom: 0, left: 0, right: 0, background: C.surface, borderTop: `1px solid ${C.border}`, display: 'flex', zIndex: 200 },
  navBtn: (active) => ({ flex: 1, padding: '10px 4px 14px', background: 'none', border: 'none', color: active ? C.blue : C.faint, fontFamily: C.sans, fontSize: 10, fontWeight: active ? 700 : 500, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }),
  badge: { background: C.blue, color: '#fff', borderRadius: 20, padding: '1px 7px', fontSize: 10, fontFamily: C.mono, fontWeight: 700 },
  statGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 },
  stat: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px', textAlign: 'center' },
  statNum: (color = C.blue) => ({ fontSize: 28, fontWeight: 800, fontFamily: C.mono, color, lineHeight: 1 }),
  statLabel: { fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: C.faint, marginTop: 4, fontWeight: 600 },
  progressWrap: { marginBottom: 12 },
  progressBar: (pct, color = C.blue) => ({ height: 6, background: `linear-gradient(90deg, ${color} ${pct}%, ${C.border} ${pct}%)`, borderRadius: 3, marginTop: 6 }),
  toast: (show) => ({ position: 'fixed', top: 70, left: '50%', transform: `translateX(-50%) translateY(${show ? 0 : -20}px)`, opacity: show ? 1 : 0, background: C.greenDim, border: `1px solid ${C.green}`, color: C.greenText, padding: '10px 22px', borderRadius: 20, fontWeight: 700, fontSize: 13, transition: 'all 0.3s', zIndex: 300, pointerEvents: 'none' }),
  histCard: { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px', marginBottom: 10, cursor: 'pointer' },
  nameChip: { background: C.blueDim, border: `1px solid ${C.blue}33`, borderRadius: 6, padding: '3px 9px', fontSize: 11, color: C.blueText, fontWeight: 600, display: 'inline-block', margin: '2px' },
  evalCard: { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px', marginBottom: 10 },
  scoreRow: { display: 'flex', gap: 6, marginTop: 8 },
  scoreBtn: (active) => ({ width: 36, height: 36, borderRadius: 8, border: `1px solid ${active ? C.blue : C.border}`, background: active ? C.blueDim : 'transparent', color: active ? C.blueText : C.faint, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: C.mono }),
};

// ─── Helpers ─────────────────────────────────────────────────────────
const today = () => new Date().toLocaleDateString('en-GB');

// ─── Sub-components ───────────────────────────────────────────────────
function YNToggle({ value, onChange }) {
  return (
    <div style={{ flexShrink: 0 }}>
      <button style={s.ynBtn(value, 'YES')} onClick={() => onChange(value === 'YES' ? null : 'YES')}>YES</button>
      <button style={s.ynBtn(value, 'NO')} onClick={() => onChange(value === 'NO' ? null : 'NO')}>NO</button>
    </div>
  );
}

function ChecklistSection({ title, icon, items, values, onChange }) {
  const done = Object.values(values).filter(Boolean).length;
  return (
    <div style={s.card}>
      <div style={s.sectionTitle}>{icon} {title}</div>
      <div style={{ ...s.progressWrap }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.muted, marginBottom: 2 }}>
          <span>{done}/{items.length} completed</span>
          <span>{Math.round((done / items.length) * 100)}%</span>
        </div>
        <div style={s.progressBar((done / items.length) * 100)} />
      </div>
      {items.map((item, i) => (
        <div key={item.id} style={s.checkRow(i)}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.4 }}>{item.label}</div>
            {item.time && <div style={{ fontSize: 10, color: C.muted, fontFamily: C.mono, marginTop: 2 }}>{item.time}</div>}
          </div>
          <YNToggle value={values[item.id]} onChange={(v) => onChange(item.id, v)} />
        </div>
      ))}
    </div>
  );
}

// ─── Screens ─────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');

  // Simple PIN auth — in production replace with Supabase Auth
  const STAFF_PINS = { '1234': true, '5678': true, '0000': true };

  function handleLogin() {
    if (!name.trim()) return setErr('Please enter your name');
    if (!role) return setErr('Please select your role');
    if (!STAFF_PINS[pin]) return setErr('Invalid PIN — contact your supervisor');
    setErr('');
    onLogin({ name: name.trim(), role });
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <img src={GIA_LOGO} alt="GIA" style={{ height: 60, width: 'auto', marginBottom: 12 }} />
        <div style={{ fontSize: 20, fontWeight: 800, color: C.blueText, letterSpacing: 1 }}>GIA Flight Ops</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Gambia International Airlines</div>
      </div>
      <div style={{ ...s.card, width: '100%', maxWidth: 360 }}>
        <div style={s.sectionTitle}>🔐 Staff Login</div>
        <div style={{ marginBottom: 12 }}>
          <div style={s.label}>Full Name</div>
          <input style={s.input} placeholder="e.g. Amie Faye" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={s.label}>Role</div>
          <select style={{ ...s.input, appearance: 'none' }} value={role} onChange={e => setRole(e.target.value)}>
            <option value="">Select your role...</option>
            <option>Duty Manager</option>
            <option>Check-In Staff</option>
            <option>DCS Supervisor</option>
            <option>Ramp Supervisor</option>
            <option>Gate Agent</option>
            <option>Telex Operator</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={s.label}>Staff PIN</div>
          <input style={s.input} type="password" inputMode="numeric" placeholder="••••" maxLength={4} value={pin} onChange={e => setPin(e.target.value)} />
        </div>
        {err && <div style={{ color: C.redText, fontSize: 12, marginBottom: 8, textAlign: 'center' }}>{err}</div>}
        <button style={s.btn()} onClick={handleLogin}>Sign In →</button>
      </div>
      <div style={{ color: C.faint, fontSize: 11, marginTop: 16, textAlign: 'center' }}>
        Default PIN: 1234 · Contact supervisor to change
      </div>
    </div>
  );
}

function OverviewTab({ flight, setFlight, ci, gate, staff, onSave, saving, saved }) {
  const ciDone = Object.values(ci).filter(Boolean).length;
  const gateDone = Object.values(gate).filter(Boolean).length;
  const ciYes = Object.values(ci).filter(v => v === 'YES').length;
  const gateYes = Object.values(gate).filter(v => v === 'YES').length;

  return (
    <div>
      <div style={s.statGrid}>
        <div style={s.stat}><div style={s.statNum(C.blue)}>{ciYes}</div><div style={s.statLabel}>Check-In ✓</div></div>
        <div style={s.stat}><div style={s.statNum(C.green)}>{gateYes}</div><div style={s.statLabel}>Gate ✓</div></div>
        <div style={s.stat}><div style={s.statNum(C.amber)}>{ciDone}/{CHECK_IN_ITEMS.length}</div><div style={s.statLabel}>CI Progress</div></div>
        <div style={s.stat}><div style={s.statNum(C.blueText)}>{gateDone}/{GATE_ITEMS.length}</div><div style={s.statLabel}>Gate Progress</div></div>
      </div>

      <div style={s.card}>
        <div style={s.sectionTitle}>✈ Flight Details</div>
        <div style={s.row}>
          <div style={s.field}><div style={s.label}>Airline</div><input style={s.input} value={flight.airline} onChange={e => setFlight(f => ({ ...f, airline: e.target.value }))} /></div>
          <div style={s.field}><div style={s.label}>Flight No</div><input style={s.input} value={flight.flightNo} onChange={e => setFlight(f => ({ ...f, flightNo: e.target.value }))} /></div>
        </div>
        <div style={s.row}>
          <div style={s.field}><div style={s.label}>Date</div><input style={s.input} value={flight.date} onChange={e => setFlight(f => ({ ...f, date: e.target.value }))} /></div>
          <div style={s.field}><div style={s.label}>Shift</div>
            <select style={{ ...s.input, appearance: 'none' }} value={flight.shift} onChange={e => setFlight(f => ({ ...f, shift: e.target.value }))}>
              <option value="A">A</option><option value="B">B</option><option value="C">C</option>
            </select>
          </div>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.sectionTitle}>📋 Check-In Progress</div>
        <div style={s.progressBar((ciDone / CHECK_IN_ITEMS.length) * 100)} />
      </div>
      <div style={s.card}>
        <div style={s.sectionTitle}>🚪 Gate Progress</div>
        <div style={s.progressBar((gateDone / GATE_ITEMS.length) * 100, C.green)} />
      </div>

      <button style={s.btn(saved ? C.greenDim : C.blue, saved ? C.greenText : '#fff')} onClick={onSave} disabled={saving}>
        {saving ? '⏳ Saving...' : saved ? '✓ Saved to Database' : '💾 Save Record'}
      </button>
    </div>
  );
}

function StaffTab({ staff, setStaff, comments, setComments }) {
  return (
    <div>
      <div style={s.card}>
        <div style={s.sectionTitle}>👤 Staff Assignment</div>
        {STAFF_ROLES.map(({ key, label }) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <div style={s.label}>{label}</div>
            <input style={s.input} value={staff[key] || ''} placeholder={`Enter ${label}...`} onChange={e => setStaff(st => ({ ...st, [key]: e.target.value }))} />
          </div>
        ))}
      </div>
      <div style={s.card}>
        <div style={s.sectionTitle}>📝 Remarks</div>
        <textarea style={s.textarea} value={comments.remarks} onChange={e => setComments(c => ({ ...c, remarks: e.target.value }))} placeholder="Add remarks here..." />
      </div>
    </div>
  );
}

function EvalTab({ evals, setEvals }) {
  return (
    <div>
      <div style={s.card}>
        <div style={s.sectionTitle}>⭐ Staff Evaluation (1–6)</div>
        {EVAL_ROLES.map(role => (
          <div key={role} style={s.evalCard}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.blueText }}>{role}</div>
            <div style={s.scoreRow}>
              {[1,2,3,4,5,6].map(n => (
                <button key={n} style={s.scoreBtn(evals[role] === n)} onClick={() => setEvals(e => ({ ...e, [role]: e[role] === n ? null : n }))}>{n}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={s.card}>
        <div style={s.sectionTitle}>📊 Score Summary</div>
        {Object.entries(evals).filter(([,v]) => v).map(([role, score]) => (
          <div key={role} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}33`, fontSize: 13 }}>
            <span style={{ color: C.muted }}>{role}</span>
            <span style={{ fontFamily: C.mono, color: C.blue, fontWeight: 700 }}>{score}/6</span>
          </div>
        ))}
        {Object.values(evals).every(v => !v) && <div style={{ color: C.faint, fontSize: 12 }}>No scores entered yet.</div>}
      </div>
    </div>
  );
}

function HistoryTab({ user }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentRecords().then(r => { setRecords(r); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>Loading records...</div>;

  return (
    <div>
      <div style={{ ...s.sectionTitle, marginBottom: 12 }}>🗂 Recent Flight Records</div>
      {records.length === 0 && (
        <div style={{ ...s.card, textAlign: 'center', color: C.muted }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
          No records yet. Save your first flight record!
        </div>
      )}
      {records.map(r => (
        <div key={r.id} style={s.histCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: C.mono, color: C.blueText, fontWeight: 700, fontSize: 14 }}>{r.flight_no}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{r.airline} · {r.date}</div>
            </div>
            <div style={{ fontSize: 11, color: C.faint, textAlign: 'right' }}>
              <div>{r.submitted_by}</div>
              <div>{new Date(r.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', icon: '🏠', label: 'Overview' },
  { id: 'checkin',  icon: '📋', label: 'Check-In' },
  { id: 'gate',     icon: '🚪', label: 'Gate' },
  { id: 'staff',    icon: '👤', label: 'Staff' },
  { id: 'history',  icon: '🗂', label: 'History' },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('overview');
  const [flight, setFlight] = useState({ airline: 'Air Senegal', flightNo: 'HC1005', date: today(), shift: 'B' });
  const [ci, setCi] = useState(emptyCheckIn());
  const [gate, setGate] = useState(emptyGate());
  const [staff, setStaff] = useState({ duty_manager: 'Amie Faye', check_in_staff: 'Kaddy Ceesay / Adama Janneh', manifest_filling: 'Kaddy Ceesay', meeting_boarding: 'Adama Janneh / Kaddy Ceesay', dcs_supervisor: 'Bakary Dibba', lost_found: 'Adama / Charlotte', office_manning: '' });
  const [evals, setEvals] = useState(emptyEvals());
  const [comments, setComments] = useState({ checkIn: '', gate: '', remarks: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState(false);

  const handleCi = useCallback((id, val) => setCi(c => ({ ...c, [id]: val })), []);
  const handleGate = useCallback((id, val) => setGate(g => ({ ...g, [id]: val })), []);

  async function handleSave() {
    setSaving(true);
    try {
      const record = {
        flight_no: flight.flightNo,
        airline: flight.airline,
        date: flight.date,
        shift: flight.shift,
        check_in_data: ci,
        gate_data: gate,
        staff_data: staff,
        evaluations: evals,
        comments,
        submitted_by: user?.name || 'Unknown',
        submitted_role: user?.role || '',
      };
      await saveFlightRecord(record);
      setSaved(true);
      setToast(true);
      setTimeout(() => { setSaved(false); setToast(false); }, 3000);
    } catch (err) {
      alert('Save failed. Check your internet connection.\n\n' + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!user) return <LoginScreen onLogin={setUser} />;

  return (
    <div style={s.app}>
      {/* Toast */}
      <div style={s.toast(toast)}>✓ Record saved successfully</div>

      {/* Header */}
      <div style={s.header}>
        <div style={s.headerRow}>
          <div style={s.logoWrap}>
            <img src={GIA_LOGO} alt="GIA" style={s.logoIcon} />
            <div>
              <div style={s.logoText}>GIA Flight Ops</div>
              <div style={s.logoSub}>{user.name} · {user.role}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span style={s.pill()}>{flight.flightNo}</span>
            <span style={s.pill(C.greenDim, C.greenText)}>Shift {flight.shift}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={s.body}>
        {tab === 'overview' && <OverviewTab flight={flight} setFlight={setFlight} ci={ci} gate={gate} staff={staff} onSave={handleSave} saving={saving} saved={saved} />}
        {tab === 'checkin' && (
          <>
            <ChecklistSection title="Customer Services Check-In" icon="📋" items={CHECK_IN_ITEMS} values={ci} onChange={handleCi} />
            <div style={s.card}>
              <div style={s.label}>Comments</div>
              <textarea style={s.textarea} value={comments.checkIn} onChange={e => setComments(c => ({ ...c, checkIn: e.target.value }))} placeholder="Add check-in comments..." />
            </div>
          </>
        )}
        {tab === 'gate' && (
          <>
            <ChecklistSection title="Gate Operations" icon="🚪" items={GATE_ITEMS} values={gate} onChange={handleGate} />
            <div style={s.card}>
              <div style={s.label}>Comments</div>
              <textarea style={s.textarea} value={comments.gate} onChange={e => setComments(c => ({ ...c, gate: e.target.value }))} placeholder="Add gate comments..." />
            </div>
          </>
        )}
        {tab === 'staff'   && <StaffTab staff={staff} setStaff={setStaff} comments={comments} setComments={setComments} />}
        {tab === 'history' && <HistoryTab user={user} />}
        {tab === 'eval'    && <EvalTab evals={evals} setEvals={setEvals} />}
      </div>

      {/* Bottom Nav */}
      <nav style={s.navBar}>
        {TABS.map(t => (
          <button key={t.id} style={s.navBtn(tab === t.id)} onClick={() => setTab(t.id)}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
