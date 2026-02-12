import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DonorIDClient from './DonorIDClient'

export default async function DonorIDPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, blood_type, barangay, privacy_enabled, weight, height')
    .eq('id', user.id)
    .single()

  const { data: donations } = await supabase
    .from('donation_history')
    .select('donated_at')
    .eq('donor_id', user.id)
    .order('donated_at', { ascending: false })

  const donorId = `BGO-${new Date().getFullYear()}-${user.id.slice(-4).toUpperCase()}`
  const totalDonations = donations?.length ?? 0
  const lastDonation = donations?.[0]?.donated_at ?? null

  return (
    <DonorIDClient
      profile={profile}
      userId={user.id}
      donorId={donorId}
      totalDonations={totalDonations}
      lastDonation={lastDonation}
    />
  )
}
