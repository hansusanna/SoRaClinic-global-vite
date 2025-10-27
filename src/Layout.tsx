
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { useEffect, useState, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import Hd from './layout/Hd'
import Ft from './layout/Ft'
import BookingModal from './components/BookingModal'
import BookingModalContext from '@/components/context/BookingModalContext'
import { Toaster } from 'sonner'

type LangCode = 'ko' | 'en' | 'cn'
const isLang = (v: unknown): v is LangCode => v === 'ko' || v === 'en' || v === 'cn'

export default function Layout() {
  const { pathname, hash } = useLocation()
  const { i18n } = useTranslation()
  const { lang: rawLang } = useParams<{ lang?: string }>()
  const lang: LangCode = isLang(rawLang) ? rawLang : 'ko'

  const [bookingOpen, setBookingOpen] = useState(false)

  // <html lang> 반영
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // URL(lang) → i18n 동기화 (resolvedLanguage 고려)
  useEffect(() => {
    console.log("Layout", lang); 
    if (i18n.resolvedLanguage !== lang) {
      void i18n.changeLanguage(lang)
    }
  }, [lang, i18n])

  // 해시 스크롤 관리
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash) as HTMLElement | null
      if (el) {
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
    <BookingModalContext.Provider value={setBookingOpen}>
    <div className="min-h-screen supports-[height:100dvh]:min-h-dvh relative overflow-hidden bg-kbeauty">
      <Hd lang={lang} />
      <main id="main" className="container mx-auto px-6 pt-16 md:pt-20 pb-16 md:pb-20">
        <Suspense fallback={<div className="p-10 text-center text-xl font-semibold">Loading Page...</div>}>
          <Outlet />
        </Suspense>
      </main>
      <Ft />
      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} />
      <Toaster position="top-center" richColors />
    </div>
    </BookingModalContext.Provider>
  )
}
