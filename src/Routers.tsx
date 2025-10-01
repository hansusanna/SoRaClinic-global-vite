import { Routes, Route } from 'react-router-dom'
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

export default function Routers() {
  return (
    <Routes>
      {/* 레이아웃 라우트 */}
      <Route element={<Layout />}>
        {/* index = "/" */}
        <Route index element={<HomePage />} />
        <Route path="about/:content?" element={<AboutPage />} />
        <Route path="event/:category_id?" element={<EventPage />} />
        <Route path="treatments" element={<TreatmentsPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="/styleguide" element={<StyleGuide />} />

        {/* 404 */}
        <Route
          path="*"
          element={<div className="p-6">페이지를 찾을 수 없어요. 🙏</div>}
        />
      </Route>
    </Routes>
  )
}
