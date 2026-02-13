'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    setServerError(null)
    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setServerError('Incorrect email or password. Please try again.')
        } else if (error.message.includes('Email not confirmed')) {
          setServerError('Please verify your email address first. Check your inbox.')
        } else {
          setServerError(error.message)
        }
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setServerError('Authentication failed.'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/donor/dashboard')
      }
    })
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-sans text-[#0d121b] dark:text-white antialiased">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden mx-auto max-w-[430px] bg-white dark:bg-background-dark shadow-2xl">
        {/* Top App Bar */}
        <div className="flex items-center bg-primary p-4 pb-2 justify-between text-white">
          <button
            type="button"
            onClick={() => router.push('/login')}
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
            Medical Staff Portal
          </h2>
        </div>

        {/* Header Image / Branding */}
        <div className="@container">
          <div className="p-0">
            <div className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-primary min-h-[200px]">
              <div className="flex flex-col p-6 gap-1">
                <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <svg
                    className="h-7 w-7 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
                  </svg>
                </div>
                <p className="text-white tracking-tight text-[28px] font-bold leading-tight">
                  MedTech Connect
                </p>
                <p className="text-white/80 text-sm font-medium">
                  Baguio Blood Center Administration
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chips / Access Level Indicator */}
        <div className="flex gap-3 px-4 pt-6 flex-wrap">
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary/10 dark:bg-primary/20 pl-2 pr-4 border border-primary/20">
            <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <p className="text-primary text-xs font-bold leading-normal tracking-wider">
              SECURE STAFF ACCESS
            </p>
          </div>
        </div>

        {/* Headline & Body */}
        <div className="px-4">
          <h2 className="text-[#0d121b] dark:text-white tracking-tight text-2xl font-bold leading-tight pb-2 pt-4">
            Staff Authentication
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal pb-6">
            Please enter your institutional credentials to access the administrative dashboard.
          </p>
        </div>

        {/* Login Form */}
        <div className="flex flex-col gap-5 px-4 pb-10">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            {/* Server Error Alert */}
            {serverError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/40 rounded-xl p-3 flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-5.75a.75.75 0 011.5 0v1.5a.75.75 0 01-1.5 0v-1.5zm0-5.5a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0v-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-700 dark:text-red-200 font-medium">
                  {serverError}
                </p>
              </div>
            )}

            {/* Staff ID / Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Staff ID / Email
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
                  {...register('email')}
                  type="email"
                  placeholder="e.g. staff@hospital.com"
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
                  autoComplete="current-password"
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
            </div>

            {/* Hospital / Affiliation */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Hospital/Affiliation (Baguio City)
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
                  className="w-full pl-11 pr-8 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm appearance-none text-gray-700 dark:text-gray-100"
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
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={isPending}
              className="mt-2 w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  Authenticating...
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5"
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
                  Admin Login
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="flex flex-col items-center gap-4 mt-4">
            <Link href="/forgot-password" className="text-primary text-sm font-medium hover:underline">
              Forgot your work password?
            </Link>
            <Link href="/admin/register" className="text-primary text-xs font-medium hover:underline">
              Need an account? Register as staff
            </Link>
            <div className="h-px w-full bg-gray-100 dark:bg-gray-800" />
            <div className="flex items-center gap-2 text-gray-400 text-[11px] uppercase tracking-widest font-bold">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span>Authorized Personnel Only</span>
            </div>
          </div>
        </div>

        {/* Spacer for iOS Home Indicator */}
        <div className="h-8 bg-white dark:bg-background-dark" />
      </div>
    </div>
  )
}
