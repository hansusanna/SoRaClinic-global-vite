import { useTranslation } from 'react-i18next'
import ContactInfo from './ContactInfo'
import ContactMap from './ContactMap'
import SocialMedia from './SocialMedia'

interface ContactSectionProps {
  onNavigateToPage?: (page: string) => void
}

export default function ContactSection({ onNavigateToPage }: ContactSectionProps) {

  const { t: tNav } = useTranslation('navi')
  void onNavigateToPage

  return (
    <div id="contacts" className="w-full mt-32 lg:mt-40">
      <div className="bg-gradient-to-br from-gray-50 via-white to-pink-50/30 py-20">
        <div className="px-6 mx-[42px] my-[30px]">
          <div className="text-center mb-16">
     
            <h2 className="text-4xl md:text-5xl font-bold text-gray-700 mb-4 px-[0px] py-[13px]">
              {tNav('items.3.label')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <ContactInfo showForm={false} />
            <ContactMap />
          </div>
          <SocialMedia />
        </div>
      </div>
    </div>
  )
}
