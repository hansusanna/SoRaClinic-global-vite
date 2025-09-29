
import type { TreatmentPost } from '@/db/type/treatment'
import { Button } from '@/components/ui/button'

type Props = {
  item: TreatmentPost
  active: boolean
  onClick: (id: number) => void
}

export default function TreatmentCard({ item, onClick }: Props) {
  return (
    <div
      onClick={() => onClick(item.id)}
      className={"group relative overflow-hidden rounded-2xl bg-white border border-slate-200 cursor-pointer transition-all duration-300 hover:shadow-xl"}
      role="button"
      aria-label={`Open ${item.title}`}
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' ? onClick(item.id) : null)}
    >
      {/* Thumbnail */}
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = '/img/placeholder-16x10.jpg'
          }}
        />
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="mb-4 flex items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            {item.author}
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            {item.date}
          </div>
        </div>

        <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#0ABAB5]/10 to-pink-400/10 text-[#0ABAB5] rounded-full text-sm mb-4">
          {item.category}
        </span>

        <h3 className="mb-3 text-xl font-semibold leading-tight text-slate-800 group-hover:text-tiffany transition-colors">
          {item.title}
        </h3>

        <p className="text-gray-600 mb-6 leading-relaxed">{item.excerpt}</p>

         <Button variant="ghost" className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-tiffany to-pink-400">Read More
        {/* <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
        </svg> */}
        </Button>
      </div>
    </div>
  )
}
