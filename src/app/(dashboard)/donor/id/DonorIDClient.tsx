'use client'

import { useState } from 'react'

interface Props {
  profile: { full_name: string | null; blood_type: string | null; barangay: string | null; privacy_enabled: boolean | null; weight: number | null; height: number | null } | null
  userId: string
  donorId: string
  totalDonations: number
  lastDonation: string | null
}

function formatDate(iso: string | null) {
  if (!iso) return 'N/A'
  return new Date(iso).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
}

function timeAgo(iso: string | null) {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30))
  if (months === 0) return 'This month'
  if (months === 1) return '1 month ago'
  return `${months} months ago`
}

function getDonorLevel(total: number) {
  if (total >= 25) return { label: 'Life Saver Level 5', color: 'text-purple-600' }
  if (total >= 15) return { label: 'Life Saver Level 4', color: 'text-blue-600' }
  if (total >= 10) return { label: 'Life Saver Level 3', color: 'text-green-600' }
  if (total >= 5)  return { label: 'Life Saver Level 2', color: 'text-yellow-600' }
  if (total >= 1)  return { label: 'Life Saver Level 1', color: 'text-orange-500' }
  return { label: 'First-Time Donor', color: 'text-gray-500' }
}

// Deterministic QR grid based on userId
function QRGrid({ seed }: { seed: string }) {
  const cells = Array.from({ length: 49 }, (_, i) => {
    const char = seed.charCodeAt(i % seed.length) + i
    return char % 3 !== 0
  })
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)', width: 168, height: 168 }}>
      {cells.map((filled, i) => (
        <div key={i} className={`rounded-sm ${filled ? 'bg-[#ec1337]' : 'bg-transparent'}`} />
      ))}
    </div>
  )
}

export default function DonorIDClient({ profile, userId, donorId, totalDonations, lastDonation }: Props) {
  const [phoneVisible, setPhoneVisible] = useState(profile?.privacy_enabled !== false)
  const level = getDonorLevel(totalDonations)
  const isEligible = true // would derive from screening results in real app

  return (
    <div className="text-[#1b0d10] dark:text-[#fcf8f9]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#f8f6f6] dark:bg-[#221013] border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center p-4 justify-between">
          <div className="w-10" />
          <h2 className="text-lg font-bold flex-1 text-center">Digital Donor ID</h2>
          <button className="w-10 h-10 flex items-center justify-center text-[#ec1337]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
          </button>
        </div>
      </header>

      <main className="pb-10">
        {/* Profile Header */}
        <div className="flex flex-col items-center py-6 px-6 gap-3">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full border-4 border-white dark:border-[#221013] shadow-lg bg-gradient-to-br from-[#ec1337]/20 to-rose-100 dark:from-[#ec1337]/30 dark:to-[#221013] flex items-center justify-center">
            <span className="text-4xl font-black text-[#ec1337]">
              {profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0,2) ?? 'D'}
            </span>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{profile?.full_name ?? 'Donor'}</p>
            <p className="text-[#ec1337] font-semibold text-base">{donorId}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center justify-center gap-1 mt-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
              {profile?.barangay ?? 'Baguio City'}, Philippines
            </p>
          </div>
        </div>

        {/* QR Code */}
        <div className="px-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center shadow-sm border border-gray-100 dark:border-white/5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Official Identification QR</p>
            <div className="bg-white p-4 rounded-lg border-2 border-[#ec1337]/20 shadow-inner">
              <QRGrid seed={userId} />
            </div>
            <div className="mt-4">
              <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wide ${isEligible ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                {isEligible ? '✓ Status: Eligible to Donate' : '✗ Status: Temporarily Deferred'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex flex-wrap gap-4 px-6 mb-6">
          <div className="flex min-w-[140px] flex-1 flex-col gap-2 rounded-xl p-5 border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#ec1337]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">Blood Type</p>
            </div>
            <p className="text-[#ec1337] tracking-tight text-3xl font-black">{profile?.blood_type ?? '—'}</p>
          </div>
          <div className="flex min-w-[140px] flex-1 flex-col gap-2 rounded-xl p-5 border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#ec1337]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">Last Donation</p>
            </div>
            <p className="tracking-tight text-lg font-bold">{formatDate(lastDonation)}</p>
            <p className="text-[#ec1337] text-xs font-medium">{timeAgo(lastDonation)}</p>
          </div>
          <div className="flex min-w-[140px] flex-1 flex-col gap-2 rounded-xl p-5 border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#ec1337]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">Total Units</p>
            </div>
            <p className="tracking-tight text-3xl font-black">{totalDonations}</p>
            <p className={`text-xs font-medium ${level.color}`}>{level.label}</p>
          </div>
        </div>

        {/* Privacy & Visibility */}
        <div className="px-6">
          <h3 className="text-lg font-bold pb-3">Privacy &amp; Visibility</h3>
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
            {/* Phone toggle */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="bg-[#ec1337]/10 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-[#ec1337]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">Phone Visibility</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Show number to medical staff</p>
                </div>
              </div>
              <button role="switch" aria-checked={phoneVisible} onClick={() => setPhoneVisible(!phoneVisible)}
                className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${phoneVisible ? 'bg-[#ec1337]' : 'bg-gray-300 dark:bg-gray-700'}`}>
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white border border-gray-200 shadow-sm transition-transform mt-0.5 ${phoneVisible ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            {/* Privacy Settings */}
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-[#ec1337]/10 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-[#ec1337]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">Privacy Settings</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Manage data sharing &amp; security</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 px-6 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">MedTech Thesis Project</p>
          <p className="text-xs font-semibold text-gray-500">University of Baguio • Baguio City</p>
        </div>
      </main>
    </div>
  )
}
