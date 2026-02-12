'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveStep3Action } from '@/app/actions/profile'

export default function ProfileSetupStep3() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [smsAlerts, setSmsAlerts] = useState(true)
  const [errors, setErrors] = useState<{ name?: string; phone?: string; general?: string }>({})

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!contactName.trim() || contactName.trim().length < 2) {
      newErrors.name = 'Please enter your emergency contact name'
    }
    const digits = contactPhone.replace(/\D/g, '')
    if (!contactPhone) {
      newErrors.phone = 'Phone number is required'
    } else if (digits.length < 10 || digits.length > 11) {
      newErrors.phone = 'Please enter a valid 10-11 digit phone number'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFinish = () => {
    if (!validate()) return
    startTransition(async () => {
      const result = await saveStep3Action({
        emergency_contact_name: contactName.trim(),
        emergency_contact_phone: contactPhone.replace(/\D/g, ''),
        sms_alerts_enabled: smsAlerts,
      })
      // saveStep3Action redirects on success — if we get here it's an error
      if (result?.error) {
        setErrors({ general: result.error })
      }
    })
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-[#f6f8f6] dark:bg-[#102215]">

      {/* Top App Bar */}
      <div className="flex items-center p-4 pb-2 justify-between">
        <button
          onClick={() => router.push('/profile-setup/step-2')}
          className="text-[#0d1b11] dark:text-white flex size-10 shrink-0 items-center cursor-pointer hover:text-[#2bee5b] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-[#0d1b11] dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
          Profile Setup
        </h2>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2 p-4 pt-0">
        <div className="flex justify-between items-end">
          <p className="text-[#0d1b11] dark:text-white text-xs font-semibold uppercase tracking-wider">
            Final Step
          </p>
          <p className="text-[#0d1b11] dark:text-white text-sm font-medium">3 of 3</p>
        </div>
        <div className="rounded-full bg-[#cfe7d5] dark:bg-gray-700 h-2 overflow-hidden">
          <div className="h-full rounded-full bg-[#2bee5b] transition-all duration-500" style={{ width: '100%' }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-32">

        {/* Celebration Graphic */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative flex items-center justify-center w-24 h-24 bg-[#2bee5b]/10 rounded-full mb-4">
            {/* Celebration icon */}
            <svg className="w-12 h-12 text-[#2bee5b]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 21L23 12 2 3v7l15 2-15 2v7z"/>
            </svg>
            {/* Check badge */}
            <div className="absolute -top-1 -right-1 bg-[#2bee5b] text-white p-1 rounded-full border-2 border-[#f6f8f6] dark:border-[#102215]">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-[#0d1b11] dark:text-white text-2xl font-bold leading-tight text-center">
            Almost Done!
          </h2>
          <p className="text-[#4b5563] dark:text-gray-400 text-sm font-normal leading-relaxed text-center mt-2 px-4">
            Set up your emergency contact and alert preferences to stay informed about blood needs in Baguio City.
          </p>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 dark:text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <div className="space-y-6">

          {/* Emergency Contact Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#0d1b11] dark:text-white ml-1">
              Emergency Contact Name
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                type="text"
                value={contactName}
                onChange={(e) => { setContactName(e.target.value); setErrors(p => ({ ...p, name: undefined })) }}
                placeholder="Full Name"
                autoComplete="name"
                className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1a2e1f] border rounded-xl focus:ring-2 focus:ring-[#2bee5b] focus:border-transparent outline-none transition-all text-[#0d1b11] dark:text-white placeholder:text-gray-400 ${
                  errors.name ? 'border-red-400' : 'border-[#cfe7d5] dark:border-gray-700'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 ml-1">{errors.name}</p>
            )}
          </div>

          {/* Emergency Phone Number */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#0d1b11] dark:text-white ml-1">
              Emergency Phone Number
            </label>
            <div className="flex gap-2">
              {/* Country code */}
              <div className="flex items-center px-3 bg-white dark:bg-[#1a2e1f] border border-[#cfe7d5] dark:border-gray-700 rounded-xl text-[#4b5563] dark:text-gray-400 font-medium text-sm whitespace-nowrap">
                🇵🇭 +63
              </div>
              {/* Phone input */}
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => { setContactPhone(e.target.value); setErrors(p => ({ ...p, phone: undefined })) }}
                  placeholder="912 345 6789"
                  autoComplete="tel"
                  className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1a2e1f] border rounded-xl focus:ring-2 focus:ring-[#2bee5b] focus:border-transparent outline-none transition-all text-[#0d1b11] dark:text-white placeholder:text-gray-400 ${
                    errors.phone ? 'border-red-400' : 'border-[#cfe7d5] dark:border-gray-700'
                  }`}
                />
              </div>
            </div>
            {errors.phone && (
              <p className="text-xs text-red-500 ml-1">{errors.phone}</p>
            )}
          </div>

          {/* SMS Alerts Toggle Card */}
          <div className="bg-[#2bee5b]/10 dark:bg-[#2bee5b]/5 p-4 rounded-xl border border-[#2bee5b]/20 flex items-start gap-4">
            <div className="flex-1">
              <h4 className="font-bold text-[#0d1b11] dark:text-white text-base">
                Urgent Blood Alerts
              </h4>
              <p className="text-xs text-[#4b5563] dark:text-gray-400 mt-1 leading-snug">
                Receive SMS notifications when your blood type is urgently needed in Baguio General Hospital or other local facilities.
              </p>
            </div>
            {/* Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={smsAlerts}
              onClick={() => setSmsAlerts(!smsAlerts)}
              className={`relative inline-flex h-6 w-11 mt-1 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2bee5b] focus:ring-offset-2 ${
                smsAlerts ? 'bg-[#2bee5b]' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white border border-gray-200 shadow-sm transition-transform duration-200 ${
                  smsAlerts ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Baguio Location Card */}
          <div className="mt-2">
            <div className="w-full h-28 rounded-xl bg-gradient-to-br from-[#2bee5b]/20 to-[#2bee5b]/5 border border-[#2bee5b]/20 overflow-hidden relative flex items-end">
              {/* Decorative pine silhouettes */}
              <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 112" preserveAspectRatio="xMidYMid slice">
                {[0, 60, 120, 180, 240, 300, 360].map((x) => (
                  <polygon key={x} points={`${x+20},90 ${x+30},60 ${x+40},90`} fill="#2bee5b" />
                ))}
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end p-3">
                <span className="text-white text-[10px] font-medium flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  Serving Baguio City Residents
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-[#f6f8f6]/80 dark:bg-[#102215]/80 backdrop-blur-md border-t border-[#cfe7d5] dark:border-gray-800">
        <button
          onClick={handleFinish}
          disabled={isPending}
          className="w-full bg-[#2bee5b] hover:bg-[#2bee5b]/90 text-[#0d1b11] font-bold py-4 rounded-xl shadow-lg shadow-[#2bee5b]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Setting up your profile...
            </>
          ) : (
            <>
              Finish Setup
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
        <div className="h-4" />
      </div>

    </div>
  )
}
