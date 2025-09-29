import type { Doctor } from '@/db/type/about'
import DoctorCard from './DoctorCard'

type Props = {
  doctors: Doctor[]
  title?: string
  className?: string
}

export default function DoctorsSection({
  doctors,
  title = 'Meet Our Beauty Experts',
  className = '',
}: Props) {
  return (
    <section className={`mx-[30px] mb-[70px] ${className}`}>
      <h2 className="mb-12 text-center text-4xl text-gray-800">{title}</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {doctors.map((d, i) => (
          <DoctorCard key={`${d.name}-${i}`} doctor={d} />
        ))}
      </div>
    </section>
  )
}