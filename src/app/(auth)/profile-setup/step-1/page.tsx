'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveStep1Action } from '@/app/actions/profile'

export default function ProfileSetupStep1() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [onMedication, setOnMedication] = useState(false)
  const [errors, setErrors] = useState<{ weight?: string; height?: string; general?: string }>({})

  const validate = () => {
    const newErrors: typeof errors = {}
    const w = parseFloat(weight)
    const h = parseFloat(height)
    if (!weight) newErrors.weight = 'Weight is required'
    else if (isNaN(w) || w < 50) newErrors.weight = 'You must weigh at least 50 kg to donate'
    else if (w > 300) newErrors.weight = 'Please enter a valid weight'
    if (!height) newErrors.height = 'Height is required'
    else if (isNaN(h) || h < 100 || h > 250) newErrors.height = 'Please enter a valid height (100–250 cm)'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validate()) return
    startTransition(async () => {
      const result = await saveStep1Action({
        weight: parseFloat(weight),
        height: parseFloat(height),
        on_medication: onMedication,
      })
      if (result?.error) {
        setErrors({ general: result.error })
        return
      }
      router.push('/profile-setup/step-2')
    })
  }

  return (
    <div className="relative mx-auto min-h-screen max-w-md bg-[#f6f8f6] dark:bg-[#102215] flex flex-col">

      {/* Top App Bar */}
      <header className="flex items-center bg-[#f6f8f6] dark:bg-[#102215] p-4 pb-2 justify-between sticky top-0 z-10">
        <button
          onClick={() => router.push('/login')}
          className="text-[#0d1b11] dark:text-white flex size-12 shrink-0 items-center cursor-pointer hover:text-[#2bee5b] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-[#0d1b11] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Profile Setup
        </h2>
      </header>

      {/* Progress Bar */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex justify-between items-end">
          <p className="text-[#0d1b11] dark:text-white text-base font-semibold leading-normal">
            Basic Health Stats
          </p>
          <p className="text-[#0d1b11] dark:text-white text-sm font-medium leading-normal">
            Step 1 of 3
          </p>
        </div>
        <div className="rounded-full bg-[#cfe7d5] dark:bg-white/10 h-2 w-full overflow-hidden">
          <div className="h-full rounded-full bg-[#2bee5b] transition-all duration-500" style={{ width: '33.33%' }} />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">

        {/* Headline */}
        <div className="px-4 pt-5 pb-2">
          <h3 className="text-[#0d1b11] dark:text-white tracking-tight text-2xl font-bold leading-tight">
            Tell us about your health
          </h3>
        </div>

        {/* Body */}
        <div className="px-4 pt-1 pb-6">
          <p className="text-[#0d1b11]/70 dark:text-white/70 text-base font-normal leading-relaxed">
            This information helps us determine your eligibility for blood donation in Baguio City. Your safety is our priority.
          </p>
        </div>

        <div className="space-y-4 px-4 pb-10">

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 dark:text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Weight Field */}
          <div className="flex flex-col">
            <label className="flex flex-col w-full">
              <p className="text-[#0d1b11] dark:text-white text-sm font-semibold leading-normal pb-2">
                Weight (kg)
              </p>
              <div className="relative">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => { setWeight(e.target.value); setErrors(p => ({ ...p, weight: undefined })) }}
                  placeholder="e.g. 70"
                  min={0}
                  className={`w-full rounded-lg text-[#0d1b11] dark:text-white border bg-white dark:bg-white/5 h-14 placeholder:text-[#4c9a5f]/60 dark:placeholder:text-white/30 p-[15px] pr-14 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#2bee5b] transition-colors ${
                    errors.weight ? 'border-red-400' : 'border-[#cfe7d5] dark:border-white/20'
                  }`}
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <span className="text-[#4c9a5f] dark:text-white/40 font-medium">kg</span>
                </div>
              </div>
            </label>
            {errors.weight
              ? <p className="text-xs text-red-500 mt-1.5 px-1">{errors.weight}</p>
              : <p className="text-xs text-[#4c9a5f] mt-1.5 px-1">Donors must weigh at least 50 kg.</p>
            }
          </div>

          {/* Height Field */}
          <div className="flex flex-col">
            <label className="flex flex-col w-full">
              <p className="text-[#0d1b11] dark:text-white text-sm font-semibold leading-normal pb-2">
                Height (cm)
              </p>
              <div className="relative">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => { setHeight(e.target.value); setErrors(p => ({ ...p, height: undefined })) }}
                  placeholder="e.g. 175"
                  min={0}
                  className={`w-full rounded-lg text-[#0d1b11] dark:text-white border bg-white dark:bg-white/5 h-14 placeholder:text-[#4c9a5f]/60 dark:placeholder:text-white/30 p-[15px] pr-14 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#2bee5b] transition-colors ${
                    errors.height ? 'border-red-400' : 'border-[#cfe7d5] dark:border-white/20'
                  }`}
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <span className="text-[#4c9a5f] dark:text-white/40 font-medium">cm</span>
                </div>
              </div>
            </label>
            {errors.height && (
              <p className="text-xs text-red-500 mt-1.5 px-1">{errors.height}</p>
            )}
          </div>

          {/* Medication Toggle */}
          <div className="mt-6 flex flex-col gap-4 p-5 rounded-xl border border-[#cfe7d5] dark:border-white/10 bg-white dark:bg-white/5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-[#0d1b11] dark:text-white text-base font-semibold leading-tight">
                  Medication Status
                </p>
                <p className="text-[#0d1b11]/60 dark:text-white/50 text-xs mt-1">
                  Are you currently taking any prescription medicine?
                </p>
              </div>
              {/* Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={onMedication}
                onClick={() => setOnMedication(!onMedication)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2bee5b] focus:ring-offset-2 ${
                  onMedication ? 'bg-[#2bee5b]' : 'bg-[#cfe7d5] dark:bg-white/10'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white border border-gray-200 shadow-sm transition-transform duration-200 ${
                    onMedication ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#2bee5b]/10 border border-[#2bee5b]/20 mt-4">
            <svg className="w-5 h-5 text-[#2bee5b] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-[#0d1b11]/80 dark:text-white/80 leading-relaxed">
              In Baguio City, specific medications like antibiotics may require a temporary deferral period before you can donate.
            </p>
          </div>

        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="p-4 bg-[#f6f8f6] dark:bg-[#102215] border-t border-[#cfe7d5] dark:border-white/10">
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={isPending}
            className="flex items-center justify-center gap-2 bg-[#2bee5b] hover:bg-[#2bee5b]/90 transition-opacity px-8 py-4 rounded-full text-[#0d1b11] font-bold text-base shadow-lg shadow-[#2bee5b]/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                Next Step
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </footer>

    </div>
  )
}
