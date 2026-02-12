export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown'
export type UserRole = 'donor' | 'admin'

export interface Profile {
  id: string
  full_name: string
  blood_type: BloodType | null
  barangay: string | null
  phone: string | null
  is_available: boolean
  privacy_enabled: boolean
  consent_given: boolean
  role: UserRole
  // Profile setup fields
  weight: number | null
  height: number | null
  on_medication: boolean
  preferred_donation_day: 'any' | 'weekdays' | 'weekends' | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  sms_alerts_enabled: boolean
  profile_completed: boolean   // ← the key flag for redirect logic
  created_at: string
  updated_at: string
}

export interface DonationHistory {
  id: string
  donor_id: string
  donation_date: string
  location: string | null
  verified: boolean
  notes: string | null
  created_at: string
}

export interface BloodRequest {
  id: string
  blood_type: BloodType
  urgency: 'normal' | 'urgent' | 'critical'
  hospital: string | null
  barangay: string | null
  posted_by: string | null
  is_fulfilled: boolean
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      donation_history: {
        Row: DonationHistory
        Insert: Omit<DonationHistory, 'id' | 'created_at'>
        Update: Partial<Omit<DonationHistory, 'id' | 'created_at'>>
      }
      blood_requests: {
        Row: BloodRequest
        Insert: Omit<BloodRequest, 'id' | 'created_at'>
        Update: Partial<Omit<BloodRequest, 'id' | 'created_at'>>
      }
    }
  }
}