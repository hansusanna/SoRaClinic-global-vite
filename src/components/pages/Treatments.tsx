
import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { TreatmentPost } from '@/db/type/treatment'
import TreatmentCard from '@/components/TreatmentCard'
import { Button } from '@/components/ui/button'
import BookingModal from '@/components/BookingModal'

export default function Treatments() {
  const { t } = useTranslation(['common', 'treatments'])

  // useMemo를 사용하여 t 함수 결과(items 배열) 캐싱
  const items = useMemo(() => {
    const data = t('items', { ns: 'treatments', returnObjects: true })
    return Array.isArray(data) ? data as TreatmentPost[] : []
  }, [t]) // t 함수(언어) 변경 시 재계산

  // 상태 변수 정의
  const [selectedItem, setSelectedItem] = useState<TreatmentPost | null>(null) // 상세 모달용 선택 아이템
  const [clickedCard, setClickedCard] = useState<number | null>(null) // 카드 클릭 효과용 ID (옵션)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); // 예약 모달 표시 상태
  const [treatmentToBook, setTreatmentToBook] = useState<TreatmentPost | null>(null); // 예약 모달 전달용 아이템

  // 모달 열렸을 때 스크롤 잠금 및 ESC 키 처리
  useEffect(() => {
    if (!selectedItem && !isBookingModalOpen) return // 모달이 둘 다 닫혀있으면 실행 안 함

    // ESC 키 누르면 모든 모달 닫기
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedItem(null)
        setIsBookingModalOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow // 기존 스크롤 상태 저장
    document.body.style.overflow = 'hidden' // 스크롤 잠금

    // 클린업: 컴포넌트 언마운트 또는 모달 닫힐 때
    return () => {
      document.removeEventListener('keydown', onKey) // 이벤트 리스너 제거
      document.body.style.overflow = prevOverflow // 스크롤 상태 복원
    }
  }, [selectedItem, isBookingModalOpen]) // 모달 상태 변경 시 effect 재실행

  // 카드 클릭 시 상세 모달 열기
  const handleCardClick = (id: number) => {
    setClickedCard(id) // 클릭 효과 시작
    const picked = items.find((i) => i.id === id) ?? null
    setTimeout(() => { // 클릭 효과 후 모달 열기
      setClickedCard(null)
      setSelectedItem(picked)
    }, 200)
  }

  // 상세 모달 내 "이 시술 예약" 버튼 클릭 시 예약 모달 열기
  const handleBookTreatment = () => {
    if (selectedItem) {
      setTreatmentToBook(selectedItem); // 예약할 시술 정보 저장
      setSelectedItem(null);           // 상세 모달 닫기
      setIsBookingModalOpen(true);     // 예약 모달 열기
    }
  }

  // 고객센터 이메일 주소
  const supportEmail = 'support@soraclinic.com'; // 실제 주소로 변경 필요

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <div className="mb-16 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
           {t('title', { ns: 'treatments' })}
        </h1>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl">
           {t('subtitle', { ns: 'treatments' })}
        </p>
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        {items.length === 0 ? (
          <p className="col-span-full text-center text-slate-500">시술 정보를 불러오는 중이거나 없습니다.</p>
         ) : (
           items.map((item) => (
             <TreatmentCard
               key={item.id}
               item={item}
               active={clickedCard === item.id}
               onClick={handleCardClick}
             />
           ))
         )}
      </div>

      {/* 상세 모달 */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)} // 배경 클릭 시 닫기
          role="dialog" aria-modal="true" aria-labelledby="treatment-modal-title"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫힘 방지
            tabIndex={-1}
          >
            <div className="p-6 sm:p-8">
              <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                {/* 이미지 */}
                <div className="space-y-4">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
                    <img
                      src={selectedItem.image} alt={selectedItem.title}
                      loading="lazy" decoding="async" className="h-full w-full object-cover"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder-4x3.jpg'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                </div>
                {/* 텍스트 */}
                <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
                  <div>
                    <div className="mb-3">
                       <span className="inline-block bg-gradient-to-r from-[#0ABAB5]/15 to-pink-100/80 text-[#07807e] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                         {selectedItem.category}
                       </span>
                    </div>
                    <h2 id="treatment-modal-title" className="mb-4 text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">
                      {selectedItem.title}
                    </h2>
                    <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                      <div className="flex items-center gap-1"> <svg className="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> {selectedItem.author} </div>
                      <div className="flex items-center gap-1"> <svg className="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg> {selectedItem.date} </div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
                    {selectedItem.excerpt}
                  </p>
                  {/* 버튼 그룹 */}
                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                     <Button
                       className="flex-1 rounded-full bg-gradient-to-r from-[#0ABAB5] to-pink-400 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:from-[#0ABAB5]/90 hover:to-pink-400/90 hover:shadow-lg transform hover:scale-[1.03]"
                       onClick={handleBookTreatment}>
                       {t('buttons.bookThis', { ns: 'common' })}
                     </Button>
                     <a
                       href={`mailto:${supportEmail}?subject=${encodeURIComponent(t('email.subjectPrefix', { ns: 'common', title: selectedItem.title }))}`}
                       className="inline-flex flex-1 items-center justify-center rounded-full border border-pink-300 bg-white px-4 py-2.5 text-sm font-semibold text-pink-700 shadow-sm transition-all duration-300 hover:bg-pink-50 hover:shadow-md transform hover:scale-[1.03]"
                     >
                       {t('buttons.askQuestions', { ns: 'common' })}
                     </a>
                  </div>
                </div>
              </div>
              {/* 닫기 버튼 */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute right-4 top-4 rounded-full bg-white/80 p-1.5 text-slate-500 shadow-md transition-all duration-300 hover:scale-110 hover:bg-white hover:text-slate-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                aria-label={t('buttons.close', { ns: 'common' })}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 예약 모달 */}
      {isBookingModalOpen && (
          <BookingModal
            open={isBookingModalOpen}
            onOpenChange={setIsBookingModalOpen}
            preselectedTreatment={treatmentToBook} // 예약할 시술 정보 전달
          />
        )}
    </div>
  )
}