'use client'

import { useState, useTransition, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const OTP_LENGTH = 6
const RESEND_COUNTDOWN = 60

export default function VerifyOTPPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const type = (searchParams.get('type') || 'signup') as 'signup' | 'recovery'

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    // Allow only single digit
    const digit = value.replace(/\D/g, '').slice(-1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    setError(null)

    // Auto-advance to next input
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all filled
    if (digit && index === OTP_LENGTH - 1) {
      const fullOtp = [...newOtp].join('')
      if (fullOtp.length === OTP_LENGTH) {
        verifyOtp(fullOtp)
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        // Clear current
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      } else if (index > 0) {
        // Move to previous
        inputRefs.current[index - 1]?.focus()
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle paste — pastes all 6 digits at once
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (pasted.length === OTP_LENGTH) {
      const newOtp = pasted.split('')
      setOtp(newOtp)
      inputRefs.current[OTP_LENGTH - 1]?.focus()
      verifyOtp(pasted)
    }
  }

  const verifyOtp = useCallback((code: string) => {
    setError(null)
    startTransition(async () => {
      const supabase = createClient()

      if (type === 'recovery') {
        // Verify OTP for password reset
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: code,
          type: 'recovery',
        })

        if (error) {
          setError('Invalid or expired code. Please try again.')
          setOtp(Array(OTP_LENGTH).fill(''))
          inputRefs.current[0]?.focus()
          return
        }

        setSuccess('Code verified! Redirecting to reset password...')
        setTimeout(() => router.push('/reset-password'), 1200)

      } else {
        // Verify OTP for email confirmation (signup)
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: code,
          type: 'email',
        })

        if (error) {
          setError('Invalid or expired code. Please try again.')
          setOtp(Array(OTP_LENGTH).fill(''))
          inputRefs.current[0]?.focus()
          return
        }

        setSuccess('Email verified! Redirecting...')
        setTimeout(() => router.push('/donor/dashboard'), 1200)
      }
    })
  }, [email, type, router])

  const handleVerifyClick = () => {
    const code = otp.join('')
    if (code.length < OTP_LENGTH) {
      setError('Please enter all 6 digits.')
      return
    }
    verifyOtp(code)
  }

  const handleResend = () => {
    if (!canResend) return
    startTransition(async () => {
      const supabase = createClient()

      if (type === 'recovery') {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        })
      } else {
        await supabase.auth.resend({ type: 'signup', email })
      }

      setCountdown(RESEND_COUNTDOWN)
      setCanResend(false)
      setOtp(Array(OTP_LENGTH).fill(''))
      setError(null)
      setSuccess('A new code has been sent to your email.')
      inputRefs.current[0]?.focus()
    })
  }

  const maskedEmail = email
    ? email.replace(/(.{2}).+(@.+)/, '$1•••$2')
    : 'your email'

  return (
    <div className="bg-[#f6f8f6] dark:bg-[#102215] min-h-screen flex flex-col">

      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-30 dark:opacity-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[40%] rounded-full bg-[#2bee5b] blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[30%] rounded-full bg-[#2bee5b]/40 blur-[100px]" />
      </div>

      {/* Top Nav */}
      <div className="flex items-center px-4 py-4 justify-between sticky top-0 bg-[#f6f8f6]/90 dark:bg-[#102215]/90 backdrop-blur-sm z-10">
        <Link
          href={type === 'recovery' ? '/forgot-password' : '/register'}
          className="flex items-center justify-center size-10 rounded-full hover:bg-[#2bee5b]/10 transition-colors"
        >
          <svg className="w-5 h-5 text-[#0d1b11] dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="text-[#0d1b11] dark:text-white text-lg font-semibold">Verification</div>
        <div className="size-10" />
      </div>

      <main className="flex-grow flex flex-col px-6 pb-10 max-w-md mx-auto w-full">

        {/* Illustration */}
        <div className="flex justify-center py-8">
          <div className="relative flex items-center justify-center w-40 h-40 bg-[#2bee5b]/10 dark:bg-[#2bee5b]/5 rounded-full">
            <div className="absolute inset-0 border-2 border-dashed border-[#2bee5b]/30 rounded-full animate-pulse" />
            <div className="bg-white dark:bg-[#1a2e1f] p-6 rounded-2xl shadow-xl border border-[#cfe7d5] dark:border-gray-700 flex flex-col items-center relative">
              <svg className="w-14 h-14 text-[#2bee5b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {/* Lock badge */}
              <div className="absolute -bottom-2 -right-2 bg-[#2bee5b] text-[#0d1b11] p-1.5 rounded-lg shadow-lg">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-8">
          <h2 className="text-[#0d1b11] dark:text-white text-2xl font-bold tracking-tight mb-3">
            Check your email
          </h2>
          <p className="text-[#4b5563] dark:text-gray-400 text-base leading-relaxed">
            We sent a 6-digit code to{' '}
            <span className="font-semibold text-[#0d1b11] dark:text-white">{maskedEmail}</span>
          </p>
        </div>

        {/* Feedback messages */}
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-[#2bee5b]/10 border border-[#2bee5b]/40 rounded-xl p-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-[#2bee5b] shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-[#0d1b11] dark:text-white text-sm font-medium">{success}</p>
          </div>
        )}

        {/* OTP Input Grid */}
        <div className="flex justify-center mb-8" onPaste={handlePaste}>
          <div className="flex gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isPending}
                className={`w-12 h-14 text-center text-xl font-bold rounded-lg border-2 transition-all outline-none
                  ${digit
                    ? 'bg-[#2bee5b]/10 border-[#2bee5b] text-[#0d1b11] dark:text-white dark:bg-[#2bee5b]/20'
                    : 'bg-white dark:bg-[#1a2e1f] border-[#cfe7d5] dark:border-gray-700 text-[#0d1b11] dark:text-white'
                  }
                  focus:border-[#2bee5b] focus:ring-2 focus:ring-[#2bee5b]/20
                  disabled:opacity-50`}
              />
            ))}
          </div>
        </div>

        {/* Resend & Timer */}
        <div className="text-center mb-auto">
          <p className="text-sm text-[#4b5563] dark:text-gray-400">
            Didn&apos;t receive the code?{' '}
            <button
              onClick={handleResend}
              disabled={!canResend || isPending}
              className={`font-semibold transition-colors ${
                canResend
                  ? 'text-[#2bee5b] hover:underline underline-offset-4 decoration-2'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              Resend
            </button>
          </p>
          {!canResend && (
            <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatTime(countdown)}</span>
            </div>
          )}
        </div>

        {/* Verify Button */}
        <div className="mt-8">
          <button
            onClick={handleVerifyClick}
            disabled={isPending || otp.join('').length < OTP_LENGTH}
            className="w-full bg-[#2bee5b] hover:bg-[#2bee5b]/90 text-[#0d1b11] font-bold text-lg py-4 rounded-xl shadow-lg shadow-[#2bee5b]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying...
              </>
            ) : (
              <>
                Verify and Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>

          <p className="mt-6 text-center text-xs text-gray-400 uppercase tracking-widest px-8 leading-tight">
            LifeFlow MedTech • Baguio City Blood Donor Network
          </p>
        </div>

      </main>
    </div>
  )
}
