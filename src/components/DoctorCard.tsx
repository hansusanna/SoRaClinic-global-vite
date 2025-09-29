import { memo } from 'react'
import type { Doctor } from "@/db/type/about";

type Props = {
  doctor: Doctor
  fallbackSrc?: string
}

const DoctorCard = memo(function DoctorCard({
  doctor,
  fallbackSrc = '/img/placeholder-avatar.png',
}: Props) {
  return (
    <div className="text-center group">
      <div className="relative mx-auto mb-6 h-48 w-48 overflow-hidden rounded-full border-4 border-slate-300 transition-all duration-300 group-hover:border-tiffany">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallbackSrc
          }}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-t from-tiffany/20 to-pink-400/10" />
      </div>
      <h3 className="mb-1 text-xl font-semibold text-gray-800">{doctor.name}</h3>
      <p className="font-medium text-tiffany">{doctor.role}</p>
    </div>
  )
})

export default DoctorCard