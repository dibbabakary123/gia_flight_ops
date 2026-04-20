export const CHECK_IN_ITEMS = [
  { id: 'CI-1a', label: 'Stretcher advice received', time: 'STD-24H' },
  { id: 'CI-1b', label: 'MEDA advice received', time: 'STD-6H' },
  { id: 'CI-3',  label: 'Check in staff requirements from airline received', time: 'STD-4H' },
  { id: 'CI-4',  label: 'Check in staff briefed / Loaders / Docs', time: 'STD-3H15' },
  { id: 'CI-5',  label: 'Check in counters opened', time: 'STD-3H' },
  { id: 'CI-6',  label: 'Special PAX handling counters informed (UM, Wheelchair, etc.)', time: 'STD-60' },
  { id: 'CI-7',  label: 'Ramp advised of last bag', time: 'STD-30' },
  { id: 'CI-8',  label: 'Check in counters closed', time: 'STD-30' },
  { id: 'CI-9',  label: 'All sections informed of flight status (close, re-open, re-closed)', time: 'STD-20' },
  { id: 'CI-10', label: 'Baggage offload advice issued (cancelled PAX)' },
  { id: 'CI-11', label: 'Was flight re-opened by airline representative?' },
];

export const GATE_ITEMS = [
  { id: 'GA-1', label: 'Two staff at the gate' },
  { id: 'GA-2', label: 'Immigration and security announcement entry 15 min', time: 'STD-50' },
  { id: 'GA-3', label: 'Boarding clearance requested from cabin crew' },
  { id: 'GA-4', label: 'Boarding start upon approval', time: 'STD-35' },
  { id: 'GA-5', label: 'PAX informed on delays / cancellations and updated every 30 min', time: 'STD-30' },
  { id: 'GA-6', label: 'Missing PAX identified', time: 'STD-25' },
];

export const EVAL_ROLES = [
  'Duty Manager', 'Telex Operator', 'Load Sheet', 'Ramp Supervisor',
  'Check-In Duty Manager', 'C-Class', 'Y-Class', 'Lost & Found', 'DCS Supervisor',
];

export const STAFF_ROLES = [
  { key: 'duty_manager',      label: 'Duty Manager' },
  { key: 'check_in_staff',    label: 'Check-In Staff' },
  { key: 'manifest_filling',  label: 'Manifest / Filling' },
  { key: 'meeting_boarding',  label: 'Meeting & Boarding' },
  { key: 'dcs_supervisor',    label: 'DCS Supervisor' },
  { key: 'lost_found',        label: 'Lost & Found' },
  { key: 'office_manning',    label: 'Office Manning' },
];

export function emptyCheckIn() {
  return Object.fromEntries(CHECK_IN_ITEMS.map(i => [i.id, null]));
}
export function emptyGate() {
  return Object.fromEntries(GATE_ITEMS.map(i => [i.id, null]));
}
export function emptyEvals() {
  return Object.fromEntries(EVAL_ROLES.map(r => [r, null]));
}
