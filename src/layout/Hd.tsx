import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { loadNavByLang, type NavItem } from '@/i18n/navLoader'

export default function Hd({ onOpenBooking }: { onOpenBooking?: () => void }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<NavItem[]>([])
  const navigate = useNavigate()
  const location = useLocation()
  const { i18n } = useTranslation()

  // 언어 변경 시 네비게이션 로드
  useEffect(() => {
    let alive = true
    loadNavByLang(i18n.language).then((data) => {
      if (!alive) return
      setItems(data.filter((i) => i.display))
    })
    return () => {
      alive = false
    }
  }, [i18n.language])

  // 홈(/) + #id 일치하면 활성
  const isHashActive = (id: string) =>
    location.pathname === '/' && location.hash === `#${id}`

  // CONTACT 같은 섹션 스크롤 이동
  const go = (id: string) => {
    setOpen(false)
    if (location.pathname === '/') {
      if (location.hash !== `#${id}`) {
        window.location.hash = `#${id}`
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(`/#${id}`)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-100/50" role="banner">
      <div className="mx-auto max-w-7xl px-4 md:px-6 h-16 flex items-center justify-between">
        {/* 로고 -> 홈 */}
        <Link to="/" aria-label="Go to home" className="text-2xl font-bold text-gray-800 hover:scale-105 transition-all duration-300">
          <span className="text-[#0ABAB5]">SoRa</span><span className="text-pink-400">Clinic</span>
        </Link>

        {/* 데스크탑 네비 */}
        <nav className="hidden md:flex items-center gap-6">
          {items.map((item) =>
            item.scrollToId ? (
              <button
                key={item.pk}
                onClick={() => go(item.scrollToId!)}
                className={`px-3 py-2 text-sm rounded-none transition ${
                  isHashActive(item.scrollToId!)
                    ? 'text-[#0ABAB5] border-b-2 border-[#0ABAB5]'
                    : 'text-gray-600 hover:text-pink-500'
                }`}
              >
                {item.label}
              </button>
            ) : (
              <NavLink
                key={item.pk}
                to={item.path}
                end
                className={({ isActive }) =>
                  `px-3 py-2 text-sm rounded-none transition ${
                    isActive
                      ? 'text-[#0ABAB5] border-b-2 border-[#0ABAB5]'
                      : 'text-gray-600 hover:text-pink-500'
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          {/* 데스크탑 BOOK 버튼 */}
          <Button onClick={onOpenBooking} variant="gradient" size="lg" className="rounded-full hidden md:inline-flex">
            BOOK
          </Button>

          {/* 모바일 메뉴 */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 text-gray-600" aria-label="Open menu">
                <span className="sr-only">Open menu</span>
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

              {/* 모바일 메뉴 리스트 */}
              <nav className="mt-6 flex flex-col space-y-2">
                {items.map((item) =>
                  item.scrollToId ? (
                    <button
                      key={item.pk}
                      onClick={() => go(item.scrollToId!)}
                      className="text-left py-3 px-4 rounded-xl transition-all duration-300 font-medium hover:scale-105 text-gray-600 hover:text-pink-500 hover:bg-white"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <NavLink
                      key={item.pk}
                      to={item.path}
                      end
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `text-left py-3 px-4 rounded-xl transition-all duration-300 font-medium hover:scale-105 ${
                          isActive
                            ? 'bg-white text-[#0ABAB5] border-l-4 border-[#0ABAB5]'
                            : 'text-gray-600 hover:text-pink-500 hover:bg-white'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  )
                )}
              </nav>

              {/* 모바일 BOOK 버튼 */}
              <div className="pt-6 border-t border-pink-100">
                <Button
                  onClick={() => {
                    setOpen(false)
                    onOpenBooking?.()
                  }}
                  variant="gradient"
                  size="lg"
                  className="w-full rounded-full"
                >
                  BOOK
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
