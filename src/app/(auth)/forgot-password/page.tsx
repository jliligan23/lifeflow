'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    startTransition(async () => {
      const supabase = createClient()

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      })

      if (error) {
        setError(error.message)
        return
      }

      // Store email in sessionStorage so OTP page can use it
      sessionStorage.setItem('reset_email', email)
      setSent(true)

      // Redirect to OTP verification after short delay
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}&type=recovery`)
      }, 1500)
    })
  }

  return (
    <div className="bg-[#f6f8f6] dark:bg-[#102215] min-h-screen flex flex-col max-w-[430px] mx-auto">

      {/* Top Nav */}
      <div className="flex items-center bg-[#f6f8f6] dark:bg-[#102215] p-4 pb-2 justify-between sticky top-0 z-10">
        <Link
          href="/login"
          className="text-[#0d1b11] dark:text-white flex size-12 shrink-0 items-center cursor-pointer hover:text-[#2bee5b] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h2 className="text-[#0d1b11] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Account Recovery
        </h2>
      </div>

      <main className="flex-1 flex flex-col px-6 pb-10">

        {/* Icon */}
        <div className="flex justify-center py-10">
          <div className="relative flex items-center justify-center w-36 h-36 bg-[#2bee5b]/10 rounded-full">
            <div className="absolute inset-0 border-2 border-dashed border-[#2bee5b]/30 rounded-full animate-pulse" />
            <div className="bg-white dark:bg-[#1a2e1f] p-5 rounded-2xl shadow-xl border border-[#cfe7d5] dark:border-gray-700">
              <svg className="w-12 h-12 text-[#2bee5b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-8">
          <h3 className="text-[#0d1b11] dark:text-white text-2xl font-bold tracking-tight mb-3">
            Forgot your password?
          </h3>
          <p className="text-[#4b5563] dark:text-gray-400 text-base leading-relaxed">
            No worries. Enter your registered email and we&apos;ll send you a 6-digit verification code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Success state */}
          {sent && (
            <div className="bg-[#2bee5b]/10 border border-[#2bee5b]/40 rounded-xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-[#2bee5b] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-[#0d1b11] dark:text-white text-sm font-medium">
                Code sent! Redirecting to verification...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Email Input */}
          <div className="flex flex-col w-full">
            <p className="text-[#0d1b11] dark:text-white text-sm font-semibold leading-normal pb-2">
              Email Address
            </p>
            <div className="relative flex items-center">
              <svg className="absolute left-4 w-5 h-5 text-[#4c9a5f] dark:text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                autoFocus
                className="w-full rounded-xl text-[#0d1b11] dark:text-white border border-[#cfe7d5] dark:border-[#2bee5b]/20 bg-gray-50 dark:bg-white/5 h-14 placeholder:text-[#4c9a5f]/50 pl-12 pr-4 text-base font-normal focus:outline-none focus:border-[#2bee5b] focus:ring-2 focus:ring-[#2bee5b]/20 transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending || sent}
              className="w-full h-14 bg-[#2bee5b] hover:bg-[#2bee5b]/90 text-[#0d1b11] font-bold text-lg rounded-xl shadow-lg shadow-[#2bee5b]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending Code...
                </>
              ) : (
                <>
                  Send Verification Code
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <p className="text-[#4b5563] dark:text-gray-400 text-sm">
            Remember your password?{' '}
            <Link href="/login" className="text-[#2bee5b] font-bold hover:underline ml-1">
              Back to Login
            </Link>
          </p>
        </div>

      </main>

      {/* Bottom accent */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-[#2bee5b]/30" />
    </div>
  )
}
