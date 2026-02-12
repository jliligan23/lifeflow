'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// ─── Slide Data ────────────────────────────────────────────────────────────────
const SLIDES = [
  { id: 0, dotWidth: 'w-6' },
  { id: 1, dotWidth: 'w-6' },
  { id: 2, dotWidth: 'w-10' },
]

// ─── Slide 1: Welcome to LifeFlow ─────────────────────────────────────────────
function Slide1() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      {/* Illustration */}
      <div className="relative w-full max-w-[320px] aspect-square mb-8">
        <div className="absolute inset-0 bg-[#2bee5b]/10 dark:bg-[#2bee5b]/5 rounded-full scale-110" />
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm bg-gradient-to-br from-[#2bee5b]/20 to-[#2bee5b]/5 flex items-center justify-center">
          {/* Pine tree silhouettes - Baguio City */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d1fae5"/>
                <stop offset="100%" stopColor="#f6f8f6"/>
              </linearGradient>
            </defs>
            <rect width="320" height="320" fill="url(#skyGrad)"/>
            {/* Mountains */}
            <polygon points="0,220 80,100 160,220" fill="#6ee7a0" opacity="0.5"/>
            <polygon points="100,220 200,80 300,220" fill="#4ade80" opacity="0.4"/>
            <polygon points="180,220 270,120 320,220" fill="#86efac" opacity="0.3"/>
            {/* Pine trees */}
            {[40, 90, 140, 200, 250, 290].map((x, i) => (
              <g key={i} transform={`translate(${x}, ${200 + (i % 2) * 10})`}>
                <polygon points="0,-40 -12,0 12,0" fill="#16a34a" opacity="0.8"/>
                <polygon points="0,-55 -9,-15 9,-15" fill="#15803d" opacity="0.9"/>
                <rect x="-3" y="0" width="6" height="12" fill="#92400e" opacity="0.6"/>
              </g>
            ))}
          </svg>
          {/* Center icon */}
          <div className="relative z-10 bg-white dark:bg-zinc-800 p-5 rounded-full shadow-xl border-4 border-[#2bee5b]/20">
            <svg className="w-12 h-12 text-[#2bee5b]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
        </div>
      </div>
      {/* Text */}
      <div className="text-center space-y-3">
        <h1 className="text-zinc-900 dark:text-zinc-100 tracking-tight text-3xl font-bold leading-tight">
          Welcome to LifeFlow Baguio
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg font-normal leading-relaxed px-4">
          Your digital companion for saving lives in the Summer Capital.
        </p>
      </div>
    </div>
  )
}

// ─── Slide 2: Digital Donor ID ─────────────────────────────────────────────────
function Slide2() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
      {/* Phone Mockup */}
      <div className="w-full max-w-[240px] aspect-[9/16] bg-[#0d1b11] rounded-[2.5rem] border-[6px] border-[#1a2e1f] shadow-2xl relative overflow-hidden flex flex-col p-3 mb-8">
        <div className="w-full h-full bg-white rounded-[1.8rem] overflow-hidden flex flex-col">
          {/* App Header in Mockup */}
          <div className="bg-[#2bee5b]/10 p-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#2bee5b] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-[#0d1b11]">BAGUIO HEALTH</span>
              <span className="text-[6px] text-[#4c9a5f]">Digital Donor Portal</span>
            </div>
          </div>
          {/* ID Card */}
          <div className="p-3 flex-1 flex flex-col gap-3">
            <div className="w-full aspect-[1.6/1] bg-gradient-to-br from-[#0d1b11] to-[#1a2e1f] rounded-lg p-3 text-white relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[6px] opacity-70">DONOR NAME</p>
                  <p className="text-[9px] font-bold">JUAN DELA CRUZ</p>
                </div>
                <div className="text-right">
                  <p className="text-[6px] opacity-70">BLOOD TYPE</p>
                  <p className="text-sm font-bold text-[#2bee5b]">O+</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-[5px] opacity-50 uppercase tracking-widest">Authorized by Baguio City Health Services</p>
              </div>
              <div className="absolute -right-2 -bottom-2 w-10 h-10 bg-[#2bee5b]/20 rounded-full blur-xl"/>
            </div>
            {/* QR Code */}
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <div className="relative">
                <div className="w-24 h-24 bg-white p-1.5 rounded-lg border border-[#2bee5b]/20"
                  style={{ boxShadow: '0 0 15px 3px rgba(43,238,91,0.3)' }}>
                  <div className="w-full h-full bg-[#0d1b11] rounded flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-0.5 w-16 h-16">
                      {[1,0.4,1,0.6,1,0.8,1,0.3,1].map((opacity, i) => (
                        <div key={i} className="bg-[#2bee5b] rounded-sm" style={{ opacity }}/>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-1 rounded-lg border-2 border-[#2bee5b] animate-pulse opacity-40"/>
              </div>
              <p className="text-[8px] text-center text-slate-500 font-medium">SCAN TO VERIFY</p>
            </div>
          </div>
        </div>
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-[#1a2e1f] rounded-b-xl"/>
      </div>
      {/* Text */}
      <div className="text-center">
        <h2 className="text-[#0d1b11] dark:text-white tracking-tight text-[26px] font-bold leading-tight px-4 pb-3">
          Your Digital Donor ID
        </h2>
        <p className="text-[#4c6050] dark:text-slate-400 text-base font-normal leading-relaxed px-4 max-w-sm mx-auto">
          Skip the paperwork. Your verified blood type and history are just a scan away at any local hospital in Baguio City.
        </p>
      </div>
    </div>
  )
}

// ─── Slide 3: Emergency Alerts ─────────────────────────────────────────────────
function Slide3() {
  return (
    <div className="flex-1 flex flex-col px-6 items-center">
      {/* Hero Illustration */}
      <div className="w-full max-w-sm mb-8 mt-4">
        <div className="relative w-full aspect-square flex items-center justify-center">
          <div className="absolute inset-0 bg-[#2bee5b]/10 dark:bg-[#2bee5b]/5 rounded-full scale-90 blur-3xl"/>
          {/* Alert Card */}
          <div className="relative z-10 w-full max-w-[280px] bg-white dark:bg-[#1a2e1e] rounded-xl shadow-xl p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg className="w-7 h-7 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Emergency Alert</p>
                <p className="text-sm font-semibold text-[#0d1b11] dark:text-white">Baguio General Hospital</p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-[#243a28] p-4 rounded-lg border-l-4 border-red-500">
              <p className="text-base font-bold text-[#0d1b11] dark:text-white mb-1">O+ Blood Required</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Immediate donation needed for emergency surgery. Can you help?
              </p>
            </div>
            <div className="mt-4 flex justify-between items-center text-[10px] text-gray-400">
              <span>Just now • Baguio City</span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                1.2km away
              </span>
            </div>
          </div>
          {/* Bell badge */}
          <div className="absolute -top-4 -right-2 w-16 h-16 bg-[#2bee5b] rounded-full flex items-center justify-center shadow-lg border-4 border-[#f6f8f6] dark:border-[#102215]">
            <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </div>
        </div>
      </div>
      {/* Text */}
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-[#0d1b11] dark:text-white tracking-tight text-[30px] font-bold leading-tight pb-3">
          Be a Hero in Real-Time
        </h1>
        <p className="text-[#0d1b11]/70 dark:text-gray-300 text-lg font-normal leading-relaxed px-2">
          Receive instant notifications when there is an urgent blood need in Baguio City. Your contribution can save lives during emergencies.
        </p>
      </div>
    </div>
  )
}

// ─── Main Onboarding Component ─────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')

  const isLastSlide = currentSlide === SLIDES.length - 1

  // Sets the cookie and navigates away
  const finishOnboarding = useCallback((destination: '/login' | '/register') => {
    // Set a cookie so middleware knows onboarding was seen
    document.cookie = 'lifeflow_onboarding_seen=true; path=/; max-age=31536000; SameSite=Lax'
    router.push(destination)
  }, [router])

  const goNext = () => {
    if (isAnimating) return
    if (isLastSlide) {
      finishOnboarding('/register')
      return
    }
    setIsAnimating(true)
    setDirection('forward')
    setTimeout(() => {
      setCurrentSlide(s => s + 1)
      setIsAnimating(false)
    }, 220)
  }

  const goBack = () => {
    if (isAnimating || currentSlide === 0) return
    setIsAnimating(true)
    setDirection('back')
    setTimeout(() => {
      setCurrentSlide(s => s - 1)
      setIsAnimating(false)
    }, 220)
  }

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return
    setDirection(index > currentSlide ? 'forward' : 'back')
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentSlide(index)
      setIsAnimating(false)
    }, 220)
  }

  const slides = [<Slide1 key={0} />, <Slide2 key={1} />, <Slide3 key={2} />]

  return (
    <div className="relative flex min-h-screen max-w-md mx-auto flex-col overflow-hidden bg-[#f6f8f6] dark:bg-[#102215] shadow-2xl">

      {/* Top Bar */}
      <div className="flex items-center justify-between p-6 pt-10">
        {/* Back button — hidden on slide 1 */}
        <div className="w-12">
          {currentSlide > 0 && (
            <button
              onClick={goBack}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#2bee5b]/10 transition-colors text-[#0d1b11] dark:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Step indicator (slide 3 only, matching the design) */}
        {currentSlide === 2 && (
          <div className="text-[#0d1b11] dark:text-white font-semibold text-base">Step 3 of 3</div>
        )}

        {/* Skip button */}
        <button
          onClick={() => finishOnboarding('/login')}
          className="text-[#4c9a5f] dark:text-[#2bee5b] text-base font-bold leading-normal hover:opacity-80 transition-opacity"
        >
          Skip
        </button>
      </div>

      {/* Slide Content — animated */}
      <div
        className="flex-1 flex flex-col transition-all duration-220"
        style={{
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating
            ? `translateX(${direction === 'forward' ? '-20px' : '20px'})`
            : 'translateX(0)',
          transition: 'opacity 0.22s ease, transform 0.22s ease',
        }}
      >
        {slides[currentSlide]}
      </div>

      {/* Footer */}
      <div className="px-6 pb-12 pt-4">
        {/* Dot Indicators */}
        <div className="flex w-full flex-row items-center justify-center gap-2 mb-8">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? 'bg-[#2bee5b] w-6 shadow-[0_0_10px_rgba(43,238,91,0.4)]'
                  : 'bg-[#2bee5b]/20 dark:bg-[#2bee5b]/10 w-2'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={goNext}
          className="w-full bg-[#2bee5b] text-[#0d1b11] text-lg font-bold py-4 rounded-full shadow-lg shadow-[#2bee5b]/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {isLastSlide ? 'Get Started' : 'Next'}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        {/* Terms note on last slide */}
        {isLastSlide && (
          <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-500 font-medium">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        )}

        {/* Sign in link */}
        {isLastSlide && (
          <p className="mt-3 text-center text-sm text-[#4b5563] dark:text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => finishOnboarding('/login')}
              className="text-[#2bee5b] font-bold hover:underline"
            >
              Sign In
            </button>
          </p>
        )}

        <div className="h-6" />
      </div>

    </div>
  )
}
