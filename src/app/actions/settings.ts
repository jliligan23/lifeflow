'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

/* ── Change Password ── */
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least 1 uppercase letter')
    .regex(/[0-9]/, 'Must contain at least 1 number'),
})

export async function changePasswordAction(data: {
  currentPassword: string
  newPassword: string
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return { error: 'Not authenticated' }

  const parsed = changePasswordSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  // Re-authenticate to verify current password before allowing change
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.currentPassword,
  })
  if (signInError) return { error: 'Current password is incorrect.' }

  // Update to new password
  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  })
  if (updateError) return { error: updateError.message }

  return { success: true }
}

/* ── Edit Profile ── */
const editProfileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  blood_type: z.enum(['A+','A-','B+','B-','O+','O-','AB+','AB-'], {
    required_error: 'Please select a blood type',
  }),
  barangay: z.string().min(1, 'Please select your barangay'),
  weight: z.number().min(50, 'You must weigh at least 50 kg').max(300),
  height: z.number().min(100, 'Please enter a valid height').max(250),
  on_medication: z.boolean(),
  preferred_donation_day: z.enum(['any', 'weekdays', 'weekends']),
  emergency_contact_name: z.string().min(2, 'Emergency contact name is required').max(100),
  emergency_contact_phone: z
    .string()
    .min(10, 'Enter a valid phone number')
    .max(15)
    .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
  sms_alerts_enabled: z.boolean(),
})

export type EditProfileData = z.infer<typeof editProfileSchema>

export async function editProfileAction(data: EditProfileData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const parsed = editProfileSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: parsed.data.full_name,
      blood_type: parsed.data.blood_type,
      barangay: parsed.data.barangay,
      weight: parsed.data.weight,
      height: parsed.data.height,
      on_medication: parsed.data.on_medication,
      preferred_donation_day: parsed.data.preferred_donation_day,
      emergency_contact_name: parsed.data.emergency_contact_name,
      emergency_contact_phone: parsed.data.emergency_contact_phone,
      sms_alerts_enabled: parsed.data.sms_alerts_enabled,
    })
    .eq('id', user.id)

  if (error) return { error: error.message }
  return { success: true }
}

/* ── 2FA: Enroll TOTP ── */
export async function enroll2FAAction() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Check if already enrolled
  const { data: factorsData, error: listError } = await supabase.auth.mfa.listFactors()
  if (listError) return { error: listError.message }

  const existingFactor = factorsData?.totp?.[0]
  if (existingFactor?.status === 'verified') {
    return { error: 'Two-factor authentication is already enabled.' }
  }

  // Unenroll any unverified factor first (clean slate)
  if (existingFactor) {
    await supabase.auth.mfa.unenroll({ factorId: existingFactor.id })
  }

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp',
    issuer: 'LifeFlow Baguio',
  })

  if (error) return { error: error.message }

  return {
    success: true,
    factorId: data.id,
    qrCode: data.totp.qr_code,
    secret: data.totp.secret,
  }
}

/* ── 2FA: Verify and activate ── */
export async function verify2FAAction(data: { factorId: string; code: string }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
    factorId: data.factorId,
  })
  if (challengeError) return { error: challengeError.message }

  const { error: verifyError } = await supabase.auth.mfa.verify({
    factorId: data.factorId,
    challengeId: challengeData.id,
    code: data.code.replace(/\s/g, ''),
  })

  if (verifyError) {
    if (verifyError.message.includes('Invalid')) return { error: 'Invalid code. Please check your authenticator app and try again.' }
    return { error: verifyError.message }
  }

  return { success: true }
}

/* ── 2FA: Disable ── */
export async function disable2FAAction(data: { code: string }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: factorsData, error: listError } = await supabase.auth.mfa.listFactors()
  if (listError) return { error: listError.message }

  const factor = factorsData?.totp?.[0]
  if (!factor) return { error: 'Two-factor authentication is not enabled.' }

  // Verify the code before disabling
  const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
    factorId: factor.id,
  })
  if (challengeError) return { error: challengeError.message }

  const { error: verifyError } = await supabase.auth.mfa.verify({
    factorId: factor.id,
    challengeId: challengeData.id,
    code: data.code.replace(/\s/g, ''),
  })
  if (verifyError) return { error: 'Invalid code. Please check your authenticator app.' }

  const { error: unenrollError } = await supabase.auth.mfa.unenroll({
    factorId: factor.id,
  })
  if (unenrollError) return { error: unenrollError.message }

  return { success: true }
}

/* ── Update show_number preference ── */
export async function updatePrivacyAction(data: { show_number: boolean }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('profiles')
    .update({ privacy_enabled: data.show_number })
    .eq('id', user.id)

  if (error) return { error: error.message }
  return { success: true }
}