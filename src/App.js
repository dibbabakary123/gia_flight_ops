/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { GIA_LOGO } from './lib/logo';
import db, { createFlight, getFlightsByShift, getAllFlights, updateFlight } from './lib/supabase';

// ── THEME ────────────────────────────────────────────────────────────
const C = {
  bg: '#0d1117', surface: '#161b26', border: '#1e2d3d',
  blue: '#3b82f6', blueDim: '#1e3a5f', blueText: '#93c5fd',
  green: '#22c55e', greenDim: '#14532d', greenText: '#4ade80',
  red: '#ef4444', redDim: '#450a0a', redText: '#f87171',
  amber: '#f59e0b', amberDim: '#451a03', amberText: '#fcd34d',
  text: '#e2e8f0', muted: '#64748b', faint: '#475569',
  mono: "'DM Mono', monospace", sans: "'DM Sans', sans-serif",
};

// ── CONSTANTS ────────────────────────────────────────────────────────
const SHIFTS = ['A', 'B', 'C', 'D'];
const MANAGER_ROLES = ['Duty Manager', 'DCS Supervisor'];
const ALL_ROLES = ['Duty Manager', 'DCS Supervisor', 'Check-In Staff', 'Gate Agent', 'Ramp Supervisor', 'Telex Operator', 'Lost & Found', 'Office Manning'];
const STAFF_PINS = { '1234': true, '5678': true, '0000': true, '9999': true };

const CHECK_IN_ITEMS = [
  { id: 'CI-1a', label: 'Stretcher advice received', time: 'STD-24H' },
  { id: 'CI-1b', label: 'MEDA advice received', time: 'STD-6H' },
  { id: 'CI-3',  label: 'Check-in staff requirements from airline received', time: 'STD-4H' },
  { id: 'CI-4',  label: 'Check-in staff briefed / Loaders / Docs', time: 'STD-3H15' },
  { id: 'CI-5',  label: 'Check-in counters opened', time: 'STD-3H' },
  { id: 'CI-6',  label: 'Special PAX handling counters informed (UM, Wheelchair)', time: 'STD-60' },
  { id: 'CI-7',  label: 'Ramp advised of last bag', time: 'STD-30' },
  { id: 'CI-8',  label: 'Check-in counters closed', time: 'STD-30' },
  { id: 'CI-9',  label: 'All sections informed of flight status', time: 'STD-20' },
  { id: 'CI-10', label: 'Baggage offload advice issued (cancelled PAX)' },
  { id: 'CI-11', label: 'Was flight re-opened by airline representative?' },
];

const GATE_ITEMS = [
  { id: 'GA-1', label: 'Two staff at the gate' },
  { id: 'GA-2', label: 'Immigration and security announcement — entry 15 min', time: 'STD-50' },
  { id: 'GA-3', label: 'Boarding clearance requested from cabin crew' },
  { id: 'GA-4', label: 'Boarding start upon approval', time: 'STD-35' },
  { id: 'GA-5', label: 'PAX informed on delays/cancellations every 30 min', time: 'STD-30' },
  { id: 'GA-6', label: 'Missing PAX identified', time: 'STD-25' },
];

// ── STYLES ───────────────────────────────────────────────────────────
const s = {
  app: { minHeight: '100vh', background: C.bg, fontFamily: C.sans, color: C.text, paddingBottom: 90 },
  header: { background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '12px 16px', position: 'sticky', top: 0, zIndex: 100 },
  headerRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  body: { padding: 16, maxWidth: 560, margin: '0 auto' },
  card: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 16px', marginBottom: 14 },
  cardTitle: { fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: C.blue, marginBottom: 14 },
  label: { fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: C.faint, marginBottom: 5, fontWeight: 600 },
  input: { width: '100%', background: C.bg, border: `1px solid ${C.blueDim}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontSize: 14, fontFamily: C.mono, outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', background: C.bg, border: `1px solid ${C.blueDim}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontSize: 14, outline: 'none', boxSizing: 'border-box', appearance: 'none' },
  textarea: { width: '100%', background: C.bg, border: `1px solid ${C.blueDim}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontSize: 14, outline: 'none', resize: 'vertical', minHeight: 70, boxSizing: 'border-box', fontFamily: C.sans },
  row: { display: 'flex', gap: 10, marginBottom: 12 },
  field: { flex: 1 },
  btn: (bg = C.blue, color = '#fff', full = true) => ({ background: bg, border: 'none', color, padding: '12px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: C.sans, width: full ? '100%' : 'auto', marginTop: 6 }),
  btnSm: (bg = C.blue, color = '#fff') => ({ background: bg, border: 'none', color, padding: '7px 14px', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: C.sans }),
  pill: (bg = C.blueDim, color = C.blueText) => ({ background: bg, color, border: `1px solid ${color}33`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontFamily: C.mono }),
  navBar: { position: 'fixed', bottom: 0, left: 0, right: 0, background: C.surface, borderTop: `1px solid ${C.border}`, display: 'flex', zIndex: 200 },
  navBtn: (active) => ({ flex: 1, padding: '10px 4px 14px', background: 'none', border: 'none', color: active ? C.blue : C.faint, fontFamily: C.sans, fontSize: 10, fontWeight: active ? 700 : 500, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }),
  ynBtn: (val, target) => ({ padding: '7px 12px', borderRadius: 7, border: `1px solid ${val === target ? (target === 'YES' ? C.green : C.red) : C.border}`, background: val === target ? (target === 'YES' ? C.greenDim : C.redDim) : C.bg, color: val === target ? (target === 'YES' ? C.greenText : C.redText) : C.faint, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: C.mono, marginRight: 4 }),
  checkRow: (i) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0', borderBottom: `1px solid ${C.border}22`, background: i % 2 === 0 ? 'transparent' : '#0d111744' }),
  flightCard: { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px', marginBottom: 10, cursor: 'pointer' },
  toast: (show) => ({ position: 'fixed', top: 70, left: '50%', transform: `translateX(-50%) translateY(${show ? 0 : -20}px)`, opacity: show ? 1 : 0, background: C.greenDim, border: `1px solid ${C.green}`, color: C.greenText, padding: '10px 22px', borderRadius: 20, fontWeight: 700, fontSize: 13, transition: 'all 0.3s', zIndex: 300, pointerEvents: 'none', whiteSpace: 'nowrap' }),
  progressBar: (pct, color = C.blue) => ({ height: 5, background: `linear-gradient(90deg, ${color} ${pct}%, ${C.border} ${pct}%)`, borderRadius: 3, marginTop: 6 }),
  statGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 },
  stat: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, textAlign: 'center' },
  statNum: (color = C.blue) => ({ fontSize: 26, fontWeight: 800, fontFamily: C.mono, color, lineHeight: 1 }),
  statLbl: { fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: C.faint, marginTop: 4, fontWeight: 600 },
  shiftBadge: (shift) => {
    const colors = { A: [C.blueDim, C.blueText], B: [C.greenDim, C.greenText], C: [C.amberDim, C.amberText], D: ['#3b0764', '#e9d5ff'] };
    const [bg, color] = colors[shift] || [C.blueDim, C.blueText];
    return { background: bg, color, border: `1px solid ${color}44`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontFamily: C.mono, fontWeight: 700 };
  },
};

// ── HELPERS ──────────────────────────────────────────────────────────
const today = () => new Date().toLocaleDateString('en-GB');
const emptyCI = () => Object.fromEntries(CHECK_IN_ITEMS.map(i => [i.id, null]));
const emptyGA = () => Object.fromEntries(GATE_ITEMS.map(i => [i.id, null]));

function pct(obj) {
  const vals = Object.values(obj);
  return Math.round((vals.filter(Boolean).length / vals.length) * 100);
}

// ── LOGIN SCREEN ─────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');

  function handle() {
    if (!name.trim()) return setErr('Please enter your name');
    if (!role) return setErr('Please select your role');
    if (!STAFF_PINS[pin]) return setErr('Invalid PIN — contact your supervisor');
    onLogin({ name: name.trim(), role });
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: C.sans }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <img src={GIA_LOGO} alt="GIA" style={{ height: 56, marginBottom: 12 }} />
        <div style={{ fontSize: 18, fontWeight: 800, color: C.blueText }}>GIA Flight Ops</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Gambia International Airlines Ltd</div>
      </div>
      <div style={{ ...s.card, width: '100%', maxWidth: 360 }}>
        <div style={s.cardTitle}>🔐 Staff Login</div>
        <div style={{ marginBottom: 12 }}>
          <div style={s.label}>Full Name</div>
          <input style={s.input} placeholder="e.g. Amie Faye" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={s.label}>Role</div>
          <select style={s.select} value={role} onChange={e => setRole(e.target.value)}>
            <option value="">Select your role...</option>
            {ALL_ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={s.label}>PIN</div>
          <input style={s.input} type="password" inputMode="numeric" placeholder="••••" maxLength={4} value={pin} onChange={e => setPin(e.target.value)} onKeyDown={e => e.key === 'Enter' && handle()} />
        </div>
        {err && <div style={{ color: C.redText, fontSize: 12, marginBottom: 8, textAlign: 'center' }}>{err}</div>}
        <button style={s.btn()} onClick={handle}>Sign In →</button>
      </div>
      <div style={{ color: C.faint, fontSize: 11, marginTop: 12 }}>Default PIN: 1234</div>
    </div>
  );
}

// ── CREATE FLIGHT FORM ───────────────────────────────────────────────
function CreateFlightForm({ user, onCreated, onCancel }) {
  const [form, setForm] = useState({
    flight_no: '', airline: '', date: today(), std: '', shift: '',
    duty_manager: '', dcs_supervisor: '', check_in_staff: '',
    gate_agent: '', ramp_supervisor: '', telex_operator: '',
    lost_found: '', office_manning: '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleCreate() {
    if (!form.flight_no.trim()) return setErr('Flight number is required');
    if (!form.airline.trim()) return setErr('Airline is required');
    if (!form.shift) return setErr('Shift is required');
    if (!form.std.trim()) return setErr('STD time is required');
    setSaving(true);
    setErr('');
    try {
      const flight = {
        ...form,
        check_in_data: emptyCI(),
        gate_data: emptyGA(),
        comments_ci: '', comments_gate: '', remarks: '',
        created_by: user.name,
        status: 'active',
      };
      const created = await createFlight(flight);
      onCreated(created);
    } catch (e) {
      setErr('Failed to create flight: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={s.body}>
      <div style={s.card}>
        <div style={s.cardTitle}>✈ Flight Details</div>
        <div style={s.row}>
          <div style={s.field}>
            <div style={s.label}>Flight No *</div>
            <input style={s.input} placeholder="HC1005" value={form.flight_no} onChange={e => set('flight_no', e.target.value.toUpperCase())} />
          </div>
          <div style={s.field}>
            <div style={s.label}>Airline *</div>
            <input style={s.input} placeholder="Air Senegal" value={form.airline} onChange={e => set('airline', e.target.value)} />
          </div>
        </div>
        <div style={s.row}>
          <div style={s.field}>
            <div style={s.label}>Date *</div>
            <input style={s.input} value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
          <div style={s.field}>
            <div style={s.label}>STD *</div>
            <input style={s.input} placeholder="14:30" value={form.std} onChange={e => set('std', e.target.value)} />
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={s.label}>Shift *</div>
          <select style={s.select} value={form.shift} onChange={e => set('shift', e.target.value)}>
            <option value="">Select shift...</option>
            {SHIFTS.map(sh => <option key={sh}>Shift {sh}</option>)}
          </select>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>👤 Staff Assignment</div>
        {[
          ['duty_manager', 'Duty Manager'],
          ['dcs_supervisor', 'DCS Supervisor'],
          ['check_in_staff', 'Check-In Staff'],
          ['gate_agent', 'Gate Agent'],
          ['ramp_supervisor', 'Ramp Supervisor'],
          ['telex_operator', 'Telex Operator'],
          ['lost_found', 'Lost & Found'],
          ['office_manning', 'Office Manning'],
        ].map(([key, label]) => (
          <div key={key} style={{ marginBottom: 10 }}>
            <div style={s.label}>{label}</div>
            <input style={s.input} placeholder={`Enter ${label} name...`} value={form[key]} onChange={e => set(key, e.target.value)} />
          </div>
        ))}
      </div>

      {err && <div style={{ color: C.redText, fontSize: 13, marginBottom: 10, textAlign: 'center', padding: '10px', background: C.redDim, borderRadius: 8 }}>{err}</div>}

      <button style={s.btn()} onClick={handleCreate} disabled={saving}>
        {saving ? '⏳ Creating Flight...' : '✈ Create Flight'}
      </button>
      <button style={{ ...s.btn(C.border, C.muted), marginTop: 8 }} onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}

// ── FLIGHT LIST ──────────────────────────────────────────────────────
function FlightList({ user, onSelectFlight }) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const isManager = MANAGER_ROLES.includes(user.role);

  useEffect(() => {
    const load = isManager ? getAllFlights() : getFlightsByShift(
      SHIFTS.map(s => `Shift ${s}`).find(s => s) || ''
    );
    // Staff see all shifts but we keep this for future per-shift filtering
    getAllFlights().then(f => { setFlights(f); setLoading(false); }).catch(() => setLoading(false));
  }, [isManager]);

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>Loading flights...</div>;

  return (
    <div>
      {flights.length === 0 ? (
        <div style={{ ...s.card, textAlign: 'center', color: C.muted, padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>✈</div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>No flights yet</div>
          <div style={{ fontSize: 12 }}>
            {isManager ? 'Create a flight using the + button below' : 'No flights have been assigned yet'}
          </div>
        </div>
      ) : (
        flights.map(f => {
          const ciPct = pct(f.check_in_data || {});
          const gaPct = pct(f.gate_data || {});
          return (
            <div key={f.id} style={s.flightCard} onClick={() => onSelectFlight(f)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontFamily: C.mono, fontWeight: 700, fontSize: 16, color: C.blueText }}>{f.flight_no}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{f.airline} · {f.date} · STD {f.std}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={s.shiftBadge(f.shift?.replace('Shift ', ''))}>{f.shift}</span>
                  <span style={{ ...s.pill(f.status === 'closed' ? C.redDim : C.greenDim, f.status === 'closed' ? C.redText : C.greenText), fontSize: 10 }}>
                    {f.status === 'closed' ? 'CLOSED' : 'ACTIVE'}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: C.faint, marginBottom: 2 }}>CHECK-IN {ciPct}%</div>
                  <div style={s.progressBar(ciPct)}></div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: C.faint, marginBottom: 2 }}>GATE {gaPct}%</div>
                  <div style={s.progressBar(gaPct, C.green)}></div>
                </div>
              </div>
              {f.duty_manager && <div style={{ fontSize: 11, color: C.faint, marginTop: 8 }}>DM: {f.duty_manager} · DCS: {f.dcs_supervisor}</div>}
            </div>
          );
        })
      )}
    </div>
  );
}

// ── FLIGHT DETAIL ────────────────────────────────────────────────────
function FlightDetail({ flight: initialFlight, user, onBack, showToast }) {
  const [flight, setFlight] = useState(initialFlight);
  const [tab, setTab] = useState('checkin');
  const [saving, setSaving] = useState(false);
  const isManager = MANAGER_ROLES.includes(user.role);

  const ciDone = Object.values(flight.check_in_data || {}).filter(Boolean).length;
  const gaDone = Object.values(flight.gate_data || {}).filter(Boolean).length;

  function setCI(id, val) {
    setFlight(f => ({ ...f, check_in_data: { ...f.check_in_data, [id]: val } }));
  }
  function setGA(id, val) {
    setFlight(f => ({ ...f, gate_data: { ...f.gate_data, [id]: val } }));
  }

  async function save() {
    setSaving(true);
    try {
      await updateFlight(flight.id, {
        check_in_data: flight.check_in_data,
        gate_data: flight.gate_data,
        comments_ci: flight.comments_ci,
        comments_gate: flight.comments_gate,
        remarks: flight.remarks,
      });
      showToast('✓ Saved successfully');
    } catch (e) {
      showToast('❌ Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function closeFlight() {
    if (!window.confirm('Close this flight? This cannot be undone.')) return;
    await updateFlight(flight.id, { status: 'closed' });
    setFlight(f => ({ ...f, status: 'closed' }));
    showToast('Flight closed');
  }

  const DETAIL_TABS = [
    { id: 'checkin', label: 'Check-In', icon: '📋' },
    { id: 'gate', label: 'Gate', icon: '🚪' },
    { id: 'staff', label: 'Staff', icon: '👤' },
  ];

  return (
    <div>
      {/* Flight header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.blue, fontSize: 20, cursor: 'pointer', padding: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: C.mono, fontWeight: 800, fontSize: 18, color: C.blueText }}>{flight.flight_no}</span>
              <span style={s.shiftBadge(flight.shift?.replace('Shift ', ''))}>{flight.shift}</span>
              <span style={{ ...s.pill(flight.status === 'closed' ? C.redDim : C.greenDim, flight.status === 'closed' ? C.redText : C.greenText), fontSize: 10 }}>
                {flight.status === 'closed' ? 'CLOSED' : 'ACTIVE'}
              </span>
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{flight.airline} · {flight.date} · STD {flight.std}</div>
          </div>
        </div>
        {/* Sub-tabs */}
        <div style={{ display: 'flex', gap: 4 }}>
          {DETAIL_TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '6px 14px', background: tab === t.id ? C.blueDim : 'transparent', border: `1px solid ${tab === t.id ? C.blue : C.border}`, borderRadius: 8, color: tab === t.id ? C.blueText : C.faint, fontSize: 12, fontWeight: tab === t.id ? 700 : 500, cursor: 'pointer', fontFamily: C.sans }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={s.body}>
        {/* CHECK-IN TAB */}
        {tab === 'checkin' && (
          <>
            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={s.cardTitle}>📋 Check-In Checklist</div>
                <span style={{ fontSize: 11, color: C.muted }}>{ciDone}/{CHECK_IN_ITEMS.length}</span>
              </div>
              <div style={s.progressBar((ciDone / CHECK_IN_ITEMS.length) * 100)}></div>
              <div style={{ marginTop: 12 }}>
                {CHECK_IN_ITEMS.map((item, i) => (
                  <div key={item.id} style={s.checkRow(i)}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: C.text, lineHeight: 1.4 }}>{item.label}</div>
                      {item.time && <div style={{ fontSize: 10, color: C.muted, fontFamily: C.mono, marginTop: 1 }}>{item.time}</div>}
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      <button style={s.ynBtn((flight.check_in_data || {})[item.id], 'YES')} onClick={() => setCI(item.id, (flight.check_in_data || {})[item.id] === 'YES' ? null : 'YES')}>YES</button>
                      <button style={s.ynBtn((flight.check_in_data || {})[item.id], 'NO')} onClick={() => setCI(item.id, (flight.check_in_data || {})[item.id] === 'NO' ? null : 'NO')}>NO</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={s.card}>
              <div style={s.label}>Comments</div>
              <textarea style={s.textarea} value={flight.comments_ci || ''} onChange={e => setFlight(f => ({ ...f, comments_ci: e.target.value }))} placeholder="Check-in comments..." />
            </div>
          </>
        )}

        {/* GATE TAB */}
        {tab === 'gate' && (
          <>
            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={s.cardTitle}>🚪 Gate Checklist</div>
                <span style={{ fontSize: 11, color: C.muted }}>{gaDone}/{GATE_ITEMS.length}</span>
              </div>
              <div style={s.progressBar((gaDone / GATE_ITEMS.length) * 100, C.green)}></div>
              <div style={{ marginTop: 12 }}>
                {GATE_ITEMS.map((item, i) => (
                  <div key={item.id} style={s.checkRow(i)}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: C.text, lineHeight: 1.4 }}>{item.label}</div>
                      {item.time && <div style={{ fontSize: 10, color: C.muted, fontFamily: C.mono, marginTop: 1 }}>{item.time}</div>}
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      <button style={s.ynBtn((flight.gate_data || {})[item.id], 'YES')} onClick={() => setGA(item.id, (flight.gate_data || {})[item.id] === 'YES' ? null : 'YES')}>YES</button>
                      <button style={s.ynBtn((flight.gate_data || {})[item.id], 'NO')} onClick={() => setGA(item.id, (flight.gate_data || {})[item.id] === 'NO' ? null : 'NO')}>NO</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={s.card}>
              <div style={s.label}>Comments</div>
              <textarea style={s.textarea} value={flight.comments_gate || ''} onChange={e => setFlight(f => ({ ...f, comments_gate: e.target.value }))} placeholder="Gate comments..." />
            </div>
          </>
        )}

        {/* STAFF TAB */}
        {tab === 'staff' && (
          <div style={s.card}>
            <div style={s.cardTitle}>👤 Staff Assignment</div>
            {[
              ['duty_manager', 'Duty Manager'],
              ['dcs_supervisor', 'DCS Supervisor'],
              ['check_in_staff', 'Check-In Staff'],
              ['gate_agent', 'Gate Agent'],
              ['ramp_supervisor', 'Ramp Supervisor'],
              ['telex_operator', 'Telex Operator'],
              ['lost_found', 'Lost & Found'],
              ['office_manning', 'Office Manning'],
            ].map(([key, label]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}22` }}>
                <div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: C.faint, fontWeight: 700, width: 120 }}>{label}</div>
                <div style={{ fontSize: 13, color: flight[key] ? C.blueText : C.faint, fontWeight: flight[key] ? 600 : 400 }}>{flight[key] || '—'}</div>
              </div>
            ))}
            <div style={{ marginTop: 14 }}>
              <div style={s.label}>Remarks</div>
              <textarea style={s.textarea} value={flight.remarks || ''} onChange={e => setFlight(f => ({ ...f, remarks: e.target.value }))} placeholder="Remarks..." />
            </div>
          </div>
        )}

        {/* SAVE BUTTON */}
        {flight.status !== 'closed' && (
          <button style={s.btn()} onClick={save} disabled={saving}>
            {saving ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
        )}

        {/* CLOSE FLIGHT — managers only */}
        {isManager && flight.status !== 'closed' && (
          <button style={{ ...s.btn(C.redDim, C.redText), marginTop: 8 }} onClick={closeFlight}>
            🔒 Close Flight
          </button>
        )}
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('flights');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const isManager = user && MANAGER_ROLES.includes(user.role);

  function showToast(msg) {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  }

  function handleFlightCreated(flight) {
    setCreating(false);
    setRefreshKey(k => k + 1);
    showToast('✅ Flight created!');
    setSelectedFlight(flight);
  }

  if (!user) return <LoginScreen onLogin={setUser} />;

  return (
    <div style={s.app}>
      {/* Toast */}
      <div style={s.toast(toastVisible)}>{toast}</div>

      {/* Header — only show when not in flight detail */}
      {!selectedFlight && !creating && (
        <div style={s.header}>
          <div style={s.headerRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={GIA_LOGO} alt="GIA" style={{ height: 28 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.blueText, letterSpacing: 0.5 }}>GIA Flight Ops</div>
                <div style={{ fontSize: 10, color: C.muted }}>{user.name} · {user.role}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {isManager && tab === 'flights' && (
                <button style={s.btnSm()} onClick={() => setCreating(true)}>+ New Flight</button>
              )}
              <button style={s.btnSm(C.border, C.muted)} onClick={() => setUser(null)}>Sign Out</button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {creating ? (
        <CreateFlightForm user={user} onCreated={handleFlightCreated} onCancel={() => setCreating(false)} />
      ) : selectedFlight ? (
        <FlightDetail flight={selectedFlight} user={user} onBack={() => { setSelectedFlight(null); setRefreshKey(k => k + 1); }} showToast={showToast} />
      ) : (
        <div style={s.body}>
          {tab === 'flights' && (
            <>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 12, letterSpacing: 0.5 }}>
                {isManager ? 'All flights across all shifts' : `Showing all active flights`}
              </div>
              <FlightList key={refreshKey} user={user} onSelectFlight={setSelectedFlight} />
            </>
          )}
        </div>
      )}

      {/* Bottom Nav */}
      {!selectedFlight && !creating && (
        <nav style={s.navBar}>
          <button style={s.navBtn(tab === 'flights')} onClick={() => setTab('flights')}>
            <span style={{ fontSize: 20 }}>✈</span>
            <span>Flights</span>
          </button>
          {isManager && (
            <button style={s.navBtn(false)} onClick={() => setCreating(true)}>
              <span style={{ fontSize: 24, color: C.blue, fontWeight: 700 }}>+</span>
              <span>New Flight</span>
            </button>
          )}
          <button style={s.navBtn(false)} onClick={() => setUser(null)}>
            <span style={{ fontSize: 20 }}>👤</span>
            <span>Sign Out</span>
          </button>
        </nav>
      )}
    </div>
  );
}
