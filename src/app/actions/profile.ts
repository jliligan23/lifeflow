'use server'

import { createClient } from '@/lib/supabase/server'
import { step1Schema, step2Schema, step3Schema } from '@/lib/validations/profile'
import { redirect } from 'next/navigation'

export async function saveStep1Action(data: {
  weight: number
  height: number
  on_medication: boolean
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const parsed = step1Schema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      weight: parsed.data.weight,
      height: parsed.data.height,
      on_medication: parsed.data.on_medication,
    })
    .eq('id', user.id)

  if (error) return { error: error.message }
  return { success: true }
}

export async function saveStep2Action(data: {
  barangay: string
  preferred_donation_day: 'any' | 'weekdays' | 'weekends'
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const parsed = step2Schema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      barangay: parsed.data.barangay,
      preferred_donation_day: parsed.data.preferred_donation_day,
    })
    .eq('id', user.id)

  if (error) return { error: error.message }
  return { success: true }
}

export async function saveStep3Action(data: {
  emergency_contact_name: string
  emergency_contact_phone: string
  sms_alerts_enabled: boolean
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const parsed = step3Schema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // Save step 3 AND mark profile as completed in one update
  const { error } = await supabase
    .from('profiles')
    .update({
      emergency_contact_name: parsed.data.emergency_contact_name,
      emergency_contact_phone: parsed.data.emergency_contact_phone,
      sms_alerts_enabled: parsed.data.sms_alerts_enabled,
      profile_completed: true,   // ← This unlocks the dashboard
    })
    .eq('id', user.id)

  if (error) return { error: error.message }

  redirect('/donor/dashboard')
}