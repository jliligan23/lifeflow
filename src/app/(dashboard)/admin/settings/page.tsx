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
import AdminBottomNav from '@/components/admin/AdminBottomNav'

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

const BARANGAYS = ['Abanao-Zandueta-Kayong-Chugum-Otek','Alfonso Tabora','Andres Bonifacio (Lower)','Andres Bonifacio (Upper)','Apugan-Loakan','Asin Road','Aurora Hill Proper','Aurora Hill North Central','Aurora Hill South Central','Baguio Batong Dalin','Bakakeng Central','Bakakeng North','BAL-Marcoville','Balitucan (Marcos Highway)','BGH Compound','Brookside','Buol Road','Burns Road','Cabinet Hill-Teacher\'s Camp','Camdas Subdivision','Camp 7','Camp 8','Camp Allen','Campo Filipino','City Camp Central','City Camp Proper','Country Club Village','Cresencia Village','Dagsian Lower','Dagsian Upper','Dizon Subdivision','Dominican Hill-Mirador','Dontogan','DPS Area','Engineers Hill','Fairview Village','Ferdinand (Marcos Highway)','Fort del Pilar','Gabriela Silang','General Luna Road','Gibraltar','Greenwater Village','Guisad Central','Guisad Sorong','Happy Hollow','Happy Homes-Campo Sioco','Harrison-Claudio Carantes','Hillside','Holy Ghost Extension','Holy Ghost Proper','Honeymoon (Honeymoon Road)','House of Providence','Imelda R. Marcos (La Salle)','Irisan','Kabayanihan','Kagitingan','Kayang Extension','Kayang-Hilltop','Kias','Legarda-Burnham-Kisad','Liwanag-Loakan','Loakan Proper','Lopez Jaena','Lourdes Subdivision Extension','Lourdes Subdivision Proper','Lower Rock Quarry','Lualhati','Lucban (Shuntug)','Lukban (Mindanao)','Luna-Bunikig','Magsaysay Private Road','Magsaysay Lower','Magsaysay Upper','Malcolm Square-Perfecto','Manuel A. Roxas','Market Subdivision Upper','MCA Area','Mines View Park','Modern Site East','Modern Site West','MRR-Queen of Peace','New Lucban','Outlook Drive','Pacdal','Pinsao Pilot Project','Pinsao Proper','Poliwes','Pucsusan','Quezon Hill Proper','Quezon Hill Upper','Quirino Hill East','Quirino Hill Lower','Quirino Hill Middle','Quirino Hill West','Quirino-Magsaysay-Prieto-Tabora','Rock Quarry Lower','Rock Quarry Middle','Rock Quarry Upper','Saint Joseph Village','Salud Mitra','San Antonio Village','San Luis Village','San Roque Village','San Vicente Village','Santo Niño (Lower)','Santo Niño (Upper)','Santo Rosario','Slaughterhouse Area','Speedzone','St. Joseph Village','Tacdian','T. Alonzo','Tejeros','Trancoville','Trinidad','Victoria Village','West Bayan Park','West Modernsite (Westside)','Wright Park']

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

        <AdminBottomNav />
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

/* ─────────── Admin Settings Page ─────────── */
export default function AdminSettingsPage() {
  const router = useRouter()
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  // Mock admin profile data
  const adminProfile: Profile = {
    full_name: 'Admin User',
    blood_type: 'O+',
    barangay: 'Baguio City Proper',
    weight: 70,
    height: 170,
    on_medication: false,
    preferred_donation_day: 'any',
    emergency_contact_name: 'Emergency Contact',
    emergency_contact_phone: '09123456789',
    sms_alerts_enabled: true,
    privacy_enabled: false,
  }

  const adminEmail = 'admin@lifeflow.com'
  const is2FAEnabled = false

  const handleToast = (msg: string, type: 'success' | 'error') => {
    setToastMsg(msg)
    setToastType(type)
    setShowToast(true)
  }

  const handleSignOut = async () => {
    try {
      await logoutAction()
      handleToast('Signed out successfully', 'success')
      router.push('/')
    } catch (error) {
      handleToast('Failed to sign out', 'error')
    }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative mx-auto max-w-[430px] min-h-screen bg-background-light dark:bg-background-dark flex flex-col shadow-2xl border-x border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#f8f6f6]/80 dark:bg-[#221013]/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Admin Settings</h1>
          <div className="w-10" />
        </div>

        {/* Settings Content */}
        <div className="p-4 space-y-4">
          {/* Account Section */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Account</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Email</p>
                  <p className="text-xs text-slate-500">{adminEmail}</p>
                </div>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <button className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Change Password</span>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Security</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500">Add an extra layer of security</p>
                </div>
                <Toggle checked={is2FAEnabled} onChange={() => {}} />
              </div>
              <button className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Session Management</span>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Notifications</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Email Notifications</p>
                  <p className="text-xs text-slate-500">Receive email alerts</p>
                </div>
                <Toggle checked={true} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Push Notifications</p>
                  <p className="text-xs text-slate-500">Receive push alerts</p>
                </div>
                <Toggle checked={true} onChange={() => {}} />
              </div>
            </div>
          </div>

          {/* System Section */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">System</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">System Configuration</span>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">System Logs</span>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800/40">
            <h2 className="text-lg font-bold text-red-700 dark:text-red-400 mb-4">Danger Zone</h2>
            <div className="space-y-3">
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-sm font-medium text-red-700 dark:text-red-400">Sign Out</span>
                </div>
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <Toast msg={toastMsg} type={toastType} onDone={() => setShowToast(false)} />
      )}
    </div>
  )
}
