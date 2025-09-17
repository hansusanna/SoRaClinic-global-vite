import BeautyCarousel from '../BeautyCarousel'
import ContactSection from '../ContactSection'

interface HomePageProps {
  setCurrentPage?: (page: string) => void
  onBookNow?: () => void
}

export default function HomePage({ setCurrentPage, onBookNow }: HomePageProps) {
  const handleNavigation = (page: string) => {
    if (page === 'home') {
      // If already on home page, scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (setCurrentPage) {
      setCurrentPage(page)
    }
  }

  const handleNavigateToTreatments = () => {
    handleNavigation('treatments')
  }

  return (
    <div className="relative bg-gradient-to-br from-pink-100 via-orange-50 to-white">
      {/* Beautiful K-Beauty Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200/40 via-orange-100/30 to-rose-50/20 pointer-events-none">
        {/* Soft gradient overlays for depth */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-pink-100/20 via-transparent to-orange-100/20"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
      </div>

      {/* Main Beauty Carousel */}
      <div className="relative z-10">
        <BeautyCarousel onNavigateToTreatments={handleNavigateToTreatments} />
      </div>

      {/* Contact Section */}
      <div className="relative z-10">
        <ContactSection onNavigateToPage={handleNavigation} />
      </div>
    </div>
  )
}
