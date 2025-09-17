import { useState } from 'react'
import { MapPin, Mail, Phone } from 'lucide-react'
import { OPENING_HOURS, CONTACT_INFO } from './pages/contactData'
// import { Button } from './ui/button'
// import { Input } from './ui/input'
// import { Label } from './ui/label'
// import { Textarea } from './ui/textarea'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { toast } from 'sonner'

interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function ContactInfo() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
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
      // Validate required fields
      if (!formData.name || !formData.email || !formData.message) {
        toast.error('Please fill in all required fields')
        setIsSubmitting(false)
        return
      }

      // Submit to Supabase backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3336005e/contact`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(formData),
        }
      )

      const result = await response.json()

      if (response.ok && result.status === 'success') {
        // Success - show toast and reset form
        toast.success("Message sent successfully! We'll get back to you soon.")

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        })
      } else {
        throw new Error(result.message || 'Failed to send message')
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Contact Info Card */}
      <div className="bg-gray-100/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50">
        {/* Opening Hours */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">
            Opening hours
          </h3>
          <div className="space-y-4">
            {OPENING_HOURS.map((schedule, index) => (
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
            {CONTACT_INFO.visitMessage}
          </p>
        </div>

        {/* Contact Details */}
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-[#0ABAB5]/10 rounded-full flex items-center justify-center mt-1">
              <MapPin className="w-4 h-4 text-[#0ABAB5]" />
            </div>
            <div>
              <p className="text-gray-600">{CONTACT_INFO.address}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-[#0ABAB5]/10 rounded-full flex items-center justify-center">
              <Mail className="w-4 h-4 text-[#0ABAB5]" />
            </div>
            <div>
              <p className="text-gray-600">{CONTACT_INFO.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-[#0ABAB5]/10 rounded-full flex items-center justify-center">
              <Phone className="w-4 h-4 text-[#0ABAB5]" />
            </div>
            <div>
              <p className="text-gray-600">{CONTACT_INFO.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Card */}
    </div>
  )
}
