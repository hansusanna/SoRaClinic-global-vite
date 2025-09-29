import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import navi from '@/db/navi.json'
import type { NaviItem } from '@/db/type/common'

export default function Hd({ onOpenBooking }: { onOpenBooking?: () => void }) {
  const [open, setOpen] = useState(false)
  const items = useMemo(() => (navi as NaviItem[]).filter(i => i.display), [])
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavClick = (item: NaviItem) => {
    setOpen(false)
    if (!item.scrollToId) return // 일반 링크는 NavLink 기본 이동으로 처리

    const id = item.scrollToId
    if (location.pathname === '/') {
      // 이미 홈이면 바로 스크롤
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 0)
    } else {
      // 홈으로 이동하면서 state에 id 전달
      navigate('/', { state: { scrollToId: id } })
    }
  }

  const DesktopLink = (item: NaviItem) =>
    item.scrollToId ? (
      <button
        key={item.pk}
        onClick={() => handleNavClick(item)}
        className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-110 text-gray-600 hover:text-pink-500"
      >
        {item.label}
      </button>
    ) : (
      <NavLink
        key={item.pk}
        to={item.path}
        className={({ isActive }) =>
          `px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-110 ${
            isActive
              ? 'text-gray-700 hover:text-pink-500 border-b-2 border-pink-400 pb-1'
              : 'text-gray-600 hover:text-pink-500'
          }`
        }
      >
        {item.label}
      </NavLink>
    )

  const MobileLink = (item: NaviItem) =>
    item.scrollToId ? (
      <button
        key={item.pk}
        onClick={() => handleNavClick(item)}
        className="text-left py-3 px-4 rounded-xl transition-all duration-300 font-medium hover:scale-105 text-gray-600 hover:text-pink-500 hover:bg-white"
      >
        {item.label}
      </button>
    ) : (
      <NavLink
        key={item.pk}
        to={item.path}
        className={({ isActive }) =>
          `text-left py-3 px-4 rounded-xl transition-all duration-300 font-medium hover:scale-105 ${
            isActive
              ? 'bg-white text-pink-600 border-l-4 border-pink-400'
              : 'text-gray-600 hover:text-pink-500 hover:bg-white'
          }`
        }
        onClick={() => setOpen(false)}
      >
        {item.label}
      </NavLink>
    )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-100/50">
      <div className="mx-auto max-w-7xl px-4 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:scale-105 transition-all duration-300">
          <span className="text-[#0ABAB5]">SoRa</span>
          <span className="text-pink-400">Clinic</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {items.map(DesktopLink)}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            onClick={onOpenBooking}
            className="hidden md:inline-flex bg-gradient-to-r from-pink-400 via-[#0ABAB5] to-purple-400 hover:from-pink-500 hover:via-[#0ABAB5]/90 hover:to-purple-500 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            BOOK
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 text-gray-600">
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <div className="h-0.5 bg-current w-full" />
                  <div className="h-0.5 bg-current w-full" />
                  <div className="h-0.5 bg-current w-full" />
                </div>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white/80 backdrop-blur-md border-l border-pink-100/50 shadow-xl">
              <SheetHeader className="text-left pb-4 border-b border-pink-100">
                <SheetTitle className="text-2xl font-bold text-gray-800">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col space-y-2">
                {items.map(MobileLink)}
                <div className="pt-6 border-t border-pink-100">
                  <Button
                    onClick={() => {
                      setOpen(false)
                      onOpenBooking?.()
                    }}
                    className="w-full bg-gradient-to-r from-pink-400 via-[#0ABAB5] to-purple-400 hover:from-pink-500 hover:via-[#0ABAB5]/90 hover:to-purple-500 text-white py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    BOOK
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
