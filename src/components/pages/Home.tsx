import BeautyCarousel from '../BeautyCarousel'
import ContactSection from '../ContactSection'

interface HomePageProps {
  setCurrentPage?: (page: string) => void
  onBookNow?: () => void
}

export default function HomePage({ setCurrentPage }: HomePageProps) {
  const handleNavigation = (page: string) => {
    if (page === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentPage?.(page);
  }

  const handleNavigateToTreatments = () => {
    handleNavigation('treatments')
  }

  return (
    <div className="relative">
      {/* Main Beauty Carousel */}
      <div className="relative z-10">
        <BeautyCarousel onNavigateToTreatments={handleNavigateToTreatments} />
      </div>

      {/* Contact Section */}
        <div className="relative z-10">
          <section id="contacts" className="scroll-mt-20 md:scroll-mt-24">
            <ContactSection onNavigateToPage={handleNavigation} />
          </section>
        </div>   
    </div>
  );
}
