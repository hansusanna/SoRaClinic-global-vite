import type { Doctor } from '@/db/type/about'
import DoctorCard from './DoctorCard'
import { ReactNode, useId } from 'react'

type Props = {
  doctors: Doctor[]
  title: ReactNode       
  className?: string
  emptyText?: string         // 빈 상태 문구 커스터마이즈
}

export default function DoctorsSection({
  doctors,
  title,
  className = '',
  emptyText = '의료진 정보가 없습니다.',
}: Props) {
  const headingId = useId()

  if (!doctors || doctors.length === 0) {
    return (
      <section
        className={`mx-[30px] mb-[70px] ${className}`}
        aria-labelledby={headingId}
      >
        <h2 id={headingId} className="mb-6 text-center text-3xl text-gray-800">
          {title}
        </h2>
        <p className="text-center text-gray-500">{emptyText}</p>
      </section>
    )
  }

  return (
    <section
      className={`mx-[30px] mb-[70px] ${className}`}
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="mb-12 text-center text-4xl text-gray-800">
        {title}
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {doctors.map((d) => (
          <DoctorCard key={d.name} doctor={d} />
        ))}
      </div>
    </section>
  )
}
