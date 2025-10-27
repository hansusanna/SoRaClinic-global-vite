import { useNavigate, useParams } from 'react-router-dom'
import BeautyCarousel from '../BeautyCarousel'
import ContactSection from '../ContactSection'

export default function HomePage() {
  const navigate = useNavigate()
  const { lang } = useParams<{ lang: string }>()

  // 공용 내비게이션 헬퍼 (이건 그대로 둡니다)
  const handleNavigation = (page: string) => {
    console.log('[HomePage] handleNavigation activated. Navigating to:', page);
    if (page === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    navigate(`/${lang}/${page}`)
  }

  return (
    <div className="relative">
      <div className="relative z-10">
        <BeautyCarousel onNavigateToTreatments={() => handleNavigation('treatments')} />
      </div>

      <div className="relative z-10">
        <section id="contacts" className="scroll-mt-20 md:scroll-mt-24">
          <ContactSection onNavigateToPage={handleNavigation}/>
        </section>
      </div>
    </div>
  )
}
