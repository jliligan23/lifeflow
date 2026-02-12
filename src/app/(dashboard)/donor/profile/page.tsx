import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logoutAction } from '@/app/actions/auth'
import Link from 'next/link'

// Settings gear icon SVG path
const GEAR_PATH = 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28zM15 12a3 3 0 11-6 0 3 3 0 016 0z'

export default async function DonorProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, blood_type, barangay, weight, height, on_medication, preferred_donation_day, emergency_contact_name, emergency_contact_phone, sms_alerts_enabled')
    .eq('id', user.id)
    .single()

  const initials = profile?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) ?? 'D'

  const INFO = [
    { label: 'Full Name',       value: profile?.full_name ?? '—' },
    { label: 'Email',           value: user.email ?? '—' },
    { label: 'Blood Type',      value: profile?.blood_type ?? '—' },
    { label: 'Barangay',        value: profile?.barangay ?? '—' },
    { label: 'Weight',          value: profile?.weight ? `${profile.weight} kg` : '—' },
    { label: 'Height',          value: profile?.height ? `${profile.height} cm` : '—' },
    { label: 'On Medication',   value: profile?.on_medication ? 'Yes' : 'No' },
    { label: 'Donation Day',    value: profile?.preferred_donation_day === 'weekdays' ? 'Weekdays (Mon–Fri)' : profile?.preferred_donation_day === 'weekends' ? 'Weekends (Sat–Sun)' : 'Any day' },
  ]

  const EMERGENCY = [
    { label: 'Contact Name',  value: profile?.emergency_contact_name ?? '—' },
    { label: 'Phone Number',  value: profile?.emergency_contact_phone ? `+63 ${profile.emergency_contact_phone}` : '—' },
    { label: 'SMS Alerts',    value: profile?.sms_alerts_enabled ? 'Enabled' : 'Disabled' },
  ]

  return (
    <div className="text-[#1b0d10] dark:text-[#fcf8f9]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#f8f6f6] dark:bg-[#221013] border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center p-4 justify-between">
          <div className="w-10" />
          <h2 className="text-lg font-bold flex-1 text-center">My Profile</h2>
          {/* Settings gear icon → navigates to settings page */}
          <Link
            href="/donor/settings"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-[#ec1337]"
            aria-label="Settings & Privacy"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={GEAR_PATH} />
            </svg>
          </Link>
        </div>
      </header>

      <main className="pb-10">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center py-8 px-6 gap-3">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#ec1337]/20 to-rose-100 dark:from-[#ec1337]/30 dark:to-[#221013] flex items-center justify-center border-4 border-white dark:border-[#221013] shadow-lg">
            <span className="text-3xl font-black text-[#ec1337]">{initials}</span>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{profile?.full_name ?? 'Donor'}</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              {profile?.blood_type && (
                <span className="bg-[#ec1337] text-white text-xs font-black px-3 py-1 rounded-full">{profile.blood_type}</span>
              )}
              <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
            </div>
          </div>
        </div>

        {/* Donor Info */}
        <section className="px-6 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Donor Information</h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden divide-y divide-gray-100 dark:divide-white/5">
            {INFO.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-4 py-3.5">
                <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-sm font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="px-6 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Emergency Contact</h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden divide-y divide-gray-100 dark:divide-white/5">
            {EMERGENCY.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-4 py-3.5">
                <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-sm font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="px-6 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Quick Actions</h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
            {[
              { href: '/donor/id', label: 'View Digital ID Card', icon: 'M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z' },
              { href: '/donor/screening', label: 'Run Health Screening', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
              { href: '/donor/search', label: 'Find Donors Near Me', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
            ].map(({ href, label, icon }) => (
              <Link key={href} href={href} className="flex items-center justify-between px-4 py-4 border-b last:border-0 border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#ec1337]/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#ec1337]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon}/></svg>
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </Link>
            ))}
          </div>
        </section>

        {/* Sign Out */}
        <section className="px-6">
          <form action={logoutAction}>
            <button type="submit" className="w-full bg-[#ec1337]/10 text-[#ec1337] font-bold py-4 rounded-xl hover:bg-[#ec1337]/20 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              Sign Out
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-4">
            MedTech Thesis Project • University of Baguio • Baguio City
          </p>
        </section>
      </main>
    </div>
  )
}
