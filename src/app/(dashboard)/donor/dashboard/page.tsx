import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const FACTS = [
  { title: 'Save 3 Lives',   body: 'One single donation can help save up to three people in need.',        bg: 'bg-red-50 dark:bg-red-900/20' },
  { title: 'Heart Health',   body: 'Donating regularly helps reduce the risk of heart disease.',            bg: 'bg-pink-50 dark:bg-pink-900/20' },
  { title: 'Free Checkup',   body: 'Every donation includes a mini-physical to check your health.',         bg: 'bg-rose-50 dark:bg-rose-900/20' },
  { title: 'Burn Calories',  body: 'Donating blood burns approximately 650 calories per donation.',         bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { title: 'Iron Balance',   body: 'Regular donation helps maintain healthy iron levels in your body.',     bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { title: 'Mental Boost',   body: 'Knowing you saved a life provides an immense sense of well-being.',    bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
]

const DRIVES = [
  { title: 'SM Baguio Blood Drive', date: 'Tomorrow, 10:00 AM', location: 'Upper Session Rd', desc: 'Join us at the Event Center for our monthly community drive.', cta: 'Register', ctaStyle: 'bg-[#ec1337] text-white', bg: 'from-[#ec1337]/10 to-rose-50 dark:to-[#221013]' },
  { title: 'Burnham Park Mobile Unit', date: 'Sat, Oct 24', location: 'Burnham Park', desc: 'Look for the Red Cross bus near the Melvin Jones Grandstand.', cta: 'Details', ctaStyle: 'bg-[#ec1337]/10 text-[#ec1337]', bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-[#221013]' },
  { title: 'SLU Hospital Drive', date: 'Nov 2, 8:00 AM', location: 'SLU Campus', desc: 'Annual university-wide donation drive open to all Baguio residents.', cta: 'Register', ctaStyle: 'bg-[#ec1337] text-white', bg: 'from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-[#221013]' },
]

export default async function DonorHomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('full_name,blood_type').eq('id', user.id).single()
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Donor'

  return (
    <div className="text-[#1b0d10] dark:text-[#fcf8f9]">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-[#f8f6f6]/80 dark:bg-[#221013]/80 backdrop-blur-md">
        <div className="flex items-center p-4 pb-2 justify-between">
          <div className="flex items-center gap-1.5">
            <svg className="w-5 h-5 text-[#ec1337]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
            <h2 className="text-lg font-bold tracking-tight">Baguio City</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Hi, {firstName} 👋</span>
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ec1337] rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* Urgency Banner */}
      <section className="p-4">
        <div className="relative overflow-hidden bg-[#ec1337] rounded-xl p-5 shadow-lg shadow-[#ec1337]/20">
          <div className="absolute -right-3 -top-3 opacity-10">
            <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </div>
          <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">High Priority</span>
          <h3 className="text-white text-xl font-bold leading-tight mt-2">URGENT: O- Negative Needed</h3>
          <p className="text-white/80 text-sm mt-1">Baguio General Hospital and Medical Center (BGHMC)</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex -space-x-2">
              {['JD','MS','+12'].map((t,i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#ec1337] flex items-center justify-center text-[10px] font-bold ${i<2?'bg-white/30 text-white':'bg-white/20 text-white'}`}>{t}</div>
              ))}
            </div>
            <Link href="/donor/search" className="bg-white text-[#ec1337] px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">Respond Now</Link>
          </div>
        </div>
      </section>

      {/* Donation Facts Carousel */}
      <section>
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <h2 className="text-xl font-bold tracking-tight">Blood Donation Facts</h2>
          <button className="text-[#ec1337] text-sm font-semibold">See all</button>
        </div>
        <div className="flex overflow-x-auto gap-4 px-4 pb-4 scrollbar-hide" style={{scrollbarWidth:'none'}}>
          {FACTS.map(f => (
            <div key={f.title} className="flex-none w-60 bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
              <div className={`h-28 ${f.bg} flex items-center justify-center`}>
                <svg className="w-16 h-16 text-[#ec1337]/20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
              </div>
              <div className="p-4">
                <p className="font-bold text-base">{f.title}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 leading-snug">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blood type quick card */}
      {profile?.blood_type && (
        <section className="px-4 pb-4">
          <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/10 flex items-center gap-4">
            <div className="w-14 h-14 bg-[#ec1337] rounded-xl flex items-center justify-center shadow-lg shadow-[#ec1337]/20 shrink-0">
              <span className="text-white text-lg font-black">{profile.blood_type}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Your Blood Type</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                {profile.blood_type === 'O-' ? 'Universal donor — your blood helps anyone!' : profile.blood_type === 'AB+' ? 'Universal recipient — broadest compatibility.' : 'Your donation can save lives in Baguio City.'}
              </p>
            </div>
            <Link href="/donor/screening" className="shrink-0 bg-[#ec1337]/10 text-[#ec1337] px-3 py-2 rounded-lg text-xs font-bold">Screen</Link>
          </div>
        </section>
      )}

      {/* Drive Announcements */}
      <section className="px-4 pb-4">
        <h2 className="text-xl font-bold tracking-tight pb-4">Local Drive Announcements</h2>
        <div className="flex flex-col gap-4">
          {DRIVES.map(d => (
            <div key={d.title} className="bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
              <div className={`h-32 bg-gradient-to-br ${d.bg} flex items-center justify-center relative overflow-hidden`}>
                <svg className="absolute opacity-[0.07] w-40 h-40 text-[#ec1337]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
                <span className="relative text-[#ec1337]/30 text-5xl font-black">{d.title.split(' ')[0]}</span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <svg className="w-4 h-4 text-[#ec1337]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <span className="text-xs font-semibold text-[#ec1337] uppercase">{d.date}</span>
                </div>
                <h3 className="font-bold text-lg">{d.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{d.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
                    <span>{d.location}</span>
                  </div>
                  <button className={`${d.ctaStyle} px-4 py-2 rounded-lg text-sm font-bold`}>{d.cta}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAB */}
      <div className="fixed bottom-24 right-4 z-40">
        <Link href="/donor/screening" className="flex items-center gap-2 bg-[#ec1337] text-white px-5 py-3 rounded-full shadow-2xl shadow-[#ec1337]/30 hover:scale-105 active:scale-95 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          <span className="font-bold text-sm">Quick Donate</span>
        </Link>
      </div>
    </div>
  )
}
