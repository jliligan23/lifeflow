'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { logoutAction } from '@/app/actions/auth'
import {
  changePasswordAction,
  editProfileAction,
  enroll2FAAction,
  verify2FAAction,
  disable2FAAction,
  updatePrivacyAction,
  type EditProfileData,
} from '@/app/actions/settings'

/* ─────────── Types ─────────── */
interface Profile {
  full_name: string | null
  blood_type: string | null
  barangay: string | null
  weight: number | null
  height: number | null
  on_medication: boolean | null
  preferred_donation_day: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  sms_alerts_enabled: boolean | null
  privacy_enabled: boolean | null
}

interface Props {
  profile: Profile | null
  email: string
  is2FAEnabled: boolean
}

/* ─────────── Icon Paths ─────────── */
const I = {
  back:     'M15 19l-7-7 7-7',
  eye:      'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  eyeOff:   'M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88',
  shield:   'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
  edit:     'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125',
  lock:     'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
  alert:    'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  policy:   'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z',
  info:     'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
  chevron:  'M9 5l7 7-7 7',
  out:      'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
  check:    'M4.5 12.75l6 6 9-13.5',
  x:        'M6 18L18 6M6 6l12 12',
  phone:    'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z',
}

const BARANGAYS = ['Abanao-Zandueta-Kayong-Chugum-Otek','Alfonso Tabora','Andres Bonifacio (Lower)','Andres Bonifacio (Upper)','Apugan-Loakan','Asin Road','Aurora Hill Proper','Aurora Hill North Central','Aurora Hill South Central','Baguio Batong Dalin','Bakakeng Central','Bakakeng North','BAL-Marcoville','Balitucan (Marcos Highway)','BGH Compound','Brookside','Buol Road','Burns Road','Cabinet Hill-Teacher\'s Camp','Camdas Subdivision','Camp 7','Camp 8','Camp Allen','Campo Filipino','City Camp Central','City Camp Proper','Country Club Village','Cresencia Village','Dagsian Lower','Dagsian Upper','Dizon Subdivision','Dominican Hill-Mirador','Dontogan','DPS Area','Engineers Hill','Fairview Village','Ferdinand (Marcos Highway)','Fort del Pilar','Gabriela Silang','General Luna Road','Gibraltar','Greenwater Village','Guisad Central','Guisad Sorong','Happy Hollow','Happy Homes-Campo Sioco','Harrison-Claudio Carantes','Hillside','Holy Ghost Extension','Holy Ghost Proper','Honeymoon (Honeymoon Road)','House of Providence','Imelda R. Marcos (La Salle)','Irisan','Kabayanihan','Kagitingan','Kayang Extension','Kayang-Hilltop','Kias','Legarda-Burnham-Kisad','Liwanag-Loakan','Loakan Proper','Lopez Jaena','Lourdes Subdivision Extension','Lourdes Subdivision Proper','Lower Rock Quarry','Lualhati','Lucban (Shuntug)','Lukban (Mindanao)','Luna-Bunikig','Magsaysay Private Road','Magsaysay Lower','Magsaysay Upper','Malcolm Square-Perfecto','Manuel A. Roxas','Market Subdivision Upper','MCA Area','Mines View Park','Modern Site East','Modern Site West','MRR-Queen of Peace','New Lucban','Outlook Drive','Pacdal','Pinsao Pilot Project','Pinsao Proper','Poliwes','Pucsusan','Quezon Hill Proper','Quezon Hill Upper','Quirino Hill East','Quirino Hill Lower','Quirino Hill Middle','Quirino Hill West','Quirino-Magsaysay-Prieto-Tabora','Rock Quarry Lower','Rock Quarry Middle','Rock Quarry Upper','Saint Joseph Village','Salud Mitra','San Antonio Village','San Luis Village','San Roque Village','San Vicente','Santo Rosario-Dunglo','Santo Tomas Proper','Santo Tomas School Area','Session Road Area','Slaughter House Area','SLU-SVP Housing Village','South Drive','Teodora Alonzo','Trancoville','Upper Dagsian','Upper Magsaysay','Upper Market Subdivision','Upper Rock Quarry','Upper Session Road','Victoria Village']

const BLOOD_TYPES = ['A+','A-','B+','B-','O+','O-','AB+','AB-']
const DONATION_DAYS = [
  { value: 'any',      label: 'Any day' },
  { value: 'weekdays', label: 'Weekdays (Mon–Fri)' },
  { value: 'weekends', label: 'Weekends (Sat–Sun)' },
]

/* ─────────── UI Atoms ─────────── */
function Icon({ path, className = 'w-5 h-5' }: { path: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  )
}

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button role="switch" aria-checked={checked} onClick={onChange} disabled={disabled}
      className={`relative flex h-[31px] w-[51px] shrink-0 cursor-pointer items-center rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${checked ? 'bg-[#2bee5b] justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'}`}>
      <span className="h-6 w-6 rounded-full bg-white shadow-md m-0.5 transition-all" />
    </button>
  )
}

function SlidePanel({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div className={`fixed inset-0 z-[300] transition-all duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-[#f6f8f6] dark:bg-[#102215] flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <header className="sticky top-0 z-10 bg-[#f6f8f6]/90 dark:bg-[#102215]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center p-4 justify-between max-w-md mx-auto">
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Icon path={I.back} className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
            <h1 className="text-lg font-bold flex-1 text-center text-slate-900 dark:text-slate-100">{title}</h1>
            <div className="w-10" />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

function Toast({ msg, type, onDone }: { msg: string; type: 'success' | 'error'; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) }, [onDone])
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[500] px-5 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm font-semibold text-white transition-all
      ${type === 'success' ? 'bg-[#2bee5b] text-[#0d1b11]' : 'bg-red-500'}`}>
      <Icon path={type === 'success' ? I.check : I.x} className="w-4 h-4" />
      {msg}
    </div>
  )
}

function FieldInput({ label, value, onChange, type = 'text', placeholder, error, suffix, hint }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
  placeholder?: string; error?: string; suffix?: string; hint?: string
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
      <div className="relative">
        <input
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-13 px-4 py-3.5 rounded-xl bg-white dark:bg-slate-800 border text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2bee5b] transition-all text-base ${suffix ? 'pr-16' : isPassword ? 'pr-12' : 'pr-4'} ${error ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-700'}`}
        />
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">{suffix}</span>}
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            <Icon path={show ? I.eyeOff : I.eye} className="w-5 h-5" />
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

function FieldSelect({ label, value, onChange, options, error }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; error?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className={`w-full h-13 px-4 py-3.5 rounded-xl bg-white dark:bg-slate-800 border text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2bee5b] transition-all text-base appearance-none cursor-pointer ${error ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`}>
        <option value="">Select…</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

function FormError({ msg }: { msg: string }) {
  return msg ? (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-3 flex items-center gap-2">
      <Icon path={I.x} className="w-4 h-4 text-red-500 shrink-0" />
      <p className="text-red-700 dark:text-red-400 text-sm">{msg}</p>
    </div>
  ) : null
}

function SubmitButton({ label, loading, disabled }: { label: string; loading: boolean; disabled?: boolean }) {
  return (
    <button type="submit" disabled={loading || disabled}
      className="w-full bg-[#2bee5b] text-[#0d1b11] font-bold py-4 rounded-xl shadow-lg shadow-[#2bee5b]/20 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
      {loading ? (
        <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving…</>
      ) : label}
    </button>
  )
}

/* ─────────── Change Password Panel ─────────── */
function ChangePasswordPanel({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const reqs = [
    { met: next.length >= 8,       label: 'At least 8 characters' },
    { met: /[A-Z]/.test(next),     label: '1 uppercase letter' },
    { met: /[0-9]/.test(next),     label: '1 number' },
    { met: next === confirm && !!confirm, label: 'Passwords match' },
  ]
  const allMet = reqs.every(r => r.met) && !!current

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const res = await changePasswordAction({ currentPassword: current, newPassword: next })
      if (res?.error) { setError(res.error); return }
      setCurrent(''); setNext(''); setConfirm('')
      onClose(); onSuccess()
    })
  }

  return (
    <SlidePanel open={open} onClose={onClose} title="Change Password">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto px-6 py-6 space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Enter your current password, then choose a new one. You'll stay logged in after changing.
        </p>

        <FormError msg={error} />

        <FieldInput label="Current Password" type="password" value={current} onChange={setCurrent} placeholder="Your current password" />
        <FieldInput label="New Password" type="password" value={next} onChange={setNext} placeholder="At least 8 characters" />
        <FieldInput label="Confirm New Password" type="password" value={confirm} onChange={setConfirm} placeholder="Repeat new password" />

        {next.length > 0 && (
          <ul className="space-y-1.5">
            {reqs.map(({ met, label }) => (
              <li key={label} className={`flex items-center gap-2 text-xs ${met ? 'text-[#2bee5b]' : 'text-slate-400'}`}>
                <Icon path={met ? I.check : I.x} className="w-3.5 h-3.5 shrink-0" />
                {label}
              </li>
            ))}
          </ul>
        )}

        <SubmitButton label="Update Password" loading={isPending} disabled={!allMet} />
      </form>
    </SlidePanel>
  )
}

/* ─────────── Edit Profile Panel ─────────── */
function EditProfilePanel({ open, onClose, onSuccess, profile, email }: {
  open: boolean; onClose: () => void; onSuccess: () => void; profile: Profile | null; email: string
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [f, setF] = useState({
    full_name:               profile?.full_name ?? '',
    blood_type:              profile?.blood_type ?? '',
    barangay:                profile?.barangay ?? '',
    weight:                  profile?.weight?.toString() ?? '',
    height:                  profile?.height?.toString() ?? '',
    on_medication:           profile?.on_medication ?? false,
    preferred_donation_day:  profile?.preferred_donation_day ?? 'any',
    emergency_contact_name:  profile?.emergency_contact_name ?? '',
    emergency_contact_phone: profile?.emergency_contact_phone ?? '',
    sms_alerts_enabled:      profile?.sms_alerts_enabled ?? true,
  })

  // Sync when profile changes
  useEffect(() => {
    if (profile) setF({
      full_name: profile.full_name ?? '',
      blood_type: profile.blood_type ?? '',
      barangay: profile.barangay ?? '',
      weight: profile.weight?.toString() ?? '',
      height: profile.height?.toString() ?? '',
      on_medication: profile.on_medication ?? false,
      preferred_donation_day: profile.preferred_donation_day ?? 'any',
      emergency_contact_name: profile.emergency_contact_name ?? '',
      emergency_contact_phone: profile.emergency_contact_phone ?? '',
      sms_alerts_enabled: profile.sms_alerts_enabled ?? true,
    })
  }, [profile])

  const set = (k: keyof typeof f) => (v: string | boolean) => setF(p => ({ ...p, [k]: v }))
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof typeof f, string>>>({})

  const validate = () => {
    const errs: typeof fieldErrors = {}
    if (!f.full_name.trim()) errs.full_name = 'Full name is required'
    if (!f.blood_type) errs.blood_type = 'Please select a blood type'
    if (!f.barangay) errs.barangay = 'Please select your barangay'
    const w = parseFloat(f.weight); if (isNaN(w) || w < 50) errs.weight = 'Must be at least 50 kg'
    const h = parseFloat(f.height); if (isNaN(h) || h < 100 || h > 250) errs.height = 'Must be 100–250 cm'
    if (!f.emergency_contact_name.trim()) errs.emergency_contact_name = 'Emergency contact name is required'
    if (!/^[0-9]{10,15}$/.test(f.emergency_contact_phone)) errs.emergency_contact_phone = 'Enter a valid 10–15 digit phone number'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    startTransition(async () => {
      const res = await editProfileAction({
        full_name: f.full_name,
        blood_type: f.blood_type as EditProfileData['blood_type'],
        barangay: f.barangay,
        weight: parseFloat(f.weight),
        height: parseFloat(f.height),
        on_medication: f.on_medication,
        preferred_donation_day: f.preferred_donation_day as EditProfileData['preferred_donation_day'],
        emergency_contact_name: f.emergency_contact_name,
        emergency_contact_phone: f.emergency_contact_phone,
        sms_alerts_enabled: f.sms_alerts_enabled,
      })
      if (res?.error) { setError(res.error); return }
      onClose(); onSuccess()
    })
  }

  const Section = ({ title }: { title: string }) => (
    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 pt-4 pb-1">{title}</p>
  )

  return (
    <SlidePanel open={open} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto px-6 py-4 space-y-4 pb-10">

        <FormError msg={error} />

        {/* Account info (read-only) */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Email (cannot be changed)</p>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{email}</p>
        </div>

        <Section title="Personal Info" />
        <FieldInput label="Full Name" value={f.full_name} onChange={set('full_name')} placeholder="Juan Dela Cruz" error={fieldErrors.full_name} />
        <FieldSelect label="Blood Type" value={f.blood_type} onChange={set('blood_type')} options={BLOOD_TYPES.map(b => ({ value: b, label: b }))} error={fieldErrors.blood_type} />
        <FieldSelect label="Barangay" value={f.barangay} onChange={set('barangay')} options={BARANGAYS.map(b => ({ value: b, label: b }))} error={fieldErrors.barangay} />

        <Section title="Health Stats" />
        <div className="grid grid-cols-2 gap-3">
          <FieldInput label="Weight" value={f.weight} onChange={set('weight')} type="number" placeholder="70" suffix="kg" error={fieldErrors.weight} />
          <FieldInput label="Height" value={f.height} onChange={set('height')} type="number" placeholder="170" suffix="cm" error={fieldErrors.height} />
        </div>

        {/* Medication toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">On Medication</p>
            <p className="text-xs text-slate-400 mt-0.5">Currently taking prescription medicine?</p>
          </div>
          <Toggle checked={f.on_medication} onChange={() => set('on_medication')(!f.on_medication)} />
        </div>

        <Section title="Availability" />
        <FieldSelect label="Preferred Donation Day" value={f.preferred_donation_day} onChange={set('preferred_donation_day')} options={DONATION_DAYS} />

        <Section title="Emergency Contact" />
        <FieldInput label="Contact Name" value={f.emergency_contact_name} onChange={set('emergency_contact_name')} placeholder="e.g. Maria Santos" error={fieldErrors.emergency_contact_name} />
        <FieldInput label="Phone Number" value={f.emergency_contact_phone} onChange={set('emergency_contact_phone')} type="tel" placeholder="09XXXXXXXXX" hint="Digits only, no spaces or dashes" error={fieldErrors.emergency_contact_phone} />

        {/* SMS Alerts toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">SMS Alerts</p>
            <p className="text-xs text-slate-400 mt-0.5">Receive urgent blood request notifications</p>
          </div>
          <Toggle checked={f.sms_alerts_enabled} onChange={() => set('sms_alerts_enabled')(!f.sms_alerts_enabled)} />
        </div>

        <SubmitButton label="Save Changes" loading={isPending} />
      </form>
    </SlidePanel>
  )
}

/* ─────────── 2FA Panel ─────────── */
type TwoFAStep = 'status' | 'setup' | 'verify' | 'disable'

function TwoFAPanel({ open, onClose, onSuccess, initiallyEnabled }: {
  open: boolean; onClose: () => void; onSuccess: (enabled: boolean) => void; initiallyEnabled: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState<TwoFAStep>('status')
  const [error, setError] = useState('')
  const [factorId, setFactorId] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [code, setCode] = useState('')
  const [disableCode, setDisableCode] = useState('')

  // Reset on open
  useEffect(() => {
    if (open) { setStep('status'); setError(''); setCode(''); setDisableCode('') }
  }, [open])

  const startSetup = () => {
    setError('')
    startTransition(async () => {
      const res = await enroll2FAAction()
      if (res?.error) { setError(res.error); return }
      if (!res.factorId || !res.qrCode || !res.secret) { setError('Failed to generate QR code. Please try again.'); return }
      setFactorId(res.factorId)
      setQrCode(res.qrCode)
      setSecret(res.secret)
      setStep('setup')
    })
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.replace(/\s/g, '').length !== 6) { setError('Please enter the 6-digit code from your app.'); return }
    setError('')
    startTransition(async () => {
      const res = await verify2FAAction({ factorId, code })
      if (res?.error) { setError(res.error); return }
      setStep('status')
      onClose(); onSuccess(true)
    })
  }

  const handleDisable = (e: React.FormEvent) => {
    e.preventDefault()
    if (disableCode.replace(/\s/g, '').length !== 6) { setError('Please enter the 6-digit code from your app.'); return }
    setError('')
    startTransition(async () => {
      const res = await disable2FAAction({ code: disableCode })
      if (res?.error) { setError(res.error); return }
      setStep('status')
      onClose(); onSuccess(false)
    })
  }

  const CodeInput = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <input
      type="text"
      inputMode="numeric"
      maxLength={7}
      value={value}
      onChange={e => onChange(e.target.value.replace(/[^0-9 ]/g, ''))}
      placeholder="000 000"
      className="w-full h-16 text-center text-3xl font-black tracking-[0.5em] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2bee5b] transition-all"
    />
  )

  return (
    <SlidePanel open={open} onClose={onClose} title="Two-Factor Authentication">
      <div className="max-w-md mx-auto px-6 py-6 space-y-5">

        <FormError msg={error} />

        {/* ── STATUS view ── */}
        {step === 'status' && (
          <>
            {/* Status card */}
            <div className={`rounded-xl p-5 border flex items-start gap-4 ${initiallyEnabled
              ? 'bg-[#2bee5b]/5 border-[#2bee5b]/20'
              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${initiallyEnabled ? 'bg-[#2bee5b]/10' : 'bg-slate-100 dark:bg-slate-700'}`}>
                <Icon path={I.shield} className={`w-6 h-6 ${initiallyEnabled ? 'text-[#2bee5b]' : 'text-slate-400'}`} />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {initiallyEnabled ? '2FA is Enabled' : '2FA is Disabled'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {initiallyEnabled
                    ? 'Your account is protected with an authenticator app.'
                    : 'Add an extra layer of security to your account.'}
                </p>
              </div>
            </div>

            {/* How it works */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">How it works</p>
              {[
                { n: '1', text: 'Install an authenticator app (Google Authenticator, Authy, etc.)' },
                { n: '2', text: 'Scan the QR code or enter the secret key in your app' },
                { n: '3', text: 'Enter the 6-digit code every time you log in' },
              ].map(({ n, text }) => (
                <div key={n} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#2bee5b]/10 text-[#2bee5b] text-xs font-black flex items-center justify-center shrink-0">{n}</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">{text}</p>
                </div>
              ))}
            </div>

            {initiallyEnabled ? (
              <button onClick={() => { setError(''); setDisableCode(''); setStep('disable') }}
                className="w-full py-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold border border-red-100 dark:border-red-900/30 flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                Disable Two-Factor Authentication
              </button>
            ) : (
              <button onClick={startSetup} disabled={isPending}
                className="w-full bg-[#2bee5b] text-[#0d1b11] font-bold py-4 rounded-xl shadow-lg shadow-[#2bee5b]/20 active:scale-[0.98] transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                {isPending ? (<><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Setting up…</>) : 'Enable Two-Factor Authentication'}
              </button>
            )}
          </>
        )}

        {/* ── SETUP view (QR code) ── */}
        {step === 'setup' && (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Scan the QR code below with your authenticator app. If you can't scan, enter the secret key manually.
            </p>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              {qrCode ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 rounded-lg" />
              ) : (
                <div className="w-48 h-48 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <svg className="animate-spin w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                </div>
              )}
              <div className="text-center w-full">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Manual entry key</p>
                <div className="bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-2 font-mono text-xs text-slate-700 dark:text-slate-300 break-all select-all">{secret}</div>
              </div>
            </div>

            <button onClick={() => setStep('verify')}
              className="w-full bg-[#2bee5b] text-[#0d1b11] font-bold py-4 rounded-xl shadow-lg shadow-[#2bee5b]/20 active:scale-[0.98] transition-all">
              I've scanned the code →
            </button>
          </>
        )}

        {/* ── VERIFY view ── */}
        {step === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#2bee5b]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon path={I.shield} className="w-8 h-8 text-[#2bee5b]" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Open your authenticator app and enter the 6-digit code shown for LifeFlow Baguio.
              </p>
            </div>

            <CodeInput value={code} onChange={setCode} />

            <SubmitButton label="Verify & Enable 2FA" loading={isPending} disabled={code.replace(/\s/g,'').length !== 6} />

            <button type="button" onClick={() => setStep('setup')} className="w-full py-3 text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
              ← Back to QR Code
            </button>
          </form>
        )}

        {/* ── DISABLE view ── */}
        {step === 'disable' && (
          <form onSubmit={handleDisable} className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4">
              <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed font-medium">
                ⚠️ Disabling 2FA will make your account less secure. You'll need to enter the current code from your app to confirm.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Enter your current authenticator code to disable 2FA:</p>
              <CodeInput value={disableCode} onChange={setDisableCode} />
            </div>

            <button type="submit" disabled={isPending || disableCode.replace(/\s/g,'').length !== 6}
              className="w-full py-4 rounded-xl bg-red-500 text-white font-bold border border-red-600 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              {isPending ? (<><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Disabling…</>) : 'Disable 2FA'}
            </button>

            <button type="button" onClick={() => setStep('status')} className="w-full py-3 text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
              ← Cancel
            </button>
          </form>
        )}

      </div>
    </SlidePanel>
  )
}

/* ─────────── Privacy Policy Panel ─────────── */
function PrivacyPolicyPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <SlidePanel open={open} onClose={onClose} title="Data Privacy Policy">
      <div className="max-w-md mx-auto px-6 py-6 space-y-5">
        <div className="flex flex-col items-center gap-2 pb-2">
          <div className="w-16 h-16 bg-[#2bee5b]/10 rounded-full flex items-center justify-center">
            <Icon path={I.policy} className="w-8 h-8 text-[#2bee5b]" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">RA 10173 Compliance</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">Republic Act No. 10173 — Data Privacy Act of 2012</p>
        </div>
        {[
          { title: 'What We Collect', body: 'We collect your name, blood type, weight, height, medication status, barangay, emergency contact, and donation history. This information is necessary to facilitate blood donation services in Baguio City.' },
          { title: 'How We Use It', body: 'Your data is used solely for donor registration and verification, urgent blood requirement notifications, and awareness campaigns for blood drives in Baguio City.' },
          { title: 'Who Can See It', body: 'Your information is only visible to licensed blood banks and medical staff in Baguio City when you explicitly share your Digital Donor ID. Phone numbers are hidden by default.' },
          { title: 'Your Rights', body: 'Under RA 10173, you have the right to access, correct, erase, or port your personal data. You may withdraw consent at any time by contacting us or deleting your account.' },
          { title: 'Data Retention', body: 'Donation records are retained for a minimum of 5 years as required by the DOH. Personal profile data is deleted within 30 days upon account deletion request.' },
          { title: 'Security', body: 'All data is encrypted at rest and in transit using AES-256 encryption. We do not sell, trade, or transfer your information to outside parties.' },
        ].map(({ title, body }) => (
          <div key={title}>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2bee5b] shrink-0" />{title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pl-3.5">{body}</p>
          </div>
        ))}
        <div className="bg-[#2bee5b]/5 border border-[#2bee5b]/20 rounded-xl p-4">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            For questions, contact the National Privacy Commission at <strong>complaints@privacy.gov.ph</strong> or the LifeFlow DPO at <strong>dpo@lifeflowbaguio.ph</strong>.
          </p>
        </div>
      </div>
    </SlidePanel>
  )
}

/* ─────────── Main Settings Page ─────────── */
function SectionLabel({ label }: { label: string }) {
  return <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider px-4 pb-2 pt-6">{label}</h3>
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-white dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800 divide-y divide-slate-50 dark:divide-slate-800/50">{children}</div>
}

function ToggleRow({ icon, label, sub, checked, onChange, loading }: { icon: string; label: string; sub?: string; checked: boolean; onChange: () => void; loading?: boolean }) {
  return (
    <div className="flex items-start gap-4 px-4 py-4 justify-between">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="text-[#2bee5b] flex items-center justify-center rounded-lg bg-[#2bee5b]/10 shrink-0 w-10 h-10 mt-0.5">
          <Icon path={icon} />
        </div>
        <div>
          <p className="text-slate-900 dark:text-slate-100 text-base font-medium">{label}</p>
          {sub && <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-snug">{sub}</p>}
        </div>
      </div>
      <div className="pt-1"><Toggle checked={checked} onChange={onChange} disabled={loading} /></div>
    </div>
  )
}

function NavRow({ icon, label, sub, rightText, rightBadge, onClick }: { icon: string; label: string; sub?: string; rightText?: string; rightBadge?: { label: string; green: boolean }; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-4 px-4 py-4 justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 active:bg-slate-100 dark:active:bg-slate-800 transition-colors text-left">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="text-[#2bee5b] flex items-center justify-center rounded-lg bg-[#2bee5b]/10 shrink-0 w-10 h-10">
          <Icon path={icon} />
        </div>
        <div>
          <p className="text-slate-900 dark:text-slate-100 text-base font-medium">{label}</p>
          {sub && <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{sub}</p>}
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        {rightBadge && (
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${rightBadge.green ? 'bg-[#2bee5b]/10 text-[#2bee5b]' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
            {rightBadge.label}
          </span>
        )}
        {rightText && <span className="text-slate-400 text-sm font-medium">{rightText}</span>}
        {!rightText && <Icon path={I.chevron} className="w-5 h-5 text-slate-400" />}
      </div>
    </button>
  )
}

export default function SettingsClient({ profile, email, is2FAEnabled }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Panel visibility
  const [showPassword,  setShowPassword]  = useState(false)
  const [showEdit,      setShowEdit]      = useState(false)
  const [show2FA,       setShow2FA]       = useState(false)
  const [showPolicy,    setShowPolicy]    = useState(false)

  // Local state
  const [showNumber,    setShowNumber]    = useState(profile?.privacy_enabled ?? false)
  const [urgentAlerts,  setUrgentAlerts]  = useState(profile?.sms_alerts_enabled ?? true)
  const [twoFAEnabled,  setTwoFAEnabled]  = useState(is2FAEnabled)

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => setToast({ msg, type })

  const handleShowNumber = () => {
    const next = !showNumber
    setShowNumber(next)
    startTransition(async () => {
      const res = await updatePrivacyAction({ show_number: next })
      if (res?.error) { setShowNumber(!next); showToast(res.error, 'error') }
    })
  }

  return (
    <>
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      {/* ── Slide-over Panels ── */}
      <ChangePasswordPanel
        open={showPassword}
        onClose={() => setShowPassword(false)}
        onSuccess={() => showToast('Password updated successfully!')}
      />
      <EditProfilePanel
        open={showEdit}
        onClose={() => setShowEdit(false)}
        onSuccess={() => { showToast('Profile saved successfully!'); router.refresh() }}
        profile={profile}
        email={email}
      />
      <TwoFAPanel
        open={show2FA}
        onClose={() => setShow2FA(false)}
        onSuccess={(enabled) => {
          setTwoFAEnabled(enabled)
          showToast(enabled ? '2FA enabled! Your account is now more secure.' : '2FA has been disabled.')
        }}
        initiallyEnabled={twoFAEnabled}
      />
      <PrivacyPolicyPanel open={showPolicy} onClose={() => setShowPolicy(false)} />

      {/* ── Main Page ── */}
      <div className="text-slate-900 dark:text-slate-100 min-h-screen bg-[#f6f8f6] dark:bg-[#102215]">
        <header className="sticky top-0 z-50 bg-[#f6f8f6]/80 dark:bg-[#102215]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center p-4 justify-between max-w-md mx-auto">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Icon path={I.back} className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
            <h1 className="text-lg font-bold flex-1 text-center">Settings &amp; Privacy</h1>
            <div className="w-10" />
          </div>
        </header>

        <main className="max-w-md mx-auto pb-24">

          <SectionLabel label="Privacy & Security" />
          <SectionCard>
            <ToggleRow
              icon={I.eye}
              label="Show my number to public"
              sub="Default is OFF. If ON, other users can see your contact number in search results."
              checked={showNumber}
              onChange={handleShowNumber}
              loading={isPending}
            />
            <NavRow
              icon={I.shield}
              label="Two-Factor Authentication"
              sub={twoFAEnabled ? 'Protect your login with an authenticator app' : 'Add an extra layer of security'}
              rightBadge={{ label: twoFAEnabled ? 'On' : 'Off', green: twoFAEnabled }}
              onClick={() => setShow2FA(true)}
            />
          </SectionCard>

          <SectionLabel label="Account Settings" />
          <SectionCard>
            <NavRow
              icon={I.edit}
              label="Edit Profile"
              sub="Update your personal and health information"
              onClick={() => setShowEdit(true)}
            />
            <NavRow
              icon={I.lock}
              label="Change Password"
              sub="Update your account password"
              onClick={() => setShowPassword(true)}
            />
          </SectionCard>

          <SectionLabel label="Notifications" />
          <SectionCard>
            <ToggleRow
              icon={I.alert}
              label="Urgent Alerts"
              sub="Baguio City blood shortage updates"
              checked={urgentAlerts}
              onChange={() => setUrgentAlerts(v => !v)}
            />
          </SectionCard>

          <SectionLabel label="App Info" />
          <SectionCard>
            <NavRow
              icon={I.policy}
              label="Data Privacy Policy"
              sub="Compliant with RA 10173"
              onClick={() => setShowPolicy(true)}
            />
            <NavRow
              icon={I.info}
              label="Version"
              rightText="v1.0.0"
            />
          </SectionCard>

          <section className="mt-8 px-4">
            <form action={logoutAction}>
              <button type="submit" className="w-full py-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold border border-red-100 dark:border-red-900/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-red-100 dark:hover:bg-red-900/30">
                <Icon path={I.out} className="w-5 h-5" />
                Sign Out
              </button>
            </form>
          </section>

        </main>
      </div>
    </>
  )
}
