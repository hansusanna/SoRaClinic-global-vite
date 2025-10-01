import { useState, useEffect } from 'react'
import type { TreatmentPost } from '@/db/type/treatment'
import TreatmentCard from '@/components/TreatmentCard'
import raw from '@/db/treatments.json'
import { Button } from '@/components/ui/button' // 원치 않으면 제거하고 <button>으로 대체 가능

export default function Treatments() {
  const [selectedItem, setSelectedItem] = useState<TreatmentPost | null>(null)
  const [clickedCard, setClickedCard] = useState<number | null>(null)

  const items = raw as TreatmentPost[];

  // 모달 열렸을 때: ESC 닫기 + 스크롤 잠금
  useEffect(() => {
    if (!selectedItem) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedItem(null)
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [selectedItem])

  const handleCardClick = (id: number) => {
    setClickedCard(id)
    const picked = items.find((i) => i.id === id) ?? null
    setTimeout(() => {
      setClickedCard(null)
      setSelectedItem(picked)
    }, 200)
  }

  return (
    <div className="mx-auto max-w-7xl py-8">
      {/* 헤더 */}
      <div className="mb-12 text-center">
        <h1 className="mb-6 text-5xl text-slate-800">Treatments</h1>
        <p className="mx-auto max-w-3xl text-xl leading-relaxed text-slate-600">
          Expert K-beauty treatments, skincare solutions, and professional services from our SoRa Clinic specialists
        </p>
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <TreatmentCard
            key={item.id}
            item={item}
            active={clickedCard === item.id}
            onClick={handleCardClick}
          />
        ))}
      </div>

      {/* 상세 선택 영역 */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="treatment-modal-title"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* 이미지 */}
                <div className="space-y-4">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = '/img/placeholder-4x3.jpg'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                  </div>
                </div>

                {/* 텍스트 */}
                <div className="flex flex-col justify-center space-y-4">
                  <div>
                    <div className="mb-2">
                      <span className="inline-block bg-gradient-to-r from-[#0ABAB5]/10 to-pink-100 text-[#0ABAB5] px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                        {selectedItem.category}
                      </span>
                    </div>

                    <h2 id="treatment-modal-title" className="mb-3 text-2xl font-light leading-tight text-slate-800 md:text-3xl">
                      {selectedItem.title}
                    </h2>

                    <div className="mb-4 flex items-center gap-3 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        {selectedItem.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                        </svg>
                        {selectedItem.date}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-700 md:text-base">
                    {selectedItem.excerpt}
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button className="flex-1 rounded-full bg-tiffany px-6 py-2 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-teal-500">
                      Read Article
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full border-slate-300 px-4 py-2 text-slate-700 transition-all duration-300 hover:bg-slate-50"
                      onClick={() => setSelectedItem(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>

              {/* 닫기 버튼 */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute right-4 top-4 rounded-full bg-white/90 p-1.5 text-slate-400 shadow-lg transition-all duration-300 hover:scale-110 hover:text-slate-600 hover:shadow-xl"
                aria-label="Close modal"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
