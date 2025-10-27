
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './Layout'
import HomePage from './components/pages/Home'
import AboutPage from './components/pages/About'
import EventPage from './components/pages/Event'
import TreatmentsPage from './components/pages/Treatments'
import AdminPage from './components/pages/Admin'
import AdminLoginPage from './components/pages/AdminLogin'
import StyleGuide from './styles/StyleGuide'

const LANG_RE = /^\/(ko|en|cn)(?=\/|$)/

export default function Routers() {
  const { pathname, search, hash } = useLocation()

  // 프리픽스가 없을 때만 /ko로 한 번 보냄
  if (!LANG_RE.test(pathname)) {
    const next = `/ko${pathname === '/' ? '' : pathname}${search}${hash}`
    const current = `${pathname}${search}${hash}`
    if (next !== current) return <Navigate to={next} replace />
  }

  return (
    <Routes>
      {/* 정규식 X, 와일드카드 * O (중첩 라우팅 허용) */}
      <Route path="/:lang/*" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="event/:category_id?" element={<EventPage />} />
        <Route path="treatments" element={<TreatmentsPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="styleguide" element={<StyleGuide />} />
        <Route path="*" element={<div className="p-6">페이지를 찾을 수 없어요. 🙏</div>} />
      </Route>
    </Routes>
  )
}
