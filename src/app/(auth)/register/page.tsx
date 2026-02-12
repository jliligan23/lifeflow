'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const

export default function RegisterPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { consent: false },
  })

  const consentValue = watch('consent')

  const onSubmit = (data: RegisterFormData) => {
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
            blood_type: data.bloodType,
            consent_given: data.consent,
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

      setSuccessMessage('Account created! Please check your email to verify your account before logging in.')
    })
  }

  return (
    <div className="bg-[#f6f8f6] dark:bg-[#102215] min-h-screen flex flex-col">

      {/* Top Navigation Bar */}
      <header className="flex items-center bg-[#f6f8f6] dark:bg-[#102215] p-4 pb-2 justify-between sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="text-[#0d1b11] dark:text-white flex size-12 shrink-0 items-center cursor-pointer hover:text-[#2bee5b] transition-colors"
          aria-label="Go back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2 className="text-[#0d1b11] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Donor Registration
        </h2>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-10">

        {/* Headline Section */}
        <div className="pt-5 pb-3">
          <h2 className="text-[#0d1b11] dark:text-white text-[28px] font-bold leading-tight text-center">
            Join the Life-Saving Community
          </h2>
          <p className="text-[#4b5563] dark:text-gray-400 text-base font-normal leading-normal pt-2 text-center">
            Register as a donor in Baguio City and help save lives.
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-1">

          {/* Success Message */}
          {successMessage && (
            <div className="bg-[#2bee5b]/10 border border-[#2bee5b]/40 rounded-xl p-4 flex items-start gap-3 mb-4">
              <svg className="w-5 h-5 text-[#2bee5b] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <div>
                <p className="text-[#0d1b11] dark:text-white text-sm font-semibold">Registration Successful!</p>
                <p className="text-[#4b5563] dark:text-gray-400 text-sm mt-1">{successMessage}</p>
                <Link href="/login" className="text-[#2bee5b] font-bold text-sm hover:underline mt-2 inline-block">
                  Go to Login →
                </Link>
              </div>
            </div>
          )}

          {/* Server Error Alert */}
          {serverError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-4 flex items-start gap-3 mb-4">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <p className="text-red-700 dark:text-red-400 text-sm font-medium">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-1">

            {/* Full Name */}
            <div className="flex flex-col py-3">
              <label className="flex flex-col flex-1">
                <p className="text-[#0d1b11] dark:text-white text-base font-medium leading-normal pb-2">
                  Full Name
                </p>
                <input
                  {...register('fullName')}
                  type="text"
                  placeholder="Juan Dela Cruz"
                  autoComplete="name"
                  className={`w-full rounded-lg text-[#0d1b11] dark:text-white border bg-white dark:bg-[#1a2e1f] h-14 placeholder:text-[#4c9a5f]/60 p-[15px] text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#2bee5b]/50 transition-colors ${
                    errors.fullName ? 'border-red-400' : 'border-[#cfe7d5] dark:border-gray-700'
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.fullName.message}</p>
                )}
              </label>
            </div>

            {/* Email Address */}
            <div className="flex flex-col py-3">
              <label className="flex flex-col flex-1">
                <p className="text-[#0d1b11] dark:text-white text-base font-medium leading-normal pb-2">
                  Email
                </p>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="example@email.com"
                  autoComplete="email"
                  className={`w-full rounded-lg text-[#0d1b11] dark:text-white border bg-white dark:bg-[#1a2e1f] h-14 placeholder:text-[#4c9a5f]/60 p-[15px] text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#2bee5b]/50 transition-colors ${
                    errors.email ? 'border-red-400' : 'border-[#cfe7d5] dark:border-gray-700'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
                )}
              </label>
            </div>

            {/* Password */}
            <div className="flex flex-col py-3">
              <label className="flex flex-col flex-1">
                <p className="text-[#0d1b11] dark:text-white text-base font-medium leading-normal pb-2">
                  Password
                </p>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={`w-full rounded-lg text-[#0d1b11] dark:text-white border bg-white dark:bg-[#1a2e1f] h-14 placeholder:text-[#4c9a5f]/60 p-[15px] pr-12 text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#2bee5b]/50 transition-colors ${
                      errors.password ? 'border-red-400' : 'border-[#cfe7d5] dark:border-gray-700'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-[#2bee5b] transition-colors"
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
                  <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
                )}
                <p className="mt-1.5 text-xs text-[#4b5563] dark:text-gray-400">
                  Min. 8 characters, 1 uppercase letter, 1 number
                </p>
              </label>
            </div>

            {/* Blood Type Dropdown */}
            <div className="flex flex-col py-3">
              <label className="flex flex-col flex-1">
                <p className="text-[#0d1b11] dark:text-white text-base font-medium leading-normal pb-2">
                  Blood Type
                </p>
                <div className="relative">
                  <select
                    {...register('bloodType')}
                    className={`w-full appearance-none rounded-lg text-[#0d1b11] dark:text-white border bg-white dark:bg-[#1a2e1f] h-14 p-[15px] text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#2bee5b]/50 transition-colors ${
                      errors.bloodType ? 'border-red-400' : 'border-[#cfe7d5] dark:border-gray-700'
                    }`}
                  >
                    <option value="" disabled>Select your blood type</option>
                    {BLOOD_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                    <option value="unknown">I don&apos;t know</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </div>
                {errors.bloodType && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.bloodType.message}</p>
                )}
              </label>
            </div>

            {/* Data Privacy Checkbox */}
            <div className="flex items-start gap-3 py-4">
              <div className="flex h-6 items-center mt-0.5">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={consentValue}
                  onChange={(e) => setValue('consent', e.target.checked, { shouldValidate: true })}
                  className="h-5 w-5 rounded border-gray-300 text-[#2bee5b] focus:ring-[#2bee5b] cursor-pointer"
                />
              </div>
              <div className="text-sm leading-6">
                <label htmlFor="privacy" className="font-normal text-[#0d1b11] dark:text-gray-300 cursor-pointer">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-[#2bee5b] font-semibold underline decoration-2 hover:text-[#2bee5b]/80"
                  >
                    Data Privacy Terms (RA 10173)
                  </button>{' '}
                  for blood donation services in Baguio City.
                </label>
                {errors.consent && (
                  <p className="mt-1 text-xs text-red-500">{errors.consent.message}</p>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isPending || !!successMessage}
                className="w-full bg-[#2bee5b] hover:bg-[#2bee5b]/90 text-black font-bold py-4 px-6 rounded-xl transition duration-200 shadow-lg shadow-[#2bee5b]/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                    </svg>
                    Create Account
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Login Redirect */}
          <div className="pt-8 text-center pb-10">
            <p className="text-[#4b5563] dark:text-gray-400 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-[#2bee5b] font-bold hover:underline ml-1">
                Login here
              </Link>
            </p>
          </div>

        </div>
      </main>

      {/* Bottom accent line */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-[#2bee5b]/30" />

      {/* Data Privacy Modal (RA 10173) */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a2e1f] rounded-2xl shadow-2xl max-w-sm w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[#cfe7d5] dark:border-gray-700">
              <div>
                <h3 className="text-[#0d1b11] dark:text-white font-bold text-lg">Data Privacy Notice</h3>
                <p className="text-[#4b5563] dark:text-gray-400 text-xs mt-0.5">Republic Act No. 10173</p>
              </div>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto p-6 space-y-4 text-sm text-[#4b5563] dark:text-gray-300 leading-relaxed">
              <p>
                In compliance with the <strong className="text-[#0d1b11] dark:text-white">Data Privacy Act of 2012 (RA 10173)</strong>, 
                LifeFlow collects and processes your personal information solely for the purpose of facilitating blood donation 
                coordination in Baguio City.
              </p>
              <div>
                <p className="font-semibold text-[#0d1b11] dark:text-white mb-1">Information We Collect:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Full name and email address</li>
                  <li>Blood type and health-related donation history</li>
                  <li>Location (barangay) for donor matching</li>
                  <li>Contact details (optional, privacy-toggle enabled)</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-[#0d1b11] dark:text-white mb-1">Your Rights:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Right to access your personal data</li>
                  <li>Right to correct inaccurate data</li>
                  <li>Right to erasure or blocking</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                </ul>
              </div>
              <p>
                Your data will <strong className="text-[#0d1b11] dark:text-white">never be sold</strong> to third parties. 
                The Privacy Toggle feature allows you to hide your contact information from public view at any time.
              </p>
              <p className="text-xs text-[#4b5563]/70 dark:text-gray-500">
                For concerns, contact the Data Protection Officer at the Baguio City Health Services Office.
              </p>
            </div>
            <div className="p-6 border-t border-[#cfe7d5] dark:border-gray-700 flex gap-3">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="flex-1 py-3 rounded-xl border border-[#cfe7d5] dark:border-gray-600 text-[#0d1b11] dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setValue('consent', true, { shouldValidate: true })
                  setShowPrivacyModal(false)
                }}
                className="flex-1 py-3 rounded-xl bg-[#2bee5b] text-black font-bold hover:bg-[#2bee5b]/90 transition-colors"
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
