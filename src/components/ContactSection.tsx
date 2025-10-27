import ContactInfo from './ContactInfo'
import ContactMap from './ContactMap'
import SocialMedia from './SocialMedia'


export default function ContactSection() {
  return (
    <div id="contacts" className="w-full mt-32 lg:mt-40">
      {/* Contact Information Section */}
      <div className="bg-gradient-to-br from-gray-50 via-white to-pink-50/30 py-20">
        <div className="max-w-6xl px-6 mx-[42px] my-[30px]">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-700 mb-4 px-[0px] py-[13px]">
              Contacts
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <ContactInfo />
            <ContactMap />
          </div>

          {/* Social Media Icons - 동일한 배경 내에서 */}
          <SocialMedia />
        </div>
      </div>
    </div>
  )
}
