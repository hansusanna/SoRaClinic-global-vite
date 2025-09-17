import { useState, useEffect } from 'react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import slidesKo from '@/db/slides/slides.ko.json'
import slidesEn from '@/db/slides/slides.en.json'
import slidesCn from '@/db/slides/slides.cn.json'

type Slide = {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  category: string
  color: string
}

const locale = 'ko' // 실제로는 i18n 상태값 등으로 제어

const slidesMap: Record<string, Slide[]> = {
  ko: slidesKo as Slide[],
  en: slidesEn as Slide[],
  cn: slidesCn as Slide[],
}

const slides = slidesMap[locale]

interface BeautyCarouselProps {
  onNavigateToTreatments: () => void
}

export default function BeautyCarousel({
  onNavigateToTreatments,
}: BeautyCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const getCardPosition = (index: number) => {
    const diff = index - currentSlide
    const totalSlides = slides.length

    let normalizedDiff = diff
    if (Math.abs(diff) > totalSlides / 2) {
      normalizedDiff = diff > 0 ? diff - totalSlides : diff + totalSlides
    }

    const isCenter = normalizedDiff === 0
    const isVisible = Math.abs(normalizedDiff) <= 2

    if (!isVisible) return { display: 'none' }

    // Responsive spacing: smaller on mobile, larger on desktop
    const isMobile =
      typeof window !== 'undefined' ? window.innerWidth < 768 : false
    const translateX = normalizedDiff * (isMobile ? 330 : 530)
    const scale = isCenter ? 1 : isMobile ? 0.8 : 0.75
    const opacity = isCenter ? 1 : isMobile ? 0.3 : 0.5
    const zIndex = isCenter ? 30 : 20 - Math.abs(normalizedDiff)

    return {
      transform: `translateX(${translateX}px) scale(${scale})`,
      opacity,
      zIndex,
      transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-120px)] pt-28 pb-20">
      {/* Elegant Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-12 z-40 group hidden md:block"
      >
        <div className="bg-white/90 backdrop-blur-sm w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-gray-700 md:hover:text-pink-500 md:hover:bg-white transition-all duration-300 shadow-lg md:group-hover:shadow-xl border border-pink-100/50">
          <svg
            className="w-5 h-5 md:w-6 md:h-6 md:group-hover:scale-110 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-12 z-40 group hidden md:block"
      >
        <div className="bg-white/90 backdrop-blur-sm w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-gray-700 md:hover:text-pink-500 md:hover:bg-white transition-all duration-300 shadow-lg md:group-hover:shadow-xl border border-pink-100/50">
          <svg
            className="w-5 h-5 md:w-6 md:h-6 md:group-hover:scale-110 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </button>

      {/* Beauty Treatment Carousel Cards */}
      <div className="relative w-full max-w-[90rem] mx-auto px-4 md:px-8">
        <div className="relative h-[500px] md:h-[750px] flex items-center justify-center">
          {slides.map((slide, index) => {
            const style = getCardPosition(index)
            const isCenter = (index - currentSlide) % slides.length === 0

            return (
              <div
                key={slide.id}
                className="absolute w-[300px] h-[420px] md:w-[500px] md:h-[650px] cursor-pointer group"
                style={style}
                onClick={() => goToSlide(index)}
              >
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl md:group-hover:shadow-2xl transition-all duration-500 bg-white border border-pink-100/50">
                  <ImageWithFallback
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Soft Beauty Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/10 to-transparent" />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${slide.color} opacity-40`}
                  />

                  {/* Treatment Category Tag */}
                  <div className="absolute top-4 left-4 md:top-8 md:left-8">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-full border border-pink-200/50 shadow-sm">
                      <span className="text-pink-500 font-medium text-xs md:text-sm tracking-wide">
                        {slide.category.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Beauty Treatment Content */}
                  <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 text-gray-800">
                    <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3 leading-tight text-gray-900">
                      {slide.title}
                    </h2>
                    <h3 className="text-base md:text-xl text-pink-500 mb-2 md:mb-4 font-medium tracking-wide">
                      {slide.subtitle}
                    </h3>
                    <p className="text-gray-700 text-sm md:text-lg leading-relaxed max-w-md hidden md:block">
                      {slide.description}
                    </p>

                    {/* Learn More Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onNavigateToTreatments()
                      }}
                      className="mt-3 md:mt-6 bg-white/90 backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 rounded-full text-pink-500 md:hover:bg-white md:hover:text-pink-600 transition-all duration-300 font-medium opacity-0 md:group-hover:opacity-100 transform translate-y-4 md:group-hover:translate-y-0 border border-pink-200/50 shadow-sm text-sm md:text-base"
                    >
                      Learn More
                    </button>
                  </div>

                  {/* Center Highlight Effect */}
                  {isCenter && (
                    <div className="absolute inset-0 border-2 border-pink-300/40 rounded-3xl"></div>
                  )}

                  {/* Elegant Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-400/10 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-all duration-500 flex items-center justify-center"></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Elegant Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
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
    </div>
  )
}
