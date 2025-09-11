import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';

// 페이지들 직접 import (lazy 안 씀)
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import EventPage from './pages/Event';
import EventdetailPage from "./pages/Eventdetail";
import TreatmentsPage from './pages/Treatments';
import AdminPage from './pages/Admin';
import AdminLoginPage from './pages/AdminLogin';

export default function Routers() {
  return ( 
    <Layout>  
      <Routes>
        {/* children 패턴: 각 라우트마다 Layout을 감싸서 children으로 전달 */}
        {/* navi.json 맵돌리다 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about/:content?" element={<AboutPage />} />
        <Route path="/event/:category_id?" element={<EventPage />} />
         <Route path="/event/:pk" element={<EventdetailPage />} />
        <Route path="/treatments" element={<TreatmentsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* 404 */}
        <Route path="*" element={<Layout><div className="p-6">페이지를 찾을 수 없어요. 🙏</div></Layout>} />
      </Routes> 
    </Layout> 
  );
}
