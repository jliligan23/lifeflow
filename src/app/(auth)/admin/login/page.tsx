'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
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

      // Get profile to determine role-based redirect
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
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-[430px] mx-auto bg-[#fcf8f8] dark:bg-[#221010]">

      {/* Top App Bar */}
      <div className="flex items-center p-4 pb-2 justify-between">
        <div className="text-[#ee2b2b] flex size-12 shrink-0 items-center justify-center">
          {/* Heart icon (SVG replaces Material Symbols for React) */}
          <svg className="w-9 h-9 fill-[#ee2b2b]" viewBox="0 0 24 24">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
          </svg>
        </div>
        <h2 className="text-[#1b0d0d] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          LifeFlow
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-12 flex flex-col justify-center">

        {/* Headline */}
        <div className="mb-2">
          <h2 className="text-[#1b0d0d] dark:text-white tracking-tight text-[32px] font-bold leading-tight text-center">
            Welcome Back
          </h2>
          <p className="text-[#1b0d0d]/70 dark:text-white/70 text-base font-normal leading-normal pt-2 text-center px-4">
            Connecting Donors, Saving Lives in Baguio City.
          </p>
        </div>

        {/* Hero Banner */}
        <div className="my-8">
          <div className="w-full rounded-2xl min-h-[160px] bg-gradient-to-br from-[#ee2b2b]/20 to-[#ee2b2b]/5 flex items-center justify-center overflow-hidden relative">
            {/* Decorative heartbeat line */}
            <svg className="w-full h-24 text-[#ee2b2b]/30" viewBox="0 0 400 80" preserveAspectRatio="none">
              <polyline
                points="0,40 60,40 80,10 100,70 120,40 160,40 180,20 200,60 220,40 280,40 300,15 320,65 340,40 400,40"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-12 h-12 fill-[#ee2b2b]/40 mx-auto mb-2" viewBox="0 0 24 24">
                  <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
                </svg>
                <p className="text-[#ee2b2b]/50 text-xs font-semibold tracking-widest uppercase">Every Drop Counts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

          {/* Server Error Alert */}
          {serverError && (
            <div className="bg-[#ee2b2b]/10 border border-[#ee2b2b]/30 rounded-2xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-[#ee2b2b] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <p className="text-[#ee2b2b] text-sm font-medium">{serverError}</p>
            </div>
          )}

          {/* Email Field */}
          <div className="flex flex-col w-full">
            <p className="text-[#1b0d0d] dark:text-white text-sm font-medium leading-normal pb-2 pl-1">
              Email Address
            </p>
            <div className="relative flex items-center">
              <svg className="absolute left-4 w-5 h-5 text-[#9a4c4c] dark:text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <input
                {...register('email')}
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                className={`w-full rounded-full text-[#1b0d0d] dark:text-white border bg-white dark:bg-white/5 h-14 placeholder:text-[#9a4c4c]/60 pl-12 pr-4 text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#ee2b2b]/50 transition-colors ${
                  errors.email ? 'border-[#ee2b2b]' : 'border-[#e7cfcf] dark:border-white/10'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 pl-2 text-xs text-[#ee2b2b]">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col w-full">
            <p className="text-[#1b0d0d] dark:text-white text-sm font-medium leading-normal pb-2 pl-1">
              Password
            </p>
            <div className="relative flex items-center">
              <svg className="absolute left-4 w-5 h-5 text-[#9a4c4c] dark:text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full rounded-full text-[#1b0d0d] dark:text-white border bg-white dark:bg-white/5 h-14 placeholder:text-[#9a4c4c]/60 pl-12 pr-12 text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#ee2b2b]/50 transition-colors ${
                  errors.password ? 'border-[#ee2b2b]' : 'border-[#e7cfcf] dark:border-white/10'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-[#9a4c4c] dark:text-white/50 hover:text-[#ee2b2b] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 pl-2 text-xs text-[#ee2b2b]">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end px-1">
            <Link href="/forgot-password" className="text-[#ee2b2b] text-sm font-semibold hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#ee2b2b] text-white font-bold py-4 rounded-full shadow-lg shadow-[#ee2b2b]/20 hover:bg-[#ee2b2b]/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="p-6 text-center space-y-4">
        <p className="text-[#1b0d0d]/60 dark:text-white/60 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#ee2b2b] font-bold hover:underline ml-1">
            Sign Up
          </Link>
        </p>
        
        {/* Divider */}
        <div className="flex items-center gap-3 py-2">
          <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          <span className="text-xs text-gray-400 dark:text-white/40 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
        </div>

        {/* Staff Login Button */}
        <Link
          href="/admin/login"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-white rounded-full font-semibold text-sm hover:border-[#1152d4] hover:text-[#1152d4] dark:hover:border-[#1152d4] dark:hover:text-[#1152d4] transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          Staff / Admin Login
        </Link>

        <p className="text-[#1b0d0d]/40 dark:text-white/40 text-[10px] uppercase tracking-widest mt-4 font-semibold">
          Baguio City Health Initiative
        </p>
      </div>

      {/* Bottom Safe Area Indicator (iOS Style) */}
      <div className="h-2 w-32 bg-gray-300 dark:bg-white/20 rounded-full mx-auto mb-2" />
    </div>
  )
}
