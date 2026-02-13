'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
              <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">
                notifications
              </span>
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
                <span className="material-symbols-outlined !text-4xl">qr_code_scanner</span>
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
                  <span className="material-symbols-outlined text-emerald-500 !text-lg">
                    check_circle
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">24 Units</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined !text-sm text-emerald-500">
                    trending_up
                  </span>
                  <p className="text-emerald-500 text-xs font-bold">+12% vs yest.</p>
                </div>
              </div>
              {/* Stat Card 2 */}
              <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">Urgent Needs</span>
                  <span className="material-symbols-outlined text-red-500 !text-lg">warning</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">5 Pending</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined !text-sm text-red-500">
                    priority_high
                  </span>
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
                <span className="material-symbols-outlined text-primary">location_on</span>
              </div>
              <div>
                <p className="text-slate-900 dark:text-white text-sm font-bold">
                  Current Active Site
                </p>
                <p className="text-slate-500 text-xs">Baguio City Hall Quadrangle</p>
              </div>
              <div className="ml-auto">
                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/90 dark:bg-background-dark/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-4 py-2 pb-6 z-30">
          <div className="flex items-center justify-between px-2">
            <Link
              href="/admin/dashboard"
              className="flex flex-col items-center gap-1 text-primary"
            >
              <span className="material-symbols-outlined !text-[28px] font-bold">dashboard</span>
              <span className="text-[10px] font-bold">Dashboard</span>
            </Link>
            <Link
              href="/admin/scanner"
              className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-600 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined !text-[28px]">qr_code_2</span>
              <span className="text-[10px] font-bold">Scanner</span>
            </Link>
            <Link
              href="/admin/requests"
              className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-600 hover:text-primary transition-colors relative"
            >
              <span className="material-symbols-outlined !text-[28px]">bloodtype</span>
              <span className="text-[10px] font-bold">Requests</span>
              <span className="absolute top-0 right-0 bg-red-500 h-2 w-2 rounded-full border border-white dark:border-slate-900" />
            </Link>
            <Link
              href="/donor/settings"
              className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-600 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined !text-[28px]">settings</span>
              <span className="text-[10px] font-bold">Settings</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}

