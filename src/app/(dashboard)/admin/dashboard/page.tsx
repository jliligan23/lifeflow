'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminBottomNav from '@/components/admin/AdminBottomNav'

export default function AdminDashboardPage() {
  const router = useRouter()

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative mx-auto max-w-[430px] min-h-screen bg-background-light dark:bg-background-dark flex flex-col shadow-2xl border-x border-slate-200 dark:border-slate-800">
        {/* Top App Bar */}
        <div className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-1 rounded-lg">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                aria-label="MedTech staff profile"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCsTVr8HUFQL0UzYijHLdiYHa-mVg1TwHPQ6dMKXjHp4al20OV9ZjxzLc3ryDUnMkIZ2tnMFMe3jymZcxhOY9HHNBlWVn2-kLay8tm5bWw0wTe5FfsdWRkf_XqG3dCu_yOMHtAXBOibv3AojAxIkAPLrMdnSK2uqC5ZsF6EVA8ZtOEtj6dqLpyI-_9BpQ2kLzRx6GviumtivNdNaAhP6SO8kcwLOOx-u26YDT8fZhUw96-uSl8oRkLwN8wboHcWbfaEnmk0ZGTVxIoH")',
                }}
              />
            </div>
            <div>
              <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
                MedTech Admin
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Baguio City Medical Center
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              className="flex items-center justify-center rounded-full size-10 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          {/* Hero Action: Scanner */}
          <div className="px-4 py-6">
            <button
              type="button"
              onClick={() => router.push('/admin/scanner')}
              className="group w-full flex flex-col items-center justify-center gap-4 bg-primary hover:bg-primary/90 text-white p-8 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              <div className="bg-white/20 p-4 rounded-full group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold tracking-tight">Scan Donor QR</span>
                <span className="block text-sm opacity-80 font-medium mt-1">
                  Ready for rapid check-in
                </span>
              </div>
            </button>
          </div>

          {/* Stats Section */}
          <div className="px-4 pb-2">
            <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider mb-3 px-1">
              Quick Stats
            </h3>
            <div className="flex gap-4">
              {/* Stat Card 1 */}
              <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">Today&apos;s Success</span>
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">24 Units</p>
                <div className="flex items-center gap-1 mt-1">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <p className="text-emerald-500 text-xs font-bold">+12% vs yest.</p>
                </div>
              </div>
              {/* Stat Card 2 */}
              <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">Urgent Needs</span>
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">5 Pending</p>
                <div className="flex items-center gap-1 mt-1">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-500 text-xs font-bold">O- &amp; A+ Required</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Verifications Section */}
          <div className="mt-6 px-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider">
                Recent Verifications
              </h3>
              <button
                type="button"
                className="text-primary text-xs font-bold"
                onClick={() => router.push('/admin/requests')}
              >
                See All
              </button>
            </div>
            <div className="space-y-2">
              {/* Example items - static for now */}
              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="relative">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB2Q5CAgg_C54XrPZlAMk2fsbGzBLKOniszQAWnX6oQ9X29IiH3Lbsz8_DkXDWR-XrCH9ELnafL5va1fwXG6TjIm7nmGiu1Ue_npxPJBI3gJyFuNmaBP97u2dXe0prnUg0KdDoqOvHnQ9NnxRPBreZJInqgIejsOcpvkWI7YM4WlcQwbFEmhQwYPjgSUXUM7xLx7z0Srk6fR8OQmxoLQOaLfhPG8CxOeFmAis99OJsdJ4i0wdjen_WmX9HYydaDH7GLuHUgGCBFAYex")',
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                    B+
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 dark:text-white text-base font-bold leading-tight">
                    Juan Dela Cruz
                  </p>
                  <p className="text-slate-500 text-xs font-medium">
                    Baguio City Hall • 1 Unit Collected
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-[10px] font-bold uppercase">5 mins ago</p>
                  <span className="inline-block px-2 py-0.5 mt-1 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    VERIFIED
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 opacity-90">
                <div className="relative">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCuLW8_YVVs954T-x2KIMBFzXcdvqPosqgdj63RtIQHo8s5dDLiZrpBL84sDoZ2191xC2_5dR7CqLLOaLM8m7JNYtpk098jSpeW-cswZ0C-VTfmYx4VpPnkfwVnvC_VvtZgCKIhElMA4y_1vOkjpBeIsH2-WIlO7CtK504xt-yybfA3Do1mwmoHl-zOKtrnaX07rQzCL0BRQD6xIi2CsnqTlKepUABCsuLWJs1gwEVpR8xvyLPwD1eLF799IknIVepulaOAcLj5d7QIy")',
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                    O-
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 dark:text-white text-base font-bold leading-tight">
                    Maria Santos
                  </p>
                  <p className="text-slate-500 text-xs font-medium">
                    SM City Baguio • Pre-screened
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-[10px] font-bold uppercase">14 mins ago</p>
                  <span className="inline-block px-2 py-0.5 mt-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                    WAITING
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="relative">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuACa36a2XZ1x4ouml-9j5fokADOQS-0EhZkalm2AuyCIkGRZ-qUUcDdtqEu-nnUhH5m_JM34PHV4rLzHaRon5c43ZDFPJDr5FrLgcq6BKXiOQF75f4oLTDciifcqNJUZ9NirfplDIx6kZNSA7oPXIVxL-e4UKFNd7WM8QbIdP09dnt9DO_aVMMAms-MeDlRTrKJEertRNTsdYxsGu5opqtZf9m2Sur8QrHLOX0dwXx-gw_pe7R1BJ10KtOP2BTYBZOTdi_JaJWFWWR7")',
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                    A+
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 dark:text-white text-base font-bold leading-tight">
                    Ricardo Gomez
                  </p>
                  <p className="text-slate-500 text-xs font-medium">
                    Session Road Drive • 1 Unit
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-[10px] font-bold uppercase">45 mins ago</p>
                  <span className="inline-block px-2 py-0.5 mt-1 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Active Site */}
          <div className="mt-8 px-4 mb-4">
            <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 flex items-center gap-4">
              <div className="size-12 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-900 dark:text-white text-sm font-bold">
                  Current Active Site
                </p>
                <p className="text-slate-500 text-xs">Baguio City Hall Quadrangle</p>
              </div>
              <div className="ml-auto">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              </div>
            </div>
          </div>
        </div>

        <AdminBottomNav />
      </div>
    </div>
  )
}

