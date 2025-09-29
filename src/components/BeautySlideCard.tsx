// src/components/carousel/BeautySlideCard.tsx
import { memo } from 'react'
import type { Slide } from '@/db/type/slide'

type Props = {
  slide: Slide
  style: React.CSSProperties
  isCenter: boolean
  onClick: () => void
  onLearnMore: () => void
}

const BeautySlideCard = memo(function BeautySlideCard({
  slide,
  style,
  isCenter,
  onClick,
  onLearnMore,
}: Props) {
  return (
    <div
      className="absolute w-[300px] h-[420px] md:w-[500px] md:h-[650px] cursor-pointer group"
      style={style}
      onClick={onClick}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl md:group-hover:shadow-2xl transition-all duration-500 bg-white border border-pink-100/50">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover"
          loading={isCenter ? 'eager' : 'lazy'}
          decoding="async"
        />

        {/* Soft Beauty Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/10 to-transparent" />
        <div className={`absolute inset-0 bg-gradient-to-br ${slide.color} opacity-40`} />

        {/* Treatment Category Tag */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-full border border-pink-200/50 shadow-sm">
            <span className="text-pink-500 font-medium text-xs md:text-sm tracking-wide">
              {slide.category.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Beauty Treatment Content */}
        <div className="absolute bottom-4 inset-x-4 md:bottom-8 md:left-8 md:right-8 text-gray-800">
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
              onLearnMore()
            }}
            className="mt-3 md:mt-6 bg-white/90 backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 rounded-full text-pink-500 md:hover:bg-white md:hover:text-pink-600 transition-all duration-300 font-medium opacity-0 md:group-hover:opacity-100 translate-y-4 md:group-hover:translate-y-0 border border-pink-200/50 shadow-sm text-sm md:text-base"
          >
            Learn More
          </button>
        </div>

        {/* Center Highlight Effect */}
        {isCenter && <div className="absolute inset-0 border-2 border-pink-300/40 rounded-3xl" />}

        {/* Elegant Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-pink-400/10 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-all duration-500 flex items-center justify-center"></div>
      </div>
    </div>
  )
})

export default BeautySlideCard
