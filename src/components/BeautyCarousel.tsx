import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Slide } from '@/db/type/slide'
import BeautySlideCard from '@/components/BeautySlideCard'

interface BeautyCarouselProps {
  onNavigateToTreatments: () => void
}

export default function BeautyCarousel({ onNavigateToTreatments }: BeautyCarouselProps) {
  // i18n에서 슬라이드 데이터 바로 꺼내쓰기 (+ useMemo로 안정화)
  const { t } = useTranslation('slides')
  const slides = useMemo(
    () => (t('slides', { returnObjects: true }) as Slide[]) ?? [],
    [t]
  )

  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (currentSlide >= slides.length) setCurrentSlide(0)
  }, [slides.length, currentSlide])

  const nextSlide = () => setCurrentSlide(p => (p + 1) % (slides.length || 1))
  const prevSlide = () => setCurrentSlide(p => (p - 1 + (slides.length || 1)) % (slides.length || 1))
  const goToSlide = (i: number) => setCurrentSlide(i)

   useEffect(() => {
    if (!slides.length) return
    const timer = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  const getCardPosition = (index: number) => {
    if (!slides.length) {
      return { opacity: 0, visibility: 'hidden', pointerEvents: 'none' } as const
    }

    const diff = index - currentSlide
    const total = slides.length
    let normalized = diff
    if (Math.abs(diff) > total / 2) normalized = diff > 0 ? diff - total : diff + total

    const isCenter = normalized === 0
    const isVisible = Math.abs(normalized) <= 2

    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
    const baseX = normalized * (isMobile ? 330 : 530)

    if (!isVisible) {
      return {
        transform: `translateX(${baseX}px) scale(${isMobile ? 0.7 : 0.7})`,
        opacity: 0,
        visibility: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
        transition: 'opacity .4s ease, transform .8s cubic-bezier(0.25,0.46,0.45,0.94)',
      } as const
    }

    const scale = isCenter ? 1 : isMobile ? 0.8 : 0.75
    const opacity = isCenter ? 1 : isMobile ? 0.3 : 0.5
    const zIndex = isCenter ? 30 : 20 - Math.abs(normalized)
    
     return {
      transform: `translateX(${baseX}px) scale(${scale})`,
      opacity,
      zIndex,
      transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    } as const
  }


  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-120px)] pb-10">
      {/* Prev */}
      <button onClick={prevSlide} disabled={!slides.length} className="absolute left-4 md:left-12 z-40 group hidden md:block" aria-label="Previous slide">
        <div className="bg-white/90 backdrop-blur-sm w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-gray-700 md:hover:text-pink-500 md:hover:bg-white transition-all duration-300 shadow-lg md:group-hover:shadow-xl border border-pink-100/50">
          <svg className="w-5 h-5 md:w-6 md:h-6 md:group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </button>

      {/* Next */}
      <button
        onClick={nextSlide} disabled={!slides.length}
        className="absolute right-4 md:right-12 z-40 group hidden md:block" aria-label="Next slide">
        <div className="bg-white/90 backdrop-blur-sm w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-gray-700 md:hover:text-pink-500 md:hover:bg-white transition-all duration-300 shadow-lg md:group-hover:shadow-xl border border-pink-100/50">
          <svg className="w-5 h-5 md:w-6 md:h-6 md:group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>

      {/* Carousel */}
      <div className="relative w-full max-w-[90rem] mx-auto px-4 md:px-8">
        <div className="relative h-[500px] md:h-[750px] flex items-center justify-center">
          {slides.map((slide, index) => {
            const style = getCardPosition(index)
            const isCenter = index === currentSlide
            return (
              <BeautySlideCard
                key={slide.id}
                slide={slide}
                style={style}
                isCenter={isCenter}
                onClick={() => goToSlide(index)}
                onLearnMore={onNavigateToTreatments}
              />
            )
          })}
        </div>
      </div>

      {/* Dots */}
      {slides.length > 1 && (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-pink-200/30">
          <div className="flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-8 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full'
                    : 'w-3 h-3 bg-gray-300 md:hover:bg-pink-300 rounded-full'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
