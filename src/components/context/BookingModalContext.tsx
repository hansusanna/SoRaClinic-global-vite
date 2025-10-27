import { createContext, useContext } from 'react'

// 1. Layout.tsx에 있던 Context 관련 코드를 모두 여기로 가져옵니다.
type BookingModalContextType = React.Dispatch<React.SetStateAction<boolean>> | null;
const BookingModalContext = createContext<BookingModalContextType>(null);

// 2. 훅 export
export function useBookingModalTrigger() {
  const setBookingOpen = useContext(BookingModalContext);
  if (!setBookingOpen) {
    throw new Error('useBookingModalTrigger must be used within a BookingProvider');
  }
  return () => setBookingOpen(true);
}

export default BookingModalContext;