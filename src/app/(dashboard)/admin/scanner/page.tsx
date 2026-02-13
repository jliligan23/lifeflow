'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminBottomNav from '@/components/admin/AdminBottomNav'

export default function AdminScannerPage() {
  const router = useRouter()

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-white overflow-hidden">
      <div className="relative mx-auto max-w-[430px] min-h-screen bg-background-light dark:bg-background-dark flex flex-col shadow-2xl border-x border-slate-200 dark:border-slate-800">
        {/* Live Camera Viewfinder Layer (placeholder background for now) */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          aria-label="Laboratory environment"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXc_kBNJ4gYxiS6Tka1OHw22MBTgpu3sFZ54Rti_ZLYFAUUYPDv-6GsXOxh0Xj-WNZgjoDryV7C-zQfINiGbh_F-Wf0RR_yFXN9HEkg-PG4yewbTxutSDJJZO8gCBQ91ThYlE3dAArzU8iUzHSxyDZ50hwFh9n5J_ADe76d9ikQUvL9-k-j7uekRprWjpAVM5Snxv7TBzdJHF1G0BiJxRWfuNlJ_6EPYVm7za_sE97LWCs7Gg-HxPtMQHBP2Qk6K7lMwcgPn3UkbKo')",
          }}
        >
          {/* Scanning Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="scanner-frame relative w-64 h-64 border-2 border-primary/50 rounded-xl shadow-[0_0_0_9999px_rgba(16,22,34,0.7)]">
              {/* Corner Brackets */}
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
              {/* Scanning Line Simulation */}
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/80 shadow-[0_0_15px_#135bec] translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Top App Bar */}
        <div className="relative z-10 flex items-center bg-transparent p-4 pb-2 justify-between">
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard')}
            className="text-white flex size-12 shrink-0 items-center cursor-pointer"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            Scan Donor QR
          </h2>
          <div className="flex w-12 items-center justify-end">
            <button
              type="button"
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-black/40 text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 px-3"
            >
              <span className="material-symbols-outlined text-2xl">flashlight_on</span>
            </button>
          </div>
        </div>

        {/* Main View Space */}
        <div className="flex-1" />

        {/* Bottom Sheet Panel (static donor details) */}
        <div className="relative z-20 flex flex-col justify-end items-stretch">
          <div className="flex flex-col items-stretch bg-background-dark rounded-t-xl shadow-2xl border-t border-white/10">
            {/* Handle */}
            <button className="flex h-6 w-full items-center justify-center">
              <div className="h-1 w-12 rounded-full bg-primary/30" />
            </button>
            {/* Status Header */}
            <h4 className="text-[#92a4c9] text-xs font-bold leading-normal tracking-[0.05em] px-4 py-1 text-center uppercase">
              Donor Profile Detected
            </h4>
            {/* Content Area */}
            <div className="px-4 pb-8">
              {/* List Item: Donor Info */}
              <div className="flex items-center gap-4 bg-background-dark/50 px-2 min-h-[80px] py-3 justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 border-2 border-primary/20"
                    aria-label="Donor portrait"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBN7nu2yXJ6E0FdYRIOLfrRhtLGt57yZmKdOluJfwwJhzvUUa-foJTG_j9NYGQTxRNtiHQB6wkjmKkrQ0gzqFtcu7GxQU2z1tKfleBTWnXf-SIU2k8UrTcqVXhT6j_g3lzMwKusm8CzW1Ymo8bLzjMZplsM_IpsbXMfg_piaOI7rsdqhYsz_Lv9SZNVLIImYFieRtrW8MQMf6nBeN2XvDqYpSRILUVza4Hp8l1SVCJdk8Wx7HCEkWMCIDXzBBVhvlUquhLBfl-j2rRt")',
                    }}
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-white text-lg font-bold leading-normal line-clamp-1">
                      Juan Dela Cruz
                    </p>
                    <p className="text-[#92a4c9] text-sm font-medium leading-normal">
                      Blood Type:{' '}
                      <span className="text-primary font-bold">
                        O+
                      </span>
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 bg-[#0bda5e]/10 px-3 py-1 rounded-full">
                      <div className="size-2 rounded-full bg-[#0bda5e]" />
                      <span className="text-[#0bda5e] text-xs font-bold uppercase tracking-wider">
                        Eligible
                      </span>
                    </div>
                    <p className="text-[10px] text-[#92a4c9] mt-1 italic">Last: Oct 12, 2023</p>
                  </div>
                </div>
              </div>

              {/* Detail Stats */}
              <div className="grid grid-cols-2 gap-3 my-6">
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <p className="text-[#92a4c9] text-[10px] uppercase font-bold mb-1">
                    Total Donations
                  </p>
                  <p className="text-white text-lg font-bold">8 Units</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <p className="text-[#92a4c9] text-[10px] uppercase font-bold mb-1">
                    Baguio Center
                  </p>
                  <p className="text-white text-lg font-bold">Main Branch</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <span className="material-symbols-outlined">how_to_reg</span>
                  Log Donation
                </button>
                <button className="w-full h-14 bg-white/5 hover:bg-white/10 text-[#92a4c9] font-semibold rounded-xl flex items-center justify-center transition-colors">
                  Cancel / Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        <AdminBottomNav />
      </div>
    </div>
  )
}
