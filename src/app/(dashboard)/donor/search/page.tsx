'use client'

import { useState } from 'react'

const BLOOD_TYPES = ['A+','A-','B+','B-','O+','O-','AB+','AB-']

const MOCK_DONORS = [
  { name: 'Maria Santos',      blood: 'A+', barangay: 'Irisan',         km: 1.2, active: true,  verified: true  },
  { name: 'Juan Dela Cruz',    blood: 'O+', barangay: 'Bakakeng',       km: 3.8, active: false, verified: true  },
  { name: 'Elena Baguio',      blood: 'B-', barangay: 'Gibraltar',      km: 4.5, active: true,  verified: false },
  { name: 'Rico Mamaril',      blood: 'AB+',barangay: 'Pacdal',         km: 5.1, active: true,  verified: true  },
  { name: 'Anna Versoza',      blood: 'A-', barangay: 'Saint Joseph',   km: 6.3, active: false, verified: true  },
  { name: 'Bong Pascual',      blood: 'O-', barangay: 'Engineers Hill', km: 7.0, active: true,  verified: true  },
  { name: 'Grace Talosig',     blood: 'B+', barangay: 'Mines View',     km: 8.2, active: false, verified: false },
  { name: 'Carlo Reyes',       blood: 'A+', barangay: 'Quirino Hill',   km: 9.0, active: true,  verified: true  },
]

export default function DonorSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBlood, setSelectedBlood] = useState<string | null>(null)
  const [proximity, setProximity] = useState(10)
  const [showMyNumber, setShowMyNumber] = useState(true)

  const filtered = MOCK_DONORS.filter(d => {
    const matchBlood = selectedBlood ? d.blood === selectedBlood : true
    const matchProx  = d.km <= proximity
    const matchSearch = searchQuery ? d.barangay.toLowerCase().includes(searchQuery.toLowerCase()) || d.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
    return matchBlood && matchProx && matchSearch
  })

  return (
    <div className="text-[#1b0d10] dark:text-[#fcf8f9] min-h-screen">
      {/* Status bar spacer */}
      <div className="h-12 bg-[#f8f6f6] dark:bg-[#221013]" />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#f8f6f6]/80 dark:bg-[#221013]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="w-12" />
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold">Find Donors</h2>
            <p className="text-xs text-[#ec1337] font-medium">Baguio City Network</p>
          </div>
          <button className="w-10 h-10 bg-[#ec1337]/10 text-[#ec1337] rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-4">
        <div className="flex items-center h-14 bg-white dark:bg-white/5 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="pl-4 text-[#ec1337]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Barangay or name…"
            className="flex-1 bg-transparent px-4 text-base outline-none placeholder:text-gray-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="pr-4 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Show My Number toggle */}
      <div className="px-4 pb-2">
        <div className="bg-white dark:bg-white/5 rounded-xl p-4 flex items-center justify-between border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div>
              <p className="font-semibold text-sm">Show My Number</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Make yourself discoverable to seekers</p>
            </div>
          </div>
          <button
            role="switch"
            aria-checked={showMyNumber}
            onClick={() => setShowMyNumber(!showMyNumber)}
            className={`relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 ${showMyNumber ? 'bg-[#ec1337]' : 'bg-gray-300 dark:bg-gray-700'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white border border-gray-200 shadow-sm transition-transform mt-0.5 ${showMyNumber ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Blood Type Chips */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">Blood Type</h3>
          {selectedBlood && <button onClick={() => setSelectedBlood(null)} className="text-xs font-semibold text-[#ec1337] uppercase tracking-wider">Clear</button>}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2" style={{scrollbarWidth:'none'}}>
          {BLOOD_TYPES.map(bt => (
            <button
              key={bt}
              onClick={() => setSelectedBlood(selectedBlood === bt ? null : bt)}
              className={`flex-none h-10 px-5 rounded-xl text-sm font-bold transition-all ${selectedBlood === bt ? 'bg-[#ec1337] text-white shadow-md shadow-[#ec1337]/20' : 'bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300'}`}
            >
              {bt}
            </button>
          ))}
        </div>
      </div>

      {/* Proximity Slider */}
      <div className="px-4 py-4">
        <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#ec1337]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <p className="text-base font-semibold">Proximity Range</p>
            </div>
            <p className="text-[#ec1337] text-sm font-bold">{proximity.toFixed(1)} km</p>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={0.5}
            value={proximity}
            onChange={e => setProximity(parseFloat(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{background: `linear-gradient(to right, #ec1337 ${(proximity/20)*100}%, #e5e7eb ${(proximity/20)*100}%)`}}
          />
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-gray-400 font-bold">0 KM</span>
            <span className="text-[10px] text-gray-400 font-bold">20 KM</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-lg font-bold">Nearby Donors</h3>
          <span className="text-xs text-gray-500 font-medium">{filtered.length} Found</span>
        </div>

        {filtered.length === 0 && (
          <div className="bg-white dark:bg-white/5 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-800">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <p className="text-gray-500 text-sm font-medium">No donors found matching your filters.</p>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((donor, i) => (
            <div key={i} className="bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-4 relative overflow-hidden">
              {donor.verified && (
                <div className="absolute top-0 right-0 bg-[#ec1337]/10 px-3 py-1 rounded-bl-xl">
                  <span className="text-[#ec1337] text-[10px] font-bold uppercase tracking-tighter">Verified</span>
                </div>
              )}
              {/* Blood type badge */}
              <div className={`flex flex-col items-center justify-center h-16 w-16 rounded-xl shrink-0 shadow-lg ${donor.active ? 'bg-[#ec1337] shadow-[#ec1337]/20' : 'bg-[#ec1337]/20 border-2 border-[#ec1337]'}`}>
                <span className={`text-xl font-black ${donor.active ? 'text-white' : 'text-[#ec1337]'}`}>{donor.blood}</span>
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-bold truncate">{donor.name}</h4>
                  {donor.active && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0" title="Active Now" />}
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mb-2 gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
                  <span>{donor.barangay}, Baguio City</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 w-fit px-2 py-1 rounded-lg">
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                  <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300">{donor.km} km away</span>
                </div>
              </div>
              {/* Call / Message */}
              <button className="bg-[#ec1337] text-white p-3 rounded-full shadow-lg shadow-[#ec1337]/20 hover:bg-[#ec1337]/90 transition-colors shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Show Map FAB */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
        <button className="bg-[#1b0d10] dark:bg-white dark:text-[#1b0d10] text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl font-bold text-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
          Show Map
        </button>
      </div>
    </div>
  )
}
