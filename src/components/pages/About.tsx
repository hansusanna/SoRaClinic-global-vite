import type { Doctor, TimelineItem } from "@/db/type/about"
import DoctorsSection from '@/components/DoctorSection'
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
type JsonMod<T> = { default: T }

const mapLang = (lng: string) => {
  const l = lng.toLowerCase()
  if (l.startsWith('ko')) return 'ko'
  if (l.startsWith('zh') || l.startsWith('cn')) return 'cn'
  return 'en'
}

export default function About() {
  const { i18n } = useTranslation()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [timeline, setTimeline] = useState<TimelineItem[]>([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      const lang = mapLang(i18n.language)
      try {
        const [staffMod, timelineMod] = await Promise.all([
          import(`@/locales/${lang}/pages/doctors.json`),
          import(`@/locales/${lang}/pages/timeline.json`)
        ])
         if (!alive) return
      setDoctors(staffMod.default)
      setTimeline(timelineMod.default)
      } catch {
        // 폴백: 언어 JSON이 없으면 db의 기본 파일 사용
        const [staffMod, timelineMod] = await Promise.all([
          import('@/db/doctors.json') as Promise<JsonMod<Doctor[]>>,
          import('@/db/timeline.json') as Promise<JsonMod<TimelineItem[]>>
        ])
        if (!alive) return
         setDoctors(staffMod.default)
        setTimeline(timelineMod.default)
      }
    })()
    return () => { alive = false }
  }, [i18n.language])

  return (
    <div className="relative min-h-screen">
      {/* 컨텐츠 래퍼 */}
      <div className="relative z-20 p-5">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl mb-6 text-gray-800">
              About <span className="text-[#0ABAB5]">SoRa</span>
              <span className="text-pink-400">Clinic</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are passionate K-beauty experts dedicated to bringing you the authentic glass skin experience. 
              With years of expertise in Korean skincare traditions and a commitment to excellence, we make every treatment extraordinary.
            </p>
          </div>

          {/* Timeline Section */}
          <section className="mb-[70px] mx-[20px] px-[30px]">
            <h2 className="text-4xl text-center mb-12 text-gray-800">Our Beauty Journey</h2>
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 w-px h-full bg-[#0ABAB5]/30" />
              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <div
                    key={`${item.year}-${index}`}
                    className={`flex items-center ${
                      index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`w-1/2 ${
                        index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
                      }`}
                    >
                      <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-[#0ABAB5]/20 transition-all duration-300 hover:shadow-xl">
                        <div className="p-6">
                          <h3 className="text-2xl text-[#0ABAB5] mb-2 font-bold">{item.year}</h3>
                          <h4 className="text-lg mb-3 text-gray-800 font-semibold">{item.title}</h4>
                          <p className="text-gray-600 ">{item.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-4 h-4 bg-gradient-to-r from-[#0ABAB5] to-pink-400 rounded-full relative z-10 border-4 border-white shadow-lg" />
                    <div className="w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Doctors Section */}
          <section className="mb-[70px] mx-[30px]">
            <DoctorsSection doctors={doctors} />
          </section>

          {/* Mission Section */}
          <section>
            <div className="rounded-2xl p-12 border-2 border-slate-200">
              <div className="text-center">
                <h2 className="text-4xl mb-8 text-gray-800">Our Mission</h2>
                <p className="text-xl text-gray-500 max-w-4xl mx-auto ">
                  At SoRa Clinic, we believe that everyone deserves to achieve their dream skin. Our mission is to bring the authentic K-beauty 
                  experience to you through personalized treatments, expert care, and the finest Korean skincare traditions. We combine 
                  time-honored techniques with modern innovation to help you achieve that coveted glass skin glow.
                </p>
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  <div className="text-center bg-gray-100 p-3 rounded-2xl">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-[#0ABAB5]/10">
                      <svg className="w-8 h-8 text-[#0ABAB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Authentic K-Beauty</h3>
                    <p className="text-gray-600">Traditional Korean skincare wisdom meets modern innovation</p>
                  </div>
                  <div className="text-center bg-gray-100 p-3 rounded-2xl">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-pink-400/10">
                      <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Expert Care</h3>
                    <p className="text-gray-600">Highly trained specialists dedicated to your skin journey</p>
                  </div>
                  <div className="text-center bg-gray-100 p-3 rounded-2xl">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-purple-400/10">
                      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Personalized Results</h3>
                    <p className="text-gray-600">Customized treatments tailored to your unique skin needs</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
