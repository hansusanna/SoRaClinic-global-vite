import { useMemo, useState } from 'react'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { toast } from 'sonner'

import type { BookingForm, BookingOptions, BookingField } from '@/db/type/booking'
import rawOptions from '@/db/options.json'
import rawFields from '@/db/form.json'
import { projectId, publicAnonKey } from '../utils/supabase/info'

// props 타입 (컴포넌트 밖에서 정의되어 있지 않다면 여기에 둠)
interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function BookingModal({ open, onOpenChange }: BookingModalProps) {
  const options = rawOptions as BookingOptions
  const fields = (rawFields as BookingField[]) ?? []

  // 옵션 구조 분해 (JSON에서 관리)
  const { treatmentTypes, timeSlots, skinTypes, skinConcernOptions } = options

  // 폼 상태
  const [formData, setFormData] = useState<BookingForm>({
    name: '',
    email: '',
    phone: '',
    treatmentType: '',
    appointmentDate: undefined,
    timeSlot: '',
    skinType: '',
    skinConcerns: '',
    previousTreatments: '',
    allergies: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const requiredKeys = useMemo(
    () =>
      (fields.length
        ? fields.filter(f => f.required).map(f => f.id)
        : (['name', 'email', 'phone', 'treatmentType'] as (keyof BookingForm)[])),
    [fields]
  )

  const handleInputChange = <K extends keyof BookingForm>(field: K, value: BookingForm[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Select date'
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      // required 필수값 확인
      const missing = requiredKeys.filter(k => {
        const v = formData[k]
        return v === '' || v === undefined || v === null
      })
      if (missing.length > 0) {
        toast.error('Please fill in all required fields.')
        setIsSubmitting(false)
        return
      }

      // 전송 페이로드
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.treatmentType,
        date: formData.appointmentDate
          ? new Date(formData.appointmentDate).toISOString().split('T')[0]
          : '',
        time: formData.timeSlot,
        skinType: formData.skinType,
        skinConcerns: formData.skinConcerns,
        previousTreatments: formData.previousTreatments,
        allergies: formData.allergies,
        message: formData.message,
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3336005e/bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(bookingData),
        }
      )

      const result = await response.json()

      if (response.ok && result.status === 'success') {
        toast.success('Booking submitted successfully! Our team will contact you within 24 hours.')
        // Reset
        setFormData({
          name: '',
          email: '',
          phone: '',
          treatmentType: '',
          appointmentDate: undefined,
          timeSlot: '',
          skinType: '',
          skinConcerns: '',
          previousTreatments: '',
          allergies: '',
          message: '',
        })
        onOpenChange(false)
      } else {
        throw new Error(result.message || 'Failed to submit booking')
      }
    } catch (err) {
      console.error('Booking submission error:', err)
      toast.error('Failed to submit booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 오늘 이전 날짜 비활성
  const isPast = (d: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dd = new Date(d)
    dd.setHours(0, 0, 0, 0)
    return dd < today
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border border-pink-200 text-gray-800 shadow-2xl rounded-2xl overflow-hidden">
        {/* 배경 오버레이 */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink-50/30 via-white to-purple-50/20" />
        <div className="relative z-10 max-h-[90vh] overflow-y-auto p-6 pb-8">
          <DialogHeader className="mt-6 border-b border-pink-100 pb-6 text-center">
            <DialogTitle className="mb-2 text-3xl font-bold text-gray-800">
              Book Your{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">SoRa</span>{' '}
              Experience
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed text-gray-600">
              Begin your journey to radiant, glass-like skin with our expert beauty specialists. Fill out the form below
              to schedule your personalized consultation and treatment plan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
      
            <section className="space-y-4 rounded-2xl border border-pink-100 bg-pink-50/30 p-6">
              <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-800">
                <svg className="mr-2 h-5 w-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    className="border-pink-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    className="border-pink-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="font-medium text-gray-700">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  className="border-pink-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </section>

            {/* Appointment Details */}
            <section className="space-y-4 rounded-2xl border border-purple-100 bg-purple-50/30 p-6">
              <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-800">
                <svg className="mr-2 h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Appointment Details
              </h3>

              <div className="space-y-2">
                <Label className="font-medium text-gray-700">Preferred Treatment *</Label>
                <Select value={formData.treatmentType} onValueChange={v => handleInputChange('treatmentType', v)}>
                  <SelectTrigger className="bg-white text-gray-800 focus:border-purple-400 focus:ring-purple-400/20 border-purple-200">
                    <SelectValue placeholder="Select your desired treatment" />
                  </SelectTrigger>
                  <SelectContent className="border-purple-200 bg-white text-gray-800">
                    {treatmentTypes.map(type => (
                      <SelectItem key={type} value={type} className="hover:bg-purple-50">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">Preferred Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-white text-left font-normal border-purple-200 text-gray-800 hover:bg-purple-50"
                      >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(formData.appointmentDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto bg-white p-0 border-purple-200">
                      <Calendar
                      selected={formData.appointmentDate}
                      onSelect={(date) => handleInputChange('appointmentDate', date ?? undefined)}
                      className="text-gray-800"
                      disabled={(d) => isPast(d)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">Preferred Time</Label>
                  <Select value={formData.timeSlot} onValueChange={v => handleInputChange('timeSlot', v)}>
                    <SelectTrigger className="bg-white text-gray-800 focus:border-purple-400 focus:ring-purple-400/20 border-purple-200">
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent className="border-purple-200 bg-white text-gray-800">
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time} className="hover:bg-purple-50">
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Skin Assessment */}
            <section className="space-y-4 rounded-2xl border border-teal-100 bg-teal-50/30 p-6">
              <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-800">
                <svg className="mr-2 h-5 w-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Beauty Assessment
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">Skin Type</Label>
                  <Select value={formData.skinType} onValueChange={v => handleInputChange('skinType', v)}>
                    <SelectTrigger className="bg-white text-gray-800 focus:border-teal-400 focus:ring-teal-400/20 border-teal-200">
                      <SelectValue placeholder="Select your skin type" />
                    </SelectTrigger>
                    <SelectContent className="border-teal-200 bg-white text-gray-800">
                      {skinTypes.map(type => (
                        <SelectItem key={type} value={type} className="hover:bg-teal-50">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">Primary Skin Concerns</Label>
                  <Select value={formData.skinConcerns} onValueChange={v => handleInputChange('skinConcerns', v)}>
                    <SelectTrigger className="bg-white text-gray-800 focus:border-teal-400 focus:ring-teal-400/20 border-teal-200">
                      <SelectValue placeholder="Select your main concern" />
                    </SelectTrigger>
                    <SelectContent className="border-teal-200 bg-white text-gray-800">
                      {skinConcernOptions.map(concern => (
                        <SelectItem key={concern} value={concern} className="hover:bg-teal-50">
                          {concern}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousTreatments" className="font-medium text-gray-700">
                  Previous Beauty Treatments
                </Label>
                <Textarea
                  id="previousTreatments"
                  value={formData.previousTreatments}
                  onChange={e => handleInputChange('previousTreatments', e.target.value)}
                  className="min-h-[80px] resize-none border-teal-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-teal-400 focus:ring-teal-400/20"
                  placeholder="List any previous facial treatments, skincare routines, or current products..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies" className="font-medium text-gray-700">
                  Allergies & Sensitivities
                </Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={e => handleInputChange('allergies', e.target.value)}
                  className="min-h-[60px] resize-none border-teal-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-teal-400 focus:ring-teal-400/20"
                  placeholder="Please list any known allergies or skin sensitivities..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="font-medium text-gray-700">
                  Beauty Goals & Notes
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={e => handleInputChange('message', e.target.value)}
                  className="min-h-[100px] resize-none border-teal-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-teal-400 focus:ring-teal-400/20"
                  placeholder="Tell us about your goals or questions..."
                />
              </div>
            </section>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-pink-100 pt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-gray-200 bg-white px-8 py-3 text-gray-700 hover:bg-gray-50">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl
                           bg-gradient-to-r from-pink-400 via-[#0ABAB5] to-purple-400
                           hover:from-pink-500 hover:via-[#0ABAB5]/90 hover:to-purple-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Booking...
                  </span>
                ) : (
                  'Book Appointment'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
