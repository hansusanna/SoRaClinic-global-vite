import { Outlet } from 'react-router-dom'
import React, { useState } from 'react'
import Hd from './layout/Hd'
import Ft from './layout/Ft'
import Quick from './layout/Quick'
import BookingModal from './components/BookingModal'
import { Toaster } from 'sonner'

// interface LayoutProps {
//   children?: ReactNode;
// }

const Layout: React.FC = () => {
  const [bookingOpen, setBookingOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-50 to-white">
      {/* 공통 레이아웃, 헤더 등 */}
      <Hd onOpenBooking={() => setBookingOpen(true)} />
      <div>
        {/* children 대신 Outlet */}
        <Outlet />
        <Quick />
      </div>
      <Ft />
      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} />
      <Toaster position="top-center" richColors />
    </div>
  )
}

export default Layout
