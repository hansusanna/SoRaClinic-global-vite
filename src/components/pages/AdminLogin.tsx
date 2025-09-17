export default function AdminLoginPage() {
  return (
    <section className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">관리자 로그인</h1>
      <form className="max-w-sm space-y-3">
        <input className="border rounded w-full p-2" placeholder="ID" />
        <input className="border rounded w-full p-2" placeholder="Password" type="password" />
        <button className="border rounded px-4 py-2">로그인</button>
      </form>
    </section>
  );
}
