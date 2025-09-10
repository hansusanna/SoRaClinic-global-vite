

export default function About() {
  return (
    <div className="p-6 space-y-6">
      {/*공통(default)**으로 충분한 페이지 → 그냥 <Seo /> */}
      {/* SEO 메타 태그 개별 SEO가 필요한 페이지 → props를 넣어 덮어쓰기 */}
      {/* <Seo
        title="About — SoRa Clinic"
        description="SoRa Clinic 소개 페이지"
        canonical="https://sora-react.vercel.app/about"
        ogImage="/icons/og-about.png"
      /> */}

      {/* 페이지 컨텐츠 */}
      <h1 className="text-3xl font-bold">About SoRa Clinic</h1>
      <p className="text-lg text-gray-700">
        SoRa Clinic은 글로벌 K-뷰티 전문 클리닉으로, 최고의 스킨케어 서비스를 제공합니다.
      </p>
    </div>
  )
}
