import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Hd from './layout/Hd'
import Ft from './layout/Ft'
import Quick from './layout/Quick'
import BookingModal from './components/BookingModal'
import { Toaster } from 'sonner'

export default function Layout() {
  const { pathname, hash } = useLocation()
  const [bookingOpen, setBookingOpen] = useState(false)

  // 라우트/해시 변경 시 스크롤 관리
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash) as HTMLElement | null
      if (el) {
        // 고정 헤더 높이만큼 보정 (선택)
        const header = document.querySelector('header')
        const headerH = header?.getBoundingClientRect().height ?? 0
        const y = el.getBoundingClientRect().top + window.pageYOffset - headerH - 8
        window.scrollTo({ top: y, behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname, hash])

  return (
    <div className="min-h-screen supports-[height:100dvh]:min-h-dvh relative overflow-hidden bg-kbeauty">
      <Hd onOpenBooking={() => setBookingOpen(true)} />
      <main className="container mx-auto px-6 pt-16 md:pt-20 pb-16 md:pb-20">
        <Outlet />
        <Quick />
      </main>
      <Ft />
      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} />
      <Toaster position="top-center" richColors />
    </div>
  )
}
