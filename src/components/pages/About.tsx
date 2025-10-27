// import type { Doctor, TimelineItem,  AboutPageData } from "@/db/type/about"
// import DoctorsSection from '@/components/DoctorSection'
// import { useEffect, useState } from "react"
// import { useTranslation } from "react-i18next" // i18next 훅 임포트


// // 언어 코드 매핑 함수 
// const mapLang = (lng: string) => {
//   const l = lng.toLowerCase()
//   if (l.startsWith('ko')) return 'ko'
//   if (l.startsWith('zh') || l.startsWith('cn')) return 'cn' // 중국어 간체/번체 등 고려
//   return 'en'
// }

// export default function About() {
//   // 'about' 네임스페이스 추가
//   const { t, i18n } = useTranslation(['about']) // 'common'이 필요하면 추가
//   const currentLang = i18n.language // mapLang 대신 i18n.language 직접 사용 가능

//   // 동적 데이터 상태
//   const [doctors, setDoctors] = useState<Doctor[]>([])
//   const [timeline, setTimeline] = useState<TimelineItem[]>([])

//   useEffect(() => {
//   let alive = true
//   ;(async () => {
//     const lang = mapLang(currentLang)
//     try {
//       const mod = await import(`@/locales/${lang}/pages/about.json`)
//       const data = (mod?.default ?? mod) as AboutPageData

//       if (!alive) return
//       setDoctors(Array.isArray(data?.doctors?.items) ? data.doctors.items : [])
//       setTimeline(Array.isArray(data?.timeline?.items) ? data.timeline.items : [])
//     } catch (error) {
//       console.error(`Failed to load about.json for ${lang}:`, error)
//       if (alive) {
//         setDoctors([])
//         setTimeline([])
//       }
//     }
//   })()
//   return () => { alive = false }
// }, [currentLang])

//   const isLoading = doctors.length === 0 && timeline.length === 0;

import type { Doctor, TimelineItem } from "@/db/type/about"
import DoctorsSection from '@/components/DoctorSection'
import { useTranslation } from "react-i18next"

export default function About() {
  const { t, i18n } = useTranslation(['about'])

  // i18n 리소스에서 바로 배열 꺼내쓰기
  const doctors  = (t('doctors.items',  { returnObjects: true }) as Doctor[]) ?? []
  const timeline = (t('timeline.items', { returnObjects: true }) as TimelineItem[]) ?? []

  // 초기 로딩 표시(선택)
  const isLoading = !i18n.isInitialized

  return (
    // 배경 그라데이션 등 스타일 추가 가능
    <div className="relative min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-pink-50/20 py-16 sm:py-24">
      {/* 컨텐츠 래퍼 */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 sm:mb-20"> 
            {/* t 함수 사용 */}
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
               {/* about.json의 'header.title.사용 */}
               {t('header.title')}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600 max-w-3xl mx-auto sm:text-xl">
               {/* about.json의 'header.subtitle' 사용 */}
               {t('header.subtitle')}
            </p>
          </div>

          {/* Timeline Section */}
          <section className="mb-20 sm:mb-24"> 
            {/* t 함수 사용 */}
            <h2 className="text-3xl font-bold tracking-tight text-pink-600 text-center mb-12 sm:text-4xl sm:mb-16">
              {t('timeline.title')}
            </h2>
            <div className="relative max-w-3xl mx-auto"> {/* 최대 너비 설정 */}
              {/* 중앙 라인 */}
              <div className="absolute left-1/2 top-2 bottom-2 w-1 -translate-x-1/2 bg-gradient-to-b from-[#0ABAB5]/20 via-[#0ABAB5]/50 to-pink-400/30 rounded-full" aria-hidden="true" />
              <div className="space-y-12">
                {isLoading ? (
                    <p className="text-center text-gray-500">타임라인 정보를 불러오는 중...</p>
                ) : timeline.length === 0 ? (
                    <p className="text-center text-gray-500">타임라인 정보가 없습니다.</p>
                ) : (
                    timeline.map((item, index) => (
                      <div key={`${item.year}-${index}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="w-full md:w-[calc(50%-2rem)]">
                          <div className={`relative rounded-2xl bg-white/70 backdrop-blur-md border border-[#0ABAB5]/20 p-6 shadow-md transition-all duration-300 md:group-odd:text-right md:group-even:text-left hover:shadow-lg hover:border-[#0ABAB5]/40`}>
                            <h3 className="text-2xl text-[#0ABAB5] mb-2 font-bold">{item.year}</h3>
                            <h4 className="text-lg mb-3 text-gray-800 font-semibold">{item.title}</h4>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                           <div className="w-5 h-5 bg-gradient-to-br from-[#0ABAB5] to-pink-400 rounded-full border-4 border-white shadow-md z-10"></div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </section>

          {/* Doctors Section */}
          <section className="mb-20 sm:mb-24"> 
            {isLoading ? (
                 <p className="text-center text-gray-500">의료진 정보를 불러오는 중...</p>
            ) : (
                 <DoctorsSection doctors={doctors}
                 title={t('doctors.title')}    
                 emptyText={t('doctors.empty', '의료진 정보가 없습니다.')} 
                 />
            )}
          </section>

          {/* Mission Section */}
          <section>
            <div className="rounded-3xl p-8 sm:p-12 lg:p-16 border border-gray-200/50 bg-white/50 backdrop-blur-sm shadow-lg"> {/* 스타일 조정 */}
              <div className="text-center">
                {/* t 함수 사용 */}
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8 sm:text-4xl">
                  {t('mission.title')}
                </h2>
                <p className="text-lg leading-relaxed text-gray-600 max-w-4xl mx-auto sm:text-xl">
                  {/* about.json의 'mission.description' 사용 */}
                  {t('mission.description')}
                </p>
                {/* Mission Points */}
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  {/* Point 1 */}
                  <div className="text-center bg-gray-50/50 p-6 rounded-2xl border border-gray-100 transition-shadow hover:shadow-md"> {/* 스타일 조정 */}
                    <div className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center bg-[#0ABAB5]/10"> {/* 간격 조정 */}
                      <svg className="w-8 h-8 text-[#0ABAB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    </div>
                    {/* t 함수 사용 */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('mission.points.0.title')}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{t('mission.points.0.description')}</p>
                  </div>
                  {/* Point 2 */}
                  <div className="text-center bg-gray-50/50 p-6 rounded-2xl border border-gray-100 transition-shadow hover:shadow-md">
                    <div className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center bg-pink-400/10">
                      <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    {/* t 함수 사용 */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('mission.points.1.title')}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{t('mission.points.1.description')}</p>
                  </div>
                  {/* Point 3 */}
                  <div className="text-center bg-gray-50/50 p-6 rounded-2xl border border-gray-100 transition-shadow hover:shadow-md">
                    <div className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center bg-purple-400/10">
                      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    {/* t 함수 사용 */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('mission.points.2.title')}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{t('mission.points.2.description')}</p>
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