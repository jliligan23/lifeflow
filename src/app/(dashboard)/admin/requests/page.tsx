'use client'

import Link from 'next/link'
import AdminBottomNav from '@/components/admin/AdminBottomNav'

export default function AdminRequestsPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative mx-auto max-w-[430px] min-h-screen bg-background-light dark:bg-background-dark flex flex-col shadow-2xl border-x border-slate-200 dark:border-slate-800">
        {/* Top App Bar */}
        <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center p-4 justify-between">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover size-full"
                aria-label="MedTech administrator"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDFnbg3zF-TnAYJaLNwNXofvYgEAZ_PqdNhutJ7ZeP1ZVRHTF-p-wJvcoxSu_k8j6a6mr9mEJsjTEHDINtH_-QrcGvUME-RGGSGyDxV9bVsp_ncOQrci0BM_AHrIZIat8jxrEyXyuRHNQH-xFUqyxotER-NV-_ZfZklcf-CaFame-_bfdRy5D0sKPngb2LcmhA8cpaBtrRZ4wgGnrdgisCQE6Ff8jBantJqD1DtAP70OI8RrFiAYRXpNSyNF5YeGZ_oGrAvsGwKZCsG")',
                }}
              />
            </div>
            <div className="flex-1 px-4">
              <h1 className="text-lg font-bold leading-tight tracking-tight">Requests</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                MedTech Admin Portal
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="pb-24">
          {/* Action/Status Panel */}
          <div className="p-4">
            <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary text-white">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    3 Critical Needs Pending
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Requests from BGHMC require immediate validation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Segmented Control */}
          <div className="px-4 py-2">
            <div className="flex h-11 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 p-1">
              <label className="flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-slate-700 has-[:checked]:shadow-sm text-slate-600 dark:text-slate-400 has-[:checked]:text-primary text-sm font-semibold transition-all">
                <span className="truncate">Pending</span>
                <input defaultChecked className="hidden" name="filter" type="radio" value="Pending" />
              </label>
              <label className="flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-slate-700 has-[:checked]:shadow-sm text-slate-600 dark:text-slate-400 has-[:checked]:text-primary text-sm font-semibold transition-all">
                <span className="truncate">Approved</span>
                <input className="hidden" name="filter" type="radio" value="Approved" />
              </label>
              <label className="flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-slate-700 has-[:checked]:shadow-sm text-slate-600 dark:text-slate-400 has-[:checked]:text-primary text-sm font-semibold transition-all">
                <span className="truncate">Flagged</span>
                <input className="hidden" name="filter" type="radio" value="Flagged" />
              </label>
            </div>
          </div>

          {/* Request Cards List (static UI for now) */}
          <div className="flex flex-col gap-4 p-4">
            {/* Card 1: Critical */}
            <div className="flex flex-col overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="relative h-32 w-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80"
                  aria-label="BGHMC location"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC6sw65hrLQtk_HMA3mL3icy7F-WH-fVB4awnKMZRBEL09VsQ05yDAX6CcMOSFHJcHufWyXRsaLGCH6vhh7w8SadwcrjGdL8w3Imdkf2N07pChn7hnc3j1hkvVSFUts_kWm1kJ6k6V5xBbNXE-x0u_ObYbT_JDUDHkcKsTnNhBfdxcPhB_kW-6I2lFGR5nNfsbH2fKbQYuzXbQko9Y5tveqybpjuwsezrStsiF_XK_uR9cxpWqKeBJQeNQI_da68FnRXF--W31kiuIJ")',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-primary text-white text-[10px] font-bold uppercase tracking-widest">
                  Critical
                </div>
                <div className="absolute bottom-3 left-3">
                  <p className="text-white text-xs font-medium flex items-center gap-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Baguio General Hospital (BGHMC)
                  </p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-2xl font-black text-primary leading-none">O- Negative</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                      3 Units Required • Whole Blood
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                      Patient ID
                    </p>
                    <p className="text-sm font-mono font-bold">#REQ-8291</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 italic">
                  &quot;Emergency surgery scheduled for 2:00 PM today.&quot;
                </p>
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 rounded-lg h-11 bg-primary text-white text-sm font-bold transition-transform active:scale-95">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Approve
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 rounded-lg h-11 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold transition-transform active:scale-95">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                    Flag
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Urgent */}
            <div className="flex flex-col overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="relative h-32 w-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80"
                  aria-label="SLU Medical Center"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC6sw65hrLQtk_HMA3mL3icy7F-WH-fVB4awnKMZRBEL09VsQ05yDAX6CcMOSFHJcHufWyXRsaLGCH6vhh7w8SadwcrjGdL8w3Imdkf2N07pChn7hnc3j1hkvVSFUts_kWm1kJ6k6V5xBbNXE-x0u_ObYbT_JDUDHkcKsTnNhBfdxcPhB_kW-6I2lFGR5nNfsbH2fKbQYuzXbQko9Y5tveqybpjuwsezrStsiF_XK_uR9cxpWqKeBJQeNQI_da68FnRXF--W31kiuIJ")',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest">
                  High Urgency
                </div>
                <div className="absolute bottom-3 left-3">
                  <p className="text-white text-xs font-medium flex items-center gap-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    SLU Medical Center
                  </p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-2xl font-black text-primary leading-none">AB+ Positive</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                      2 Units Required • Platelets
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                      Patient ID
                    </p>
                    <p className="text-sm font-mono font-bold">#REQ-7452</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 italic">
                  &quot;Chronic condition, regular transfusion needed.&quot;
                </p>
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 rounded-lg h-11 bg-primary text-white text-sm font-bold transition-transform active:scale-95">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Approve
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 rounded-lg h-11 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold transition-transform active:scale-95">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                    Flag
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Moderate */}
            <div className="flex flex-col overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 opacity-90">
              <div className="relative h-32 w-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80"
                  aria-label="Notre Dame de Chartres"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC6sw65hrLQtk_HMA3mL3icy7F-WH-fVB4awnKMZRBEL09VsQ05yDAX6CcMOSFHJcHufWyXRsaLGCH6vhh7w8SadwcrjGdL8w3Imdkf2N07pChn7hnc3j1hkvVSFUts_kWm1kJ6k6V5xBbNXE-x0u_ObYbT_JDUDHkcKsTnNhBfdxcPhB_kW-6I2lFGR5nNfsbH2fKbQYuzXbQko9Y5tveqybpjuwsezrStsiF_XK_uR9cxpWqKeBJQeNQI_da68FnRXF--W31kiuIJ")',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-yellow-500 text-black text-[10px] font-bold uppercase tracking-widest">
                  Moderate
                </div>
                <div className="absolute bottom-3 left-3">
                  <p className="text-white text-xs font-medium flex items-center gap-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Notre Dame de Chartres
                  </p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-2xl font-black text-primary leading-none">A+ Positive</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                      1 Unit Required • Whole Blood
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                      Patient ID
                    </p>
                    <p className="text-sm font-mono font-bold">#REQ-9012</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 flex items-center justify-center gap-2 rounded-lg h-11 bg-primary text-white text-sm font-bold transition-transform active:scale-95">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Approve
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 rounded-lg h-11 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold transition-transform active:scale-95">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                    Flag
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <AdminBottomNav />
      </div>
    </div>
  )
}

