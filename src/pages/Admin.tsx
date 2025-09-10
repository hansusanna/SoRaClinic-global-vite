import { Link } from "react-router-dom";

export default function AdminPage() {
  return (
    <section className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">관리자 대시보드</h1>
      <Link to="/admin/login" className="underline">로그인 페이지로</Link>
    </section>
  );
}
