'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, registerSchema } from '@/lib/validations/auth'

export async function loginAction(formData: FormData) {
  const supabase = await createClient()

  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Validate input
  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      error: parsed.error.errors[0].message,
    }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    // Return user-friendly error messages
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Incorrect email or password. Please try again.' }
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: 'Please verify your email address first. Check your inbox.' }
    }
    return { error: error.message }
  }

  // Get user profile to determine redirect
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication failed. Please try again.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Redirect based on role
  if (profile?.role === 'admin') {
    redirect('/admin/dashboard')
  } else {
    redirect('/donor/dashboard')
  }
}

export async function registerAction(formData: FormData) {
  const supabase = await createClient()

  const raw = {
    fullName: formData.get('fullName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    bloodType: formData.get('bloodType') as string,
    consent: formData.get('consent') === 'true',
  }

  // Validate input
  const parsed = registerSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      error: parsed.error.errors[0].message,
    }
  }

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        blood_type: parsed.data.bloodType,
        consent_given: parsed.data.consent,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'This email is already registered. Please login instead.' }
    }
    return { error: error.message }
  }

  return {
    success: true,
    message: 'Account created! Please check your email to verify your account.',
  }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}