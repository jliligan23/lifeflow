import { z } from 'zod'

export const step1Schema = z.object({
  weight: z
    .number('Please enter your weight')
    .min(50, 'You must weigh at least 50 kg to donate blood')
    .max(300, 'Please enter a valid weight'),
  height: z
    .number('Please enter your height')
    .min(100, 'Please enter a valid height')
    .max(250, 'Please enter a valid height'),
  on_medication: z.boolean().default(false),
})

export const step2Schema = z.object({
  barangay: z
    .string()
    .min(1, 'Please select your barangay'),
  preferred_donation_day: z
    .enum(['any', 'weekdays', 'weekends'], {
      message: 'Please select your preferred donation day',
    }),
})

export const step3Schema = z.object({
  emergency_contact_name: z
    .string()
    .min(2, 'Please enter your emergency contact name')
    .max(100),
  emergency_contact_phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .max(15)
    .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
  sms_alerts_enabled: z.boolean().default(true),
})

export type Step1Data = z.infer<typeof step1Schema>
export type Step2Data = z.infer<typeof step2Schema>
export type Step3Data = z.infer<typeof step3Schema>