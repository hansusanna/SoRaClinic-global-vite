import { Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom'
import { setLanguage } from './i18n'
import Layout from './Layout'

// 페이지들 직접 import (lazy 안 씀)
import HomePage from './components/pages/Home'
import AboutPage from './components/pages/About'
import EventPage from './components/pages/Event'
import TreatmentsPage from './components/pages/Treatments'
import AdminPage from './components/pages/Admin'
import AdminLoginPage from './components/pages/AdminLogin'
// 테일윈드 스타일가이드  
import StyleGuide from './styles/StyleGuide'

function LangSetter() {
  const { lang } = useParams()
  setLanguage(lang || 'en')    // ko/en/cn 중 하나로 정규화됨
  return <Outlet />
}


export default function Routers() {
  return (
    <Routes>
      {/* /ko, /en, /cn 프리픽스 */}
      <Route path=":lang" element={<LangSetter />}>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about/:content?" element={<AboutPage />} />
          <Route path="event/:category_id?" element={<EventPage />} />
          <Route path="treatments" element={<TreatmentsPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route path="styleguide" element={<StyleGuide />} />
          <Route path="*" element={<div className="p-6">페이지를 찾을 수 없어요. 🙏</div>} />
        </Route>
      </Route>

      {/* 루트 접근 시 기본 언어로 리다이렉트 */}
      <Route path="*" element={<Navigate to="/en" replace />} />
    </Routes>
  )
}