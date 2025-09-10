import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';

// 페이지들 직접 import (lazy 안 씀)
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import EventPage from './pages/Event';
import TreatmentsPage from './pages/Treatments';
import AdminPage from './pages/Admin';
import AdminLoginPage from './pages/AdminLogin';

export default function Routers() {
  return (    
      <Routes>
        {/* children 패턴: 각 라우트마다 Layout을 감싸서 children으로 전달 */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/event" element={<Layout><EventPage /></Layout>} />
        <Route path="/treatments" element={<Layout><TreatmentsPage /></Layout>} />
        <Route path="/admin" element={<Layout><AdminPage /></Layout>} />
        <Route path="/admin/login" element={<Layout><AdminLoginPage /></Layout>} />

        {/* 404 */}
        <Route path="*" element={<Layout><div className="p-6">페이지를 찾을 수 없어요. 🙏</div></Layout>} />
      </Routes> 
  );
}
