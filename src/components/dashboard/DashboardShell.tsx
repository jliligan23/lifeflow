'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  children: React.ReactNode
  profile: { full_name: string | null; blood_type: string | null; barangay: string | null; privacy_enabled: boolean | null; emergency_contact_phone: string | null } | null
  userId: string
}

const NAV = [
  { href: '/donor/dashboard', label: 'Home',      path: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
  { href: '/donor/search',    label: 'Search',    path: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' },
  { href: '/donor/screening', label: 'Screening', path: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
  { href: '/donor/id',        label: 'ID Card',   path: 'M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z' },
  { href: '/donor/profile',   label: 'Profile',   path: 'M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z' },
]

export default function DashboardShell({ children, profile, userId }: Props) {
  const pathname = usePathname()
  const [showPrivacy, setShowPrivacy] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem('privacy_seen')) setShowPrivacy(true)
  }, [])

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221013] min-h-screen">
      {showPrivacy && (
        <div className="fixed inset-0 z-[200] bg-[#f8f6f6] dark:bg-[#221013] flex flex-col overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#ec1337]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col h-full max-w-md mx-auto w-full">
            <div className="flex items-center p-4 justify-between pt-12">
              <div className="w-10" />
              <h2 className="text-sm font-semibold tracking-tight opacity-80 uppercase text-[#1b0d10] dark:text-white">Legal Disclosure</h2>
              <div className="w-10" />
            </div>
            <div className="flex flex-col items-center justify-center pt-6 pb-8">
              <div className="w-24 h-24 bg-[#ec1337]/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-14 h-14 text-[#ec1337]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
              </div>
              <h1 className="text-2xl font-bold text-[#1b0d10] dark:text-white">Baguio Donor Network</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Supporting Life in the Summer Capital</p>
            </div>
            <div className="flex-1 px-6 overflow-y-auto">
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-100 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-6 h-6 text-[#ec1337] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                  <h3 className="text-xl font-bold text-[#1b0d10] dark:text-white">Data Privacy Notice</h3>
                </div>
                <div className="space-y-4 text-[#1b0d10] dark:text-white">
                  <p className="text-base leading-relaxed opacity-90">In compliance with <strong>Republic Act No. 10173</strong>, the <strong>Data Privacy Act of 2012</strong>, we are committed to protecting your personal information.</p>
                  <p className="text-base leading-relaxed opacity-90">By using this application, you agree to the collection and processing of your personal data for:</p>
                  <ul className="space-y-2 text-sm opacity-80 pl-2 border-l-2 border-[#ec1337]/30">
                    {['Donor registration and verification','Urgent blood requirement notifications','Awareness campaigns for donor drives in Baguio City'].map(item => (
                      <li key={item} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-[#ec1337] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                    <p className="text-[#ec1337] text-sm font-medium">Learn more about RA 10173 →</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-3 pb-10">
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 px-4">By clicking "Accept and Continue", you confirm that you have read and understood our data processing policies.</p>
              <button onClick={() => { sessionStorage.setItem('privacy_seen','1'); setShowPrivacy(false) }}
                className="w-full bg-[#ec1337] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#ec1337]/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
                Accept and Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto pb-28">{children}</div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#221013]/90 backdrop-blur-lg border-t border-gray-200 dark:border-white/10 z-50">
        <div className="max-w-md mx-auto flex justify-between items-center px-6 pt-3 pb-7">
          {NAV.map(({ href, label, path }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-[#ec1337]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={path} />
                </svg>
                <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
