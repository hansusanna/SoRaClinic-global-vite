// src/layout/Hd.tsx
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { NavItem } from '@/db/type/navi'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import LanguageSelector from '@/components/LanguageSelector'
import { useBookingModalTrigger } from '@/components/context/BookingModalContext'

type LangCode = 'ko' | 'en' | 'cn'

interface HdProps {
  lang: LangCode
}

export default function Hd({ lang }: HdProps) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('navi')
  const openBookingModal = useBookingModalTrigger();

  // 네비 아이템: 표시 비활성은 제외, label 누락 대비
  const items = useMemo(() => {
    const raw = (t('items', { returnObjects: true }) as NavItem[]) || []
    return raw.filter((it) => it?.display !== false)
  }, [t])

  const bookText = t('book')
  const menuText = t('menu')

  // 언어 프리픽스/경로 유틸
  const prefix = `/${lang}`
  const homePath = `${prefix}/`

  // 중복 슬래시를 방지하고 / → 홈으로 매핑
  const withPrefix = useCallback(
    (p: string) => {
      if (!p || p === '/') return homePath
      // ensure single slash join
      return `${prefix}${p.startsWith('/') ? p : `/${p}`}`.replace(/\/{2,}/g, '/')
    },
    [prefix, homePath]
  )

  // 홈 여부 + 해시 활성
  const isHome = useMemo(() => {
    // homePath.slice(0,-1) = '/ko'
    return (
      location.pathname === prefix ||
      location.pathname === '/' ||
      location.pathname === homePath.slice(0, -1)
    )
  }, [location.pathname, prefix, homePath])

  const isHashActive = useCallback(
    (id: string) => isHome && location.hash === `#${id}`,
    [isHome, location.hash]
  )

  // 스크롤/이동
  const go = useCallback(
    (id: string) => {
      setOpen(false)
      if (isHome) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate(`${homePath}#${id}`)
      }
    },
    [isHome, navigate, homePath]
  )
  
  // 라우트 변경 시 모바일 시트 자동 닫힘
  useEffect(() => {
    if (open) setOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.hash])

  // 공통 링크 클래스
  const linkCls = useCallback(
    (active: boolean) =>
      `px-3 py-2 text-sm rounded-none transition ${
        active
          ? 'text-[#0ABAB5] border-b-2 border-[#0ABAB5]'
          : 'text-gray-600 hover:text-pink-500'
      }`,
    []
  )

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-100/50"
      role="banner"
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:px-3 focus:py-2 focus:rounded-md">
        Skip to content
      </a>

      <div className="mx-auto max-w-7xl px-4 md:px-6 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link
          to={homePath}
          aria-label="Go to home"
          className="text-2xl font-bold text-gray-800 hover:scale-105 transition-all duration-300"
        >
          <span className="text-[#0ABAB5]">SoRa</span>
          <span className="text-pink-400">Clinic</span>
        </Link>

        {/* 데스크탑 네비 */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
          {items.map((item) =>
            item.scrollToId ? (
              <button
                key={item.pk}
                onClick={() => go(item.scrollToId!)}
                className={linkCls(isHashActive(item.scrollToId!))}
                // 접근성: 현재 섹션이면 aria-current 지정
                aria-current={isHashActive(item.scrollToId!) ? 'page' : undefined}
              >
                {item.label}
              </button>
            ) : (
              <NavLink
                key={item.pk}
                to={withPrefix(item.path)}
                end
                className={({ isActive }) => linkCls(isActive)}
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        {/* 우측 유틸 + 모바일 메뉴 */}
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Button
            onClick={openBookingModal}
            variant="gradient"
            size="lg"
            className="rounded-full hidden md:inline-flex"
          >
            {bookText}
          </Button>

          {/* 모바일 햄버거 */}
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

            <SheetContent
              side="right"
              className="w-80 bg-white/80 backdrop-blur-md border-l border-pink-100/50 shadow-xl"
            >
              <SheetHeader className="text-left pb-4 border-b border-pink-100">
                <SheetTitle className="text-2xl font-bold text-gray-800">{menuText}</SheetTitle>
              </SheetHeader>

              {/* 모바일 네비: 데스크탑과 동일한 데이터/동작 */}
              <nav className="mt-6 flex flex-col space-y-1" aria-label="Mobile">
                {items.map((item) =>
                  item.scrollToId ? (
                    <button
                      key={item.pk}
                      onClick={() => go(item.scrollToId!)}
                      className={linkCls(isHashActive(item.scrollToId!))}
                      aria-current={isHashActive(item.scrollToId!) ? 'page' : undefined}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <NavLink
                      key={item.pk}
                      to={withPrefix(item.path)}
                      end
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => linkCls(isActive)}
                    >
                      {item.label}
                    </NavLink>
                  )
                )}
              </nav>

              <div className="pt-6 border-t border-pink-100">
                <Button
                  onClick={() => {
                    setOpen(false)
                    openBookingModal?.()
                  }}
                  variant="gradient"
                  size="lg"
                  className="w-full rounded-full"
                >
                  {bookText}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
