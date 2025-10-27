import { memo, useState } from 'react'
import type { Doctor } from "@/db/type/about";

type Props = {
  doctor: Doctor
  fallbackSrc?: string
}

const DoctorCard = memo(function DoctorCard({
  doctor,
  fallbackSrc = '/img/placeholder-avatar.png',
}: Props) {
   const [imgErrored, setImgErrored] = useState(false)
  return (
    <div className="text-center group">
      <div className="relative mx-auto mb-6 h-48 w-48 overflow-hidden rounded-full border-4 border-slate-300 transition-all duration-300 group-hover:border-tiffany" aria-hidden={false}>
        <div
          className="absolute inset-0 animate-pulse bg-slate-100"
          style={{ opacity: imgErrored ? 0 : 1 }}
        />
         <img
          src={imgErrored ? fallbackSrc : doctor.image}
          alt={`${doctor.name} — ${doctor.role}`}
          width={192}
          height={192}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 transform-gpu will-change-transform"
          onError={() => {
            // 폴백도 실패하면 다시 세팅하지 않도록 1회만
            if (!imgErrored) setImgErrored(true)
          }}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-t from-tiffany/20 to-pink-400/10 will-change-opacity" />
      </div>
      <h3 className="mb-1 text-xl font-semibold text-gray-800">{doctor.name}</h3>
      <p className="font-medium text-tiffany">{doctor.role}</p>
    </div>
  )
})

export default DoctorCard