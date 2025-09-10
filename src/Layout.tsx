import React, { ReactNode, useState } from 'react';
import Hd from './layout/Hd';
import Ft from './layout/Ft';
import Quick from './layout/Quick';
import BookingModal from './components/BookingModal';
import { Toaster } from 'sonner';

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    
    <div>
      {/* 공통 레이아웃, 헤더 등 */}
      <Hd onOpenBooking={() => setBookingOpen(true)} />
      <div>
         {children}
         <Quick />
         
      </div>
      <Ft />
      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} />
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default Layout;
