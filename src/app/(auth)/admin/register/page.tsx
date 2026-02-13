'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { staffRegisterSchema, type StaffRegisterFormData } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'

export default function AdminRegisterPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffRegisterFormData>({
    resolver: zodResolver(staffRegisterSchema),
  })

  const onSubmit = (data: StaffRegisterFormData) => {
    setServerError(null)
    setSuccessMessage(null)

    startTransition(async () => {
      const supabase = createClient()

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            hospital: data.hospital,
            staff_id: data.staffId,
            role: 'admin',
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          setServerError('This email is already registered. Please login instead.')
        } else {
          setServerError(error.message)
        }
        return
      }

      setSuccessMessage('Staff account created! Please check your email to verify before logging in.')
    })
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-sans text-[#0d121b] dark:text-white antialiased">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden mx-auto max-w-[430px] bg-white dark:bg-background-dark shadow-2xl">
        {/* Top App Bar */}
        <div className="flex items-center bg-primary p-4 pb-2 justify-between text-white">
          <button
            type="button"
            onClick={() => router.push('/admin/login')}
            className="flex size-12 shrink-0 items-center justify-start"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </span>
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            Staff Registration
          </h2>
        </div>

        {/* Header Image / Branding */}
        <div className="@container">
          <div className="p-0">
            <div className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-primary min-h-[180px]">
              <div className="flex flex-col p-6 gap-1">
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                  <svg
                    className="h-6 w-6 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
                  </svg>
                </div>
                <p className="text-white tracking-tight text-[24px] font-bold leading-tight">
                  MedTech Staff Onboarding
                </p>
                <p className="text-white/80 text-xs font-medium">
                  Baguio City Blood Center • Authorized Personnel Only
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Headline & Description */}
        <div className="px-4 pt-6">
          <h2 className="text-[#0d121b] dark:text-white tracking-tight text-xl font-bold leading-tight pb-1">
            Create Staff Account
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal pb-4">
            Use your institutional email and staff ID to register for access to the administrative dashboard.
          </p>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-4 pb-10">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 rounded-xl border border-emerald-400/60 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-100">
              <p className="font-semibold">Registration Successful</p>
              <p className="mt-1">
                {successMessage}
              </p>
              <button
                type="button"
                onClick={() => router.push('/admin/login')}
                className="mt-2 text-xs font-semibold text-emerald-800 underline dark:text-emerald-200"
              >
                Go to Staff Login →
              </button>
            </div>
          )}

          {/* Server Error */}
          {serverError && (
            <div className="mb-4 rounded-xl border border-red-400/60 bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-100">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                    <path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </span>
                <input
                  {...register('fullName')}
                  type="text"
                  placeholder="e.g. Dr. Maria Santos"
                  autoComplete="name"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm ${
                    errors.fullName
                      ? 'border-red-400 dark:border-red-500'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-500 ml-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Institutional Email
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16v16H4z" />
                    <path d="M4 4l8 8 8-8" />
                  </svg>
                </span>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@hospital.ph"
                  autoComplete="email"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm ${
                    errors.email
                      ? 'border-red-400 dark:border-red-500'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Work Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full pl-11 pr-12 py-3 rounded-xl border bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm ${
                    errors.password
                      ? 'border-red-400 dark:border-red-500'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.02-2.92 2.98-5.26 5.47-6.71" />
                      <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
                      <path d="M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12S5 5 12 5s10 7 10 7-3 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>
              )}
              <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400 ml-1">
                Min. 8 characters, 1 uppercase letter, and 1 number.
              </p>
            </div>

            {/* Hospital */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Hospital / Affiliation (Baguio City)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 10l9-7 9 7" />
                    <path d="M5 22h14V12L12 5 5 12z" />
                    <path d="M10 14h4v4h-4z" />
                  </svg>
                </span>
                <select
                  {...register('hospital')}
                  className={`w-full pl-11 pr-8 py-3 rounded-xl border bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm appearance-none text-gray-700 dark:text-gray-100 ${
                    errors.hospital
                      ? 'border-red-400 dark:border-red-500'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Institution
                  </option>
                  <option value="bghmc">Baguio General Hospital &amp; Medical Center</option>
                  <option value="slu">Saint Louis University Hospital</option>
                  <option value="notredame">Notre Dame de Chartres Hospital</option>
                  <option value="pineview">Pineview General Hospital</option>
                  <option value="pines">Pines City Doctors&apos; Hospital</option>
                </select>
                <span className="absolute right-3 text-gray-400 pointer-events-none">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </div>
              {errors.hospital && (
                <p className="text-xs text-red-500 ml-1">{errors.hospital.message}</p>
              )}
            </div>

            {/* Staff ID */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Staff ID
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M7 8h10" />
                    <path d="M7 12h4" />
                  </svg>
                </span>
                <input
                  {...register('staffId')}
                  type="text"
                  placeholder="e.g. STF-2024-001"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm ${
                    errors.staffId
                      ? 'border-red-400 dark:border-red-500'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                />
              </div>
              {errors.staffId && (
                <p className="text-xs text-red-500 ml-1">{errors.staffId.message}</p>
              )}
              <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400 ml-1">
                Your official staff identifier issued by your institution.
              </p>
            </div>

            {/* Submit */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isPending || !!successMessage}
                className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Creating Staff Account...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 12a5 5 0 0 0-5 5v4h10v-4a5 5 0 0 0-5-5z" />
                      <circle cx="12" cy="7" r="3" />
                      <path d="M4 11V7a2 2 0 0 1 2-2h1" />
                      <path d="M17 5h1a2 2 0 0 1 2 2v4" />
                    </svg>
                    Register as Staff
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Link to login */}
          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            Already have a staff account?{' '}
            <Link href="/admin/login" className="font-semibold text-primary hover:underline">
              Staff Login
            </Link>
          </div>
        </div>

        {/* Spacer for iOS Home Indicator */}
        <div className="h-8 bg-white dark:bg-background-dark" />
      </div>
    </div>
  )
}

