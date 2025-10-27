import { useMemo, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import type { EventItem } from "@/db/type/event"
import type { TreatmentPost } from "@/db/type/treatment"; // BookingModal에 전달하기 위해 추가
import EventCard from "@/components/EventCard"
import { Button } from "@/components/ui/button"
import BookingModal from '@/components/BookingModal'

export default function Event() {
  const { t } = useTranslation(["common", "event"])

  // event.json에서 데이터 로드
  const items = useMemo(() => {
    const data = t('items', { ns: 'event', returnObjects: true });
    return Array.isArray(data) ? data as EventItem[] : [];
  }, [t]);

  const [selectedItem, setSelectedItem] = useState<EventItem | null>(null)
  const [clickedCard, setClickedCard] = useState<number | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); // 예약 모달 상태
  const [eventToBook, setEventToBook] = useState<EventItem | null>(null); // 예약 모달 전달용

  // 상세/예약 모달 열렸을 때 스크롤 잠금 및 ESC 처리
  useEffect(() => {
    if (!selectedItem && !isBookingModalOpen) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedItem(null)
        setIsBookingModalOpen(false) // ESC로 예약 모달도 닫기
      }
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [selectedItem, isBookingModalOpen]) // isBookingModalOpen 의존성 추가

  const parseValidUntil = (txt?: string): Date | null => {
    if (!txt) return null
    if (/available\s*daily/i.test(txt) || /매일\s*이용\s*가능/.test(txt) || /每日\s*可用/.test(txt)) {
      return new Date(8640000000000000)
    }
    const en = txt.match(/until\s+(.+)$/i)
    if (en) { const d = new Date(en[1]); if (!isNaN(d.getTime())) return d }
    const ko = txt.match(/(\d{4})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일/)
    if (ko) { const [, y, m, day] = ko; return new Date(+y, +m - 1, +day) }
    const cn = txt.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/)
    if (cn) { const [, y, m, day] = cn; return new Date(+y, +m - 1, +day) }
    return null
  }

  const { activeItems, expiredItems } = useMemo(() => {
    const today = new Date()
    const active: EventItem[] = []
    const expired: EventItem[] = []
    for (const it of items) {
      const d = parseValidUntil(it.validUntil)
      if (!d) active.push(it)
      else (d >= today ? active : expired).push(it)
    }
    return { activeItems: active, expiredItems: expired }
  }, [items])

  const handleCardClick = (id: number) => {
    setClickedCard(id)
    const picked = items.find(i => i.id === id) ?? null
    setTimeout(() => {
      setClickedCard(null)
      setSelectedItem(picked)
    }, 200)
  }
  // 상세 모달 내 "예약하기" 버튼 클릭 핸들러
  const handleBookEvent = () => {
     if (selectedItem) {
        setEventToBook(selectedItem); // 예약할 이벤트 정보 저장
        setSelectedItem(null);       // 상세 모달 닫기 (선택 사항)
        setIsBookingModalOpen(true); // 예약 모달 열기
     }
  }

  // 고객센터 이메일
  const supportEmail = 'support@soraclinic.com'; // 실제 주소로 변경 필요

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12 p-5">
        {/*  모든 텍스트를 'event' 네임스페이스에서 가져오도록 통일합니다. */}
        <h1 className="text-5xl mb-6 text-gray-800">{t("title", { ns: "event" })}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {t("subtitle", { ns: "event" })}
        </p>
        <div className="mt-6 inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-medium">
          {t("limited", { ns: "event" })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeItems.map(item => (
          <EventCard
            key={item.id}
            item={item}
            active={clickedCard === item.id}
            onClick={handleCardClick}
          />
        ))}
      </div>

      {expiredItems.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t("expired", { ns: "event" })}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-60">
            {expiredItems.map(item => (
              <EventCard
                key={item.id}
                item={item}
                active={clickedCard === item.id}
                onClick={handleCardClick}
              />
            ))}
          </div>
        </section>
      )}

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedItem(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-modal-title">
          <div
            className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-100/50"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl shadow-lg relative">
                    <img src={selectedItem.image} alt={selectedItem.title} loading="lazy" decoding="async" className="w-full h-full object-cover"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement
                        img.onerror = null
                        img.src = "/img/placeholder.jpg"
                      }} />

                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                      {selectedItem.discount}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-4">
                  <div>
                    <div className="mb-3">
                      <span className="inline-block bg-gradient-to-r from-[#0ABAB5]/10 to-pink-100 text-[#0ABAB5] px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                        {selectedItem.category}
                      </span>
                    </div>

                    <h2 id="event-modal-title" className="text-2xl md:text-3xl text-gray-800 mb-3 font-light leading-tight">
                      {selectedItem.title}
                    </h2>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl md:text-3xl font-bold text-[#0ABAB5]">
                        {selectedItem.eventPrice}
                      </span>
                      <span className="text-lg md:text-xl text-gray-400 line-through">
                        {selectedItem.originalPrice}
                      </span>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-pink-50 border border-pink-200 rounded-lg p-2 mb-4">
                      <div className="text-xs md:text-sm text-pink-800 font-medium">
                        {selectedItem.validUntil}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    {selectedItem.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-sm font-semibold text-gray-800">{t("included", { ns: "event" })}</h4>
                    <div className="grid grid-cols-1 gap-1.5">
                      {selectedItem.includes.map((include, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-[#0ABAB5] to-pink-400 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{include}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/*  버튼 그룹*/}
                  <div className="flex flex-col gap-3 pt-4 sm:flex-row"> {/* 간격 조정 */}
                    {/* 예약 버튼 */}
                    <Button
                      className="flex-1 rounded-full bg-gradient-to-r from-[#0ABAB5] to-pink-400 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:from-[#0ABAB5]/90 hover:to-pink-400/90 hover:shadow-lg transform hover:scale-[1.03]"
                      onClick={handleBookEvent}
                    >
                      {t('buttons.bookNow', { ns: 'common' })}
                    </Button>
                    {/* 질문 버튼 */}
                    <a
                      href={`mailto:${supportEmail}?subject=${encodeURIComponent(
                       
                        t('email.subjectPrefixEvent', { ns: 'common', title: selectedItem.title })
                      )}`}
                      className="inline-flex flex-1 items-center justify-center rounded-full border border-pink-300 bg-white px-4 py-1.5 text-sm font-semibold text-pink-700 shadow-sm transition-all duration-300 hover:bg-pink-50 hover:shadow-md transform hover:scale-[1.03]"
                    >
                      {t('buttons.askQuestions', { ns: 'common' })}
                    </a>
                  </div>
                </div>
              </div>

              <button onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110" aria-label="Close modal">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    {/* 예약 모달 렌더링 */}
      {isBookingModalOpen && (
          <BookingModal
            open={isBookingModalOpen}
            onOpenChange={setIsBookingModalOpen}
             // ★ EventItem을 TreatmentPost 타입으로 전달
             // BookingModal이 title만 사용한다면 문제 없을 수 있음
            preselectedTreatment={eventToBook as unknown as TreatmentPost}
          />
        )}  
    </div>
  )
}

