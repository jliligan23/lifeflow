'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface PasswordRequirement {
  label: string
  test: (pw: string) => boolean
}

const REQUIREMENTS: PasswordRequirement[] = [
  { label: 'At least 8 characters long', test: (pw) => pw.length >= 8 },
  { label: 'Contains at least one number', test: (pw) => /[0-9]/.test(pw) },
  { label: 'Contains a special character (!@#$%)', test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
  { label: 'Contains an uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
]

export default function ResetPasswordPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const requirementsMet = REQUIREMENTS.map((r) => r.test(newPassword))
  const allRequirementsMet = requirementsMet.every(Boolean)
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!allRequirementsMet) {
      setError('Please meet all password requirements.')
      return
    }
    if (!passwordsMatch) {
      setError('Passwords do not match.')
      return
    }

    startTransition(async () => {
      const supabase = createClient()

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        if (error.message.includes('same password')) {
          setError('Your new password cannot be the same as your old password.')
        } else {
          setError(error.message)
        }
        return
      }

      setSuccess(true)
      // Sign out all other sessions and redirect to login
      await supabase.auth.signOut({ scope: 'others' })
      setTimeout(() => router.push('/login'), 2000)
    })
  }

  return (
    <div className="bg-white dark:bg-[#102215] min-h-screen flex flex-col max-w-[430px] mx-auto shadow-2xl">

      {/* Top App Bar */}
      <div className="flex items-center bg-white dark:bg-[#102215] p-4 pb-2 justify-between sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="text-[#0d1b11] dark:text-white flex size-12 shrink-0 items-center cursor-pointer hover:text-[#2bee5b] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-[#0d1b11] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Security
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">

        {/* Headline */}
        <div className="px-6 pt-8">
          <h3 className="text-[#0d1b11] dark:text-white tracking-tight text-3xl font-bold leading-tight">
            Create New Password
          </h3>
        </div>

        {/* Subtitle */}
        <div className="px-6">
          <p className="text-[#4b5563] dark:text-gray-400 text-base font-normal leading-normal pb-6 pt-2">
            Your donor account security is our priority. Set a strong password to protect your registration data and donation history.
          </p>
        </div>

        {/* Success State */}
        {success && (
          <div className="mx-6 mb-4 bg-[#2bee5b]/10 border border-[#2bee5b]/40 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-[#2bee5b] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-[#0d1b11] dark:text-white font-semibold text-sm">Password updated!</p>
              <p className="text-[#4b5563] dark:text-gray-400 text-sm">Redirecting you to login...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mx-6 mb-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-3 flex items-start gap-2">
            <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} id="reset-form">

          {/* New Password Field */}
          <div className="px-6 py-3">
            <label className="flex flex-col w-full">
              <p className="text-[#0d1b11] dark:text-white text-sm font-semibold leading-normal pb-2">
                New Password
              </p>
              <div className={`flex w-full items-stretch rounded-xl overflow-hidden border bg-gray-50 dark:bg-white/5 focus-within:border-[#2bee5b] transition-colors ${
                newPassword && !allRequirementsMet
                  ? 'border-red-300 dark:border-red-800/60'
                  : newPassword && allRequirementsMet
                  ? 'border-[#2bee5b]'
                  : 'border-[#cfe7d5] dark:border-[#2bee5b]/20'
              }`}>
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(null) }}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="flex w-full min-w-0 flex-1 border-none bg-transparent h-14 placeholder:text-[#4c9a5f]/50 dark:placeholder:text-gray-500 p-4 text-base font-normal text-[#0d1b11] dark:text-white leading-normal focus:ring-0 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="text-[#4c9a5f] dark:text-[#2bee5b] flex items-center justify-center pr-4 cursor-pointer hover:text-[#2bee5b] transition-colors"
                >
                  {showNew ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </label>
          </div>

          {/* Confirm Password Field */}
          <div className="px-6 py-3">
            <label className="flex flex-col w-full">
              <p className="text-[#0d1b11] dark:text-white text-sm font-semibold leading-normal pb-2">
                Confirm New Password
              </p>
              <div className={`flex w-full items-stretch rounded-xl overflow-hidden border bg-gray-50 dark:bg-white/5 focus-within:border-[#2bee5b] transition-colors ${
                confirmPassword && !passwordsMatch
                  ? 'border-red-300 dark:border-red-800/60'
                  : confirmPassword && passwordsMatch
                  ? 'border-[#2bee5b]'
                  : 'border-[#cfe7d5] dark:border-[#2bee5b]/20'
              }`}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(null) }}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="flex w-full min-w-0 flex-1 border-none bg-transparent h-14 placeholder:text-[#4c9a5f]/50 dark:placeholder:text-gray-500 p-4 text-base font-normal text-[#0d1b11] dark:text-white leading-normal focus:ring-0 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-[#4c9a5f] dark:text-[#2bee5b] flex items-center justify-center pr-4 cursor-pointer hover:text-[#2bee5b] transition-colors"
                >
                  {showConfirm ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Passwords match indicator */}
              {confirmPassword && (
                <p className={`mt-1.5 text-xs font-medium ${passwordsMatch ? 'text-[#2bee5b]' : 'text-red-500'}`}>
                  {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </label>
          </div>

          {/* Live Password Requirements Checklist */}
          <div className="px-6 py-4 space-y-3">
            <p className="text-[#0d1b11] dark:text-white text-xs font-bold uppercase tracking-wider mb-2">
              Password Requirements
            </p>
            {REQUIREMENTS.map((req, i) => {
              const met = requirementsMet[i]
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`rounded-full p-1 flex items-center justify-center transition-colors ${
                    met
                      ? 'bg-[#2bee5b]/20 text-[#2bee5b]'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-400'
                  }`}>
                    {met ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                    )}
                  </div>
                  <p className={`text-sm transition-colors ${
                    met
                      ? 'text-[#0d1b11] dark:text-white font-medium'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {req.label}
                  </p>
                </div>
              )
            })}
          </div>

        </form>
      </div>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 bg-white dark:bg-[#102215] border-t border-gray-100 dark:border-white/5 pb-8">
        <button
          type="submit"
          form="reset-form"
          disabled={isPending || !allRequirementsMet || !passwordsMatch || success}
          className="w-full h-14 bg-[#2bee5b] text-[#0d1b11] font-bold text-lg rounded-xl shadow-lg shadow-[#2bee5b]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2bee5b]/90"
        >
          {isPending ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Updating Password...
            </>
          ) : (
            <>
              Reset Password
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </>
          )}
        </button>
        {/* iOS Home Bar */}
        <div className="mt-4 flex justify-center">
          <div className="w-32 h-1.5 bg-gray-200 dark:bg-white/20 rounded-full" />
        </div>
      </div>

    </div>
  )
}
