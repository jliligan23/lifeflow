'use client'

import { Suspense } from 'react'
import VerifyOTPClient from './VerifyOTPClient'

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#f6f8f6] dark:bg-[#102215] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-[#2bee5b] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#4b5563] dark:text-gray-400">Loading verification...</p>
        </div>
      </div>
    }>
      <VerifyOTPClient />
    </Suspense>
  )
}
