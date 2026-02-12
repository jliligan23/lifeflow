'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/* ── Types ── */
type YesNo = 'yes' | 'no' | null
type TravelOption = 'none' | 'domestic' | 'international' | null

interface Step1 { feelingWell: YesNo; travel: TravelOption; antibiotics: boolean; bpMeds: boolean; recentTattoo: boolean; recentSurgery: boolean; fever: YesNo }
interface Step2 { heartDisease: YesNo; diabetes: YesNo; epilepsy: YesNo; hiv: YesNo; hepatitis: YesNo; cancer: YesNo; asthma: YesNo; kidneyDisease: YesNo; stdHistory: YesNo; recentVaccine: YesNo }
interface Step3 { lastDonation: 'never'|'lt3mo'|'3to6mo'|'gt6mo'|null; alcoholLast24h: YesNo; smoker: YesNo; pregnantOrNursing: YesNo; weightConfirm: YesNo; ageConfirm: YesNo; consentAccurate: boolean }

/* ── Helpers ── */
const YesNoButtons = ({ value, onChange }: { value: YesNo; onChange: (v: YesNo) => void }) => (
  <div className="grid grid-cols-2 gap-3">
    {(['yes','no'] as YesNo[]).map(opt => (
      <button key={opt!} type="button" onClick={() => onChange(opt)}
        className={`py-3 px-4 rounded-xl border-2 font-bold capitalize transition-all ${value===opt ? 'border-[#ec1337] bg-[#ec1337]/10 text-[#ec1337]' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>
        {opt}
      </button>
    ))}
  </div>
)

const Toggle = ({ checked, onChange, label, sub }: { checked: boolean; onChange: () => void; label: string; sub?: string }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
    <div className="flex-1 pr-4">
      <p className="text-sm font-medium">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
    <button role="switch" aria-checked={checked} onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${checked ? 'bg-[#ec1337]' : 'bg-gray-300 dark:bg-gray-700'}`}>
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white border border-gray-200 shadow-sm transition-transform mt-0.5 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  </div>
)

const Divider = () => <hr className="border-gray-200 dark:border-gray-800" />
const Q = ({ children }: { children: React.ReactNode }) => <p className="text-base font-medium leading-snug">{children}</p>
const InfoBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#ec1337]/5 border border-[#ec1337]/20 rounded-xl p-4 flex gap-3">
    <svg className="w-5 h-5 text-[#ec1337] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
    <p className="text-xs text-[#ec1337] font-medium leading-relaxed">{children}</p>
  </div>
)

/* ── Result component ── */
function ScreeningResult({ passed, onRetake }: { passed: boolean; onRetake: () => void }) {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-[#ec1337]/10'}`}>
        {passed
          ? <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          : <svg className="w-12 h-12 text-[#ec1337]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
      </div>
      <h2 className={`text-2xl font-black mb-2 ${passed ? 'text-green-600' : 'text-[#ec1337]'}`}>
        {passed ? '✅ Eligible to Donate!' : '⚠️ Temporarily Deferred'}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-8">
        {passed
          ? 'Based on your answers, you appear eligible to donate blood. Please visit a licensed blood bank in Baguio City for the official screening.'
          : 'Based on your answers, you may not be eligible to donate at this time. Please consult a medical professional or revisit after your deferral period ends.'}
      </p>
      <div className="flex flex-col gap-3 w-full">
        {passed && (
          <button onClick={() => router.push('/donor/search')} className="w-full bg-[#ec1337] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#ec1337]/20">
            Find a Donation Center
          </button>
        )}
        <button onClick={onRetake} className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold py-4 rounded-xl">
          Retake Screening
        </button>
      </div>
    </div>
  )
}

/* ── Main Component ── */
export default function HealthScreeningPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [passed, setPassed] = useState(false)

  const [s1, setS1] = useState<Step1>({ feelingWell: null, travel: null, antibiotics: false, bpMeds: false, recentTattoo: false, recentSurgery: false, fever: null })
  const [s2, setS2] = useState<Step2>({ heartDisease: null, diabetes: null, epilepsy: null, hiv: null, hepatitis: null, cancer: null, asthma: null, kidneyDisease: null, stdHistory: null, recentVaccine: null })
  const [s3, setS3] = useState<Step3>({ lastDonation: null, alcoholLast24h: null, smoker: null, pregnantOrNursing: null, weightConfirm: null, ageConfirm: null, consentAccurate: false })

  const canContinueS1 = s1.feelingWell !== null && s1.travel !== null && s1.fever !== null
  const canContinueS2 = Object.values(s2).every(v => v !== null)
  const canContinueS3 = s3.lastDonation !== null && s3.alcoholLast24h !== null && s3.smoker !== null && s3.weightConfirm !== null && s3.ageConfirm !== null && s3.consentAccurate

  const evaluate = () => {
    const deferred =
      s1.feelingWell === 'no' || s1.fever === 'yes' ||
      s1.antibiotics || s1.recentSurgery ||
      s2.hiv === 'yes' || s2.hepatitis === 'yes' || s2.cancer === 'yes' ||
      s2.heartDisease === 'yes' || s2.epilepsy === 'yes' || s2.kidneyDisease === 'yes' ||
      s3.alcoholLast24h === 'yes' || s3.weightConfirm === 'no' || s3.ageConfirm === 'no' ||
      s3.pregnantOrNursing === 'yes' || s3.lastDonation === 'lt3mo'
    setPassed(!deferred)
    setDone(true)
  }

  const STEPS = ['Eligibility', 'Medical History', 'Lifestyle']
  const pct = Math.round((step / 3) * 100)

  if (done) return (
    <div className="text-[#1b0d10] dark:text-[#fcf8f9]">
      <header className="sticky top-0 z-50 bg-[#f8f6f6]/80 dark:bg-[#221013]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center p-4 justify-between">
          <button onClick={() => setDone(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h2 className="text-lg font-bold flex-1 text-center pr-10">Health Screening</h2>
        </div>
      </header>
      <ScreeningResult passed={passed} onRetake={() => { setDone(false); setStep(1); setS1({ feelingWell: null, travel: null, antibiotics: false, bpMeds: false, recentTattoo: false, recentSurgery: false, fever: null }); setS2({ heartDisease: null, diabetes: null, epilepsy: null, hiv: null, hepatitis: null, cancer: null, asthma: null, kidneyDisease: null, stdHistory: null, recentVaccine: null }); setS3({ lastDonation: null, alcoholLast24h: null, smoker: null, pregnantOrNursing: null, weightConfirm: null, ageConfirm: null, consentAccurate: false }) }} />
    </div>
  )

  return (
    <div className="text-[#1b0d10] dark:text-[#fcf8f9]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#f8f6f6]/80 dark:bg-[#221013]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center p-4 justify-between">
          <button onClick={() => step > 1 ? setStep(s => s-1) : router.push('/donor/dashboard')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h2 className="text-lg font-bold flex-1 text-center pr-10">Health Screening</h2>
        </div>
      </header>

      <main className="max-w-md mx-auto pb-32">
        {/* Progress */}
        <div className="flex flex-col gap-3 p-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Step {step} of 3</p>
              <p className="text-base font-semibold">{STEPS[step-1]}</p>
            </div>
            <p className="text-[#ec1337] text-sm font-bold">{pct}%</p>
          </div>
          <div className="rounded-full bg-[#ec1337]/20 h-2 overflow-hidden">
            <div className="h-full bg-[#ec1337] rounded-full transition-all duration-500" style={{width:`${pct}%`}} />
          </div>
          {/* Step dots */}
          <div className="flex gap-2 justify-center">
            {[1,2,3].map(n => (
              <div key={n} className={`h-1.5 rounded-full transition-all duration-300 ${n===step ? 'w-6 bg-[#ec1337]' : n<step ? 'w-3 bg-[#ec1337]/60' : 'w-3 bg-gray-300 dark:bg-gray-700'}`} />
            ))}
          </div>
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="px-4">
            <h3 className="text-2xl font-bold mb-1">General Health</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">Answer truthfully to ensure your safety and the recipient's safety.</p>
            <div className="space-y-6">
              <div className="space-y-3"><Q>Are you feeling well and healthy today?</Q><YesNoButtons value={s1.feelingWell} onChange={v => setS1(p => ({...p, feelingWell: v}))} /></div>
              <Divider />
              <div className="space-y-3"><Q>Do you have a fever right now or in the last 24 hours?</Q><YesNoButtons value={s1.fever} onChange={v => setS1(p => ({...p, fever: v}))} /></div>
              <Divider />
              <div className="space-y-3">
                <Q>Have you traveled outside Baguio City in the last 14 days?</Q>
                <div className="space-y-2">
                  {[{val:'none',label:'No, I stayed in the city'},{val:'domestic',label:'Yes, within the Philippines'},{val:'international',label:'Yes, international travel'}].map(opt => (
                    <label key={opt.val} className={`flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 border cursor-pointer transition-colors ${s1.travel===opt.val ? 'border-[#ec1337]/50 bg-[#ec1337]/5 dark:bg-[#ec1337]/5' : 'border-gray-200 dark:border-gray-700 hover:border-[#ec1337]/30'}`}>
                      <span className="font-medium text-sm">{opt.label}</span>
                      <input type="radio" name="travel" checked={s1.travel===opt.val} onChange={() => setS1(p => ({...p, travel: opt.val as TravelOption}))} className="w-5 h-5 accent-[#ec1337]" />
                    </label>
                  ))}
                </div>
              </div>
              <Divider />
              <div className="space-y-3">
                <Q>Are you currently taking any of the following?</Q>
                <div className="space-y-2">
                  <Toggle checked={s1.antibiotics} onChange={() => setS1(p=>({...p,antibiotics:!p.antibiotics}))} label="Antibiotics" sub="Last 7 days" />
                  <Toggle checked={s1.bpMeds} onChange={() => setS1(p=>({...p,bpMeds:!p.bpMeds}))} label="Blood pressure medication" />
                  <Toggle checked={s1.recentTattoo} onChange={() => setS1(p=>({...p,recentTattoo:!p.recentTattoo}))} label="Tattoo or piercing" sub="Within the last 12 months" />
                  <Toggle checked={s1.recentSurgery} onChange={() => setS1(p=>({...p,recentSurgery:!p.recentSurgery}))} label="Major surgery or dental procedure" sub="Within the last 6 months" />
                </div>
              </div>
              <InfoBox>If you have had a tattoo or piercing in the last 12 months, you may be temporarily deferred from donation. This is standard protocol for all Baguio blood banks.</InfoBox>
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="px-4">
            <h3 className="text-2xl font-bold mb-1">Medical History</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">Have you ever been diagnosed with any of the following conditions?</p>
            <div className="space-y-5">
              {([
                {key:'heartDisease',   label:'Heart disease or stroke',             sub:'Including coronary artery disease'},
                {key:'diabetes',       label:'Diabetes',                             sub:'Type 1 or Type 2'},
                {key:'epilepsy',       label:'Epilepsy or seizure disorder',         sub:''},
                {key:'hiv',            label:'HIV / AIDS',                           sub:'Including positive test results'},
                {key:'hepatitis',      label:'Hepatitis B or C',                     sub:''},
                {key:'cancer',         label:'Cancer or leukemia',                   sub:'Including remission'},
                {key:'asthma',         label:'Severe asthma',                        sub:'Requiring hospitalization'},
                {key:'kidneyDisease',  label:'Kidney disease',                       sub:'Chronic kidney disease or dialysis'},
                {key:'stdHistory',     label:'Syphilis or other STI',               sub:'In the past 12 months'},
                {key:'recentVaccine',  label:'Received a vaccine recently',          sub:'Within the last 4 weeks'},
              ] as {key: keyof Step2, label: string, sub: string}[]).map(({key, label, sub}) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Q>{label}{sub && <span className="text-xs text-gray-500 font-normal ml-1">({sub})</span>}</Q>
                  </div>
                  <YesNoButtons value={s2[key]} onChange={v => setS2(p => ({...p, [key]: v}))} />
                  {key !== 'recentVaccine' && <Divider />}
                </div>
              ))}
              <InfoBox>Your medical history is kept strictly confidential in accordance with RA 10173 (Data Privacy Act). This information is only used for donation eligibility purposes.</InfoBox>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div className="px-4">
            <h3 className="text-2xl font-bold mb-1">Lifestyle & Consent</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">A few final questions to complete your pre-donation assessment.</p>
            <div className="space-y-6">
              <div className="space-y-3">
                <Q>When was your last blood donation?</Q>
                <div className="space-y-2">
                  {[{val:'never',label:'I have never donated before'},{val:'lt3mo',label:'Less than 3 months ago'},{val:'3to6mo',label:'3 to 6 months ago'},{val:'gt6mo',label:'More than 6 months ago'}].map(opt => (
                    <label key={opt.val} className={`flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 border cursor-pointer transition-colors ${s3.lastDonation===opt.val ? 'border-[#ec1337]/50 bg-[#ec1337]/5' : 'border-gray-200 dark:border-gray-700 hover:border-[#ec1337]/30'}`}>
                      <span className="font-medium text-sm">{opt.label}</span>
                      <input type="radio" name="lastDonation" checked={s3.lastDonation===opt.val} onChange={() => setS3(p => ({...p, lastDonation: opt.val as Step3['lastDonation']}))} className="w-5 h-5 accent-[#ec1337]" />
                    </label>
                  ))}
                </div>
              </div>
              <Divider />
              <div className="space-y-3"><Q>Did you consume alcohol in the last 24 hours?</Q><YesNoButtons value={s3.alcoholLast24h} onChange={v => setS3(p => ({...p, alcoholLast24h: v}))} /></div>
              <Divider />
              <div className="space-y-3"><Q>Do you currently smoke cigarettes or use tobacco products?</Q><YesNoButtons value={s3.smoker} onChange={v => setS3(p => ({...p, smoker: v}))} /></div>
              <Divider />
              <div className="space-y-3"><Q>Are you currently pregnant, recently given birth, or breastfeeding?</Q><YesNoButtons value={s3.pregnantOrNursing} onChange={v => setS3(p => ({...p, pregnantOrNursing: v}))} /></div>
              <Divider />
              <div className="space-y-3"><Q>Do you weigh at least 50 kg (110 lbs)?</Q><YesNoButtons value={s3.weightConfirm} onChange={v => setS3(p => ({...p, weightConfirm: v}))} /></div>
              <Divider />
              <div className="space-y-3"><Q>Are you between 16 and 65 years of age?</Q><YesNoButtons value={s3.ageConfirm} onChange={v => setS3(p => ({...p, ageConfirm: v}))} /></div>
              <Divider />
              {/* Consent checkbox */}
              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <input type="checkbox" checked={s3.consentAccurate} onChange={e => setS3(p => ({...p, consentAccurate: e.target.checked}))} className="mt-0.5 w-5 h-5 accent-[#ec1337] shrink-0" />
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  I confirm that all information I provided is accurate and truthful. I understand that providing false information may affect the safety of the blood supply and the recipient.
                </p>
              </label>
              <InfoBox>This in-app screening is for informational purposes only. A licensed medical professional at the blood bank will conduct the official screening before your donation.</InfoBox>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#221013]/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 p-4 pb-8">
        <div className="max-w-md mx-auto flex gap-4">
          <button onClick={() => step > 1 ? setStep(s => s-1) : router.push('/donor/dashboard')}
            className="flex-1 py-4 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={() => step < 3 ? setStep(s => s+1) : evaluate()}
            disabled={step===1 ? !canContinueS1 : step===2 ? !canContinueS2 : !canContinueS3}
            className="flex-[2] py-4 bg-[#ec1337] text-white font-bold rounded-xl shadow-lg shadow-[#ec1337]/20 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            {step < 3 ? `Continue to Step ${step+1}` : 'Submit Screening'}
          </button>
        </div>
      </footer>
    </div>
  )
}
