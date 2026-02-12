import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'

export default async function DonorLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, blood_type, barangay, privacy_enabled, emergency_contact_phone')
    .eq('id', user.id)
    .single()

  return (
    <DashboardShell profile={profile} userId={user.id}>
      {children}
    </DashboardShell>
  )
}
