import { useState } from 'react'
import { MapPin, Mail, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next' // i18n 훅 임포트
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { toast } from 'sonner'

interface ContactForm {
  name: string
  email: string
  phone: string
  message: string
}
interface ContactInfoProps {
  showForm: boolean; // 'false'를 받으면 폼을 숨깁니다.
}

export default function ContactInfo({ showForm }: ContactInfoProps) {
  const { t } = useTranslation('contact')
  const { t: tForm } = useTranslation('form')

  // contact.json에서 데이터 불러오기
  const openingHours = t('openingHours', { returnObjects: true }) as {
    days: string
    hours: string
  }[]
  const contactInfo = t('contactInfo', { returnObjects: true }) as {
    visitMessage: string
    address: string
    email: string
    phone: string
  }

  // --- 폼 상태 및 로직 ---
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.name || !formData.email || !formData.message) {
        toast.error(tForm('toast.missingFields'))
        setIsSubmitting(false)
        return
      }
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3336005e/contact`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(formData),
        },
      )
      const result = await response.json()
      if (response.ok && result.status === 'success') {
        toast.success(tForm('toast.success'))
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        })
      } else {
        throw new Error(result.message || 'Failed to send message')
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
      toast.error(tForm('toast.error'))
    } finally {
      setIsSubmitting(false)
    }
  }
  // --- 폼 로직 끝 ---

  return (
    <div className="space-y-8">
      {/* Contact Info Card(contact.json 사용) */}
      <div className="bg-gray-100/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50">
        {/* Opening Hours */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">           
            {t('openingHoursTitle')}
          </h3>
          <div className="space-y-4">
            {/* i18n 변수(openingHours) 사용 */}
            {Array.isArray(openingHours) &&
              openingHours.map((schedule, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">{schedule.days}</span>
                  <span className="text-[#0ABAB5] font-medium">
                    {schedule.hours}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Visit Message */}
        <div className="mb-8">
          <p className="text-gray-500 leading-relaxed">
            {/* i18n 변수 사용 */}
            {contactInfo?.visitMessage}
          </p>
        </div>

        {/* Contact Details */}
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-[#0ABAB5]/10 rounded-full flex items-center justify-center mt-1">
              <MapPin className="w-4 h-4 text-[#0ABAB5]" />
            </div>
            <div>
             {/* i18n 변수 사용 */}
              <p className="text-gray-600">{contactInfo?.address}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-[#0ABAB5]/10 rounded-full flex items-center justify-center">
              <Mail className="w-4 h-4 text-[#0ABAB5]" />
            </div>
            <div>
              {/* i18n 변수 사용 */}
              <p className="text-gray-600">{contactInfo?.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-[#0ABAB5]/10 rounded-full flex items-center justify-center">
              <Phone className="w-4 h-4 text-[#0ABAB5]" />
            </div>
            <div>
             {/* i18n 변수 사용 */}
              <p className="text-gray-600">{contactInfo?.phone}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Contact Form Card (form.json 사용) */}
      {showForm && (
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">
          {tForm('title')}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 'name' 필드 */}
          <div className="space-y-2">
            <label htmlFor="name" className="font-medium text-gray-700">
              {tForm('fields.name.label')}
            </label>
            <input
              id="name"
              type="text"
              value={formData.name} 
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={t('form.namePlaceholder', 'Enter your full name')}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0ABAB5]/50"
            />
          </div>

          {/* 'email' 필드 */}
          <div className="space-y-2">
            <label htmlFor="email" className="font-medium text-gray-700">
              {tForm('fields.email.label')}
            </label>
            <input
              id="email"
              type="email"
              value={formData.email} 
              onChange={(e) => handleInputChange('email', e.target.value)} 
              placeholder={t('form.emailPlaceholder', 'your.email@example.com')}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0ABAB5]/50"
            />
          </div>

          {/* 'phone' 필드 */}
          <div className="space-y-2">
            <label htmlFor="phone" className="font-medium text-gray-700">
              {tForm('fields.phone.label')}
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone} 
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder={t('form.phonePlaceholder', '+1 (555) 123-4567')}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0ABAB5]/50"
            />
          </div>

          {/* 'message' 필드 */}
          <div className="space-y-2">
            <label htmlFor="message" className="font-medium text-gray-700">
               {tForm('fields.message.label')}
            </label>
            <textarea
              id="message"
              rows={3}
              value={formData.message} 
              onChange={(e) => handleInputChange('message', e.target.value)} 
              placeholder={t('form.messagePlaceholder', 'Write your message here...')}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0ABAB5]/50 resize-none"
            />
          </div>

          {/* 'submit' 버튼 */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 rounded-lg bg-[#0ABAB5] text-white font-semibold transition-all duration-300 hover:bg-[#f472b6] disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {isSubmitting
                ? tForm('buttons.submitting')
                : tForm('buttons.submit')
              }
            </button>
          </div>
        </form>
      </div>
      )}
    </div>
  )
}
