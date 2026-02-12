'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveStep2Action } from '@/app/actions/profile'

const BARANGAYS = [
  'Abanao-Zandueta-Kayong-Chugum-Otek',
  'Alfonso Tabora',
  'Ambiong',
  'Andres Bonifacio',
  'Asin Road',
  'Atok Trail',
  'Bakakeng Central',
  'Bakakeng Norte',
  'Bal-Marcoville',
  'Balsigan',
  'Bangao',
  'Benguet Cut-off',
  'Bgy. Gabriela Silang',
  'BGH Compound',
  'Brookside',
  'Buol Road',
  'Cabinet Hill-Teacher\'s Camp',
  'Campo Filipino',
  'City Camp Central',
  'City Camp Proper',
  'Country Club Village',
  'Dagsian, Lower',
  'Dagsian, Upper',
  'Dominican Hill-Mirador',
  'Dontogan',
  'DPS Area',
  'Engineers Hill',
  'Fairview Village',
  'Fort del Pilar',
  'General Luna Road',
  'Gibraltar',
  'Greenwater Village',
  'Guisad Central',
  'Guisad Sorong',
  'Happy Hollow',
  'Happy Homes-Campo Sioco',
  'Harrison Road',
  'Holy Ghost Extension',
  'Holy Ghost Proper',
  'Honeymoon (Honeymoon Road)',
  'Imelda R. Marcos (La Salle)',
  'Irisan',
  'Isingan',
  'Kabayanihan',
  'Kagitingan',
  'Kias',
  'Lourdes Subdivision Extension',
  'Lourdes Subdivision Proper',
  'Lucnab',
  'Magsaysay Private Road',
  'Magsaysay, Lower',
  'Magsaysay, Upper',
  'Malcolm Square-Perfecto',
  'Manuel A. Roxas',
  'Market Subdivision, Upper',
  'Middle Quezon Hill Subdivision',
  'Military Cut-off',
  'Mines View Park',
  'Modern Site East',
  'Modern Site West',
  'MRR-Queen of Peace',
  'New Lucban',
  'Outlook Drive',
  'Pacdal',
  'Palma-Urbano',
  'Phil-Am',
  'Pinget',
  'Pinsao Pilot Project',
  'Pinsao Proper',
  'Poliwes',
  'Pucsusan',
  'Quezon Hill Proper',
  'Quezon Hill, Upper',
  'Quirino Hill, East',
  'Quirino Hill, Lower',
  'Quirino Hill, Middle',
  'Quirino Hill, West',
  'Quirino-Magsaysay-Prieto-Kasiga',
  'Rock Quarry, Lower',
  'Rock Quarry, Middle',
  'Rock Quarry, Upper',
  'Saint Joseph Village',
  'Salud Mitra',
  'San Antonio Village',
  'San Luis Village',
  'San Roque Village',
  'San Vicente',
  'Sanitary Camp, North',
  'Sanitary Camp, South',
  'Santa Escolastica',
  'Santo Rosario-Ilang-Ilang',
  'Santo Tomas Proper',
  'Santo Tomas School Area',
  'Slaughter House Area (Barangay Sto. Nino)',
  'South Drive',
  'Teodora Alonzo',
  'Trancoville',
  'Victoria Village',
]

// Show popular ones as chips, rest in dropdown
const POPULAR_BARANGAYS = [
  'Irisan', 'Bakakeng Central', 'Pacdal', 'Gibraltar',
  'Saint Joseph Village', 'Engineers Hill', 'Mines View Park',
  'Quirino Hill, Lower',
]

type DonationDay = 'any' | 'weekdays' | 'weekends'

export default function ProfileSetupStep2() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedBarangay, setSelectedBarangay] = useState('')
  const [donationDay, setDonationDay] = useState<DonationDay>('any')
  const [error, setError] = useState<string | null>(null)
  const [showAllBarangays, setShowAllBarangays] = useState(false)

  const handleNext = () => {
    if (!selectedBarangay) {
      setError('Please select your barangay.')
      return
    }
    setError(null)
    startTransition(async () => {
      const result = await saveStep2Action({
        barangay: selectedBarangay,
        preferred_donation_day: donationDay,
      })
      if (result?.error) { setError(result.error); return }
      router.push('/profile-setup/step-3')
    })
  }

  return (
    <div className="bg-[#f6f8f6] dark:bg-[#102215] min-h-screen flex flex-col">

      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-[#f6f8f6]/80 dark:bg-[#102215]/80 backdrop-blur-md">
        <div className="flex items-center p-4 pb-2 justify-between">
          <button
            onClick={() => router.push('/profile-setup/step-1')}
            className="text-[#0d1b11] dark:text-white flex size-12 shrink-0 items-center cursor-pointer hover:text-[#2bee5b] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-[#0d1b11] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            Profile Setup
          </h2>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">

        {/* Progress Bar */}
        <div className="flex flex-col gap-3 p-4">
          <div className="flex justify-between">
            <p className="text-[#0d1b11] dark:text-white text-base font-medium leading-normal">
              Location &amp; Availability
            </p>
            <p className="text-[#4b5563] dark:text-slate-400 text-sm font-normal leading-normal">2/3</p>
          </div>
          <div className="rounded-full bg-[#2bee5b]/20 h-2 w-full overflow-hidden">
            <div className="h-full bg-[#2bee5b] rounded-full transition-all duration-500" style={{ width: '66%' }} />
          </div>
        </div>

        {/* Headline */}
        <div className="px-4 pt-4">
          <h3 className="text-[#0d1b11] dark:text-white tracking-tight text-2xl font-bold leading-tight pb-2">
            Where and when can you help?
          </h3>
          <p className="text-[#4b5563] dark:text-slate-400 text-base font-normal leading-relaxed">
            Select your barangay in Baguio City and your usual availability for donations.
          </p>
        </div>

        {/* Map Visual */}
        <div className="px-4 py-6">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm border border-[#cfe7d5] dark:border-slate-800 bg-[#2bee5b]/5">
            {/* Decorative map placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-full h-full opacity-10" viewBox="0 0 400 225" fill="none">
                <rect width="400" height="225" fill="#2bee5b"/>
                {/* Simple road grid lines */}
                {[50,100,150,200,250,300,350].map(x => (
                  <line key={x} x1={x} y1="0" x2={x} y2="225" stroke="white" strokeWidth="1"/>
                ))}
                {[45,90,135,180].map(y => (
                  <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="white" strokeWidth="1"/>
                ))}
              </svg>
              <div className="absolute inset-0 bg-gradient-to-br from-[#2bee5b]/20 to-transparent" />
            </div>
            {/* Map markers */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {[
                  { label: 'IRISAN', top: '25%', left: '30%' },
                  { label: 'PACDAL', top: '60%', left: '68%' },
                  { label: 'BAKAKENG', top: '48%', left: '50%' },
                ].map(({ label, top, left }) => (
                  <div key={label} className="absolute flex flex-col items-center" style={{ top, left }}>
                    <svg className="w-7 h-7 text-[#2bee5b] drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span className="bg-white/90 dark:bg-[#102215]/90 px-2 py-0.5 rounded text-[9px] font-bold shadow-sm text-[#0d1b11] dark:text-white">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-2 left-3 flex items-center gap-1">
              <svg className="w-3 h-3 text-[#2bee5b]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              <span className="text-[#0d1b11] dark:text-white text-[10px] font-medium">Baguio City</span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Popular Barangay Chips */}
        <div className="px-4 mb-4">
          <p className="text-[#0d1b11] dark:text-white text-sm font-semibold mb-3 uppercase tracking-wider">
            Popular Areas
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_BARANGAYS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => { setSelectedBarangay(b); setError(null) }}
                className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                  selectedBarangay === b
                    ? 'border-[#2bee5b] bg-[#2bee5b]/10 text-[#0d1b11] dark:text-white'
                    : 'border-[#cfe7d5] dark:border-slate-800 bg-transparent text-[#4b5563] dark:text-slate-400'
                }`}
              >
                {b}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowAllBarangays(!showAllBarangays)}
              className="px-4 py-2 rounded-full border-2 border-[#2bee5b]/40 bg-[#2bee5b]/5 text-[#2bee5b] text-sm font-medium"
            >
              {showAllBarangays ? 'Less ▲' : 'All Barangays ▼'}
            </button>
          </div>
        </div>

        {/* Full Barangay Dropdown (shown when "All" clicked) */}
        {showAllBarangays && (
          <div className="px-4 mb-6">
            <div className="relative">
              <select
                value={selectedBarangay}
                onChange={(e) => { setSelectedBarangay(e.target.value); setError(null) }}
                className="w-full bg-white dark:bg-[#1a2e1f] border border-[#cfe7d5] dark:border-slate-800 rounded-xl px-4 py-4 appearance-none text-[#0d1b11] dark:text-white focus:ring-2 focus:ring-[#2bee5b] focus:border-transparent outline-none text-sm"
              >
                <option value="">Select your barangay...</option>
                {BARANGAYS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#4c9a5f]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {selectedBarangay && (
              <p className="mt-2 text-xs text-[#2bee5b] font-medium px-1">
                ✓ Selected: {selectedBarangay}
              </p>
            )}
          </div>
        )}

        {/* Availability Dropdown */}
        <div className="px-4 mb-10">
          <label className="block text-[#0d1b11] dark:text-white text-sm font-semibold mb-3 uppercase tracking-wider">
            Preferred Donation Day
          </label>
          <div className="relative">
            <select
              value={donationDay}
              onChange={(e) => setDonationDay(e.target.value as DonationDay)}
              className="w-full bg-white dark:bg-[#1a2e1f] border border-[#cfe7d5] dark:border-slate-800 rounded-xl px-4 py-4 appearance-none text-[#0d1b11] dark:text-white focus:ring-2 focus:ring-[#2bee5b] focus:border-transparent outline-none"
            >
              <option value="any">Any day</option>
              <option value="weekdays">Weekdays (Mon–Fri)</option>
              <option value="weekends">Weekends (Sat–Sun)</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#4c9a5f]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-xs text-[#4b5563] dark:text-slate-500 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Matching helps us notify you of blood drives nearby.
          </p>
        </div>

      </main>

      {/* Fixed Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-[#f6f8f6]/90 dark:bg-[#102215]/90 backdrop-blur-xl border-t border-[#cfe7d5] dark:border-slate-800 flex gap-4">
        <button
          onClick={() => router.push('/profile-setup/step-1')}
          className="flex-1 py-4 px-6 rounded-xl border border-[#cfe7d5] dark:border-slate-700 text-[#0d1b11] dark:text-white font-bold text-base transition-all active:scale-95"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={isPending}
          className="flex-[2] py-4 px-6 rounded-xl bg-[#2bee5b] text-[#0d1b11] font-bold text-base shadow-lg shadow-[#2bee5b]/20 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? 'Saving...' : 'Next Step'}
        </button>
      </footer>

    </div>
  )
}
