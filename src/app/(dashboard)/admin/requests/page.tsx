'use client'

import Link from 'next/link'

export default function AdminRequestsPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="max-w-md mx-auto pb-24">
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
                <span className="material-symbols-outlined">search</span>
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
                  <span className="material-symbols-outlined">priority_high</span>
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
                    <span className="material-symbols-outlined text-sm">location_on</span>
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
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    Approve
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 rounded-lg h-11 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold transition-transform active:scale-95">
                    <span className="material-symbols-outlined text-lg">flag</span>
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
                    <span className="material-symbols-outlined text-sm">location_on</span>
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
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    Approve
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 rounded-lg h-11 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold transition-transform active:scale-95">
                    <span className="material-symbols-outlined text-lg">flag</span>
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
                    <span className="material-symbols-outlined text-sm">location_on</span>
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
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    Approve
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 rounded-lg h-11 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold transition-transform active:scale-95">
                    <span className="material-symbols-outlined text-lg">flag</span>
                    Flag
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-md mx-auto flex h-16 items-center justify-around px-4">
            <Link href="/admin/requests" className="flex flex-col items-center gap-1 text-primary">
              <span className="material-symbols-outlined">assignment_late</span>
              <span className="text-[10px] font-bold">Requests</span>
            </Link>
            <Link
              href="/admin/dashboard"
              className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400"
            >
              <span className="material-symbols-outlined">analytics</span>
              <span className="text-[10px] font-bold">Dashboard</span>
            </Link>
            <Link
              href="/donor/search"
              className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400"
            >
              <span className="material-symbols-outlined">group</span>
              <span className="text-[10px] font-bold">Donors</span>
            </Link>
            <Link
              href="/admin/dashboard"
              className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400"
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="text-[10px] font-bold">Settings</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}

