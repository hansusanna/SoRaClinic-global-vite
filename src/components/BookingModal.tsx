import { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'

import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Calendar } from './ui/calendar'

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { toast } from 'sonner'

import type { BookingForm, BookingOptions } from '@/db/type/booking'
import type { TreatmentPost } from '@/db/type/treatment';
// import { projectId, publicAnonKey } from '../utils/supabase/info'

import { supabase } from '@/lib/supabaseClient'

// form.json의 타입 정의
interface FormFieldText {
  label: string
  placeholder: string
  required: boolean 
}
interface FormText {
  title: string
  description: string
  fields: {
    [key in keyof BookingForm | 'appointmentDate']: FormFieldText
  }
  sections: {
    personal: string
    appointment: string
    assessment: string
  }
  buttons: {
    cancel: string
    submit: string
    submitting: string
  }
  toast: {
    missingFields: string
    success: string
    error: string
  }
}

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preselectedTreatment?: TreatmentPost | null;  
}

export default function BookingModal({ open, onOpenChange, preselectedTreatment }: BookingModalProps) {
  //현재 언어 감지
  const { i18n } = useTranslation()
  const currentLang = i18n.language
  const [formText, setFormText] = useState<FormText | null>(null)
  const [loadedOptions, setLoadedOptions] = useState<BookingOptions | null>(null)

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

  useEffect(() => {
    let active = true

    const loadData = async () => {
      const formUrl = `/locales/${currentLang}/pages/form.json`
      const optionsUrl = `/locales/${currentLang}/pages/options.json`
      const fallbackFormUrl = `/locales/en/pages/form.json`
      const fallbackOptionsUrl = `/locales/en/pages/options.json`

      const fetchJson = async (url: string) => {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
        }
        return response.json()
      }

      try {
        const [formDataResult, optionsDataResult] = await Promise.all([
          fetchJson(formUrl),
          fetchJson(optionsUrl)
        ])

        if (active) {
          setFormText(formDataResult)
          setLoadedOptions(optionsDataResult)
        }
      } catch (error) {
        console.error(`Failed to load data for ${currentLang}:`, error)
        try {
          const [fallbackFormDataResult, fallbackOptionsDataResult] = await Promise.all([
             fetchJson(fallbackFormUrl),
             fetchJson(fallbackOptionsUrl)
          ])
          if (active) {
            setFormText(fallbackFormDataResult)
            setLoadedOptions(fallbackOptionsDataResult)
          }
        } catch (fallbackError) {
          console.error(`Failed to load fallback data (en):`, fallbackError)
          if (active) {
             setFormText(null);
             setLoadedOptions(null);
          }
        }
      }
    }

    if (open) {
      setFormText(null);
      setLoadedOptions(null);
      loadData()
    }

    return () => {
      active = false
    }
  }, [currentLang, open])

  // useEffect 2: preselectedTreatment 처리 및 폼 초기화
  useEffect(() => {
     // 모달 열림 + preselectedTreatment 값 존재 + options 로딩 완료 시 실행
     if (open && preselectedTreatment && loadedOptions) {
        // options.treatmentTypes 배열에서 preselectedTreatment.title 찾기
        const isValidTreatment = loadedOptions.treatmentTypes.includes(preselectedTreatment.title);

        if (isValidTreatment) {
            // formData.treatmentType 업데이트
            setFormData(prev => ({ ...prev, treatmentType: preselectedTreatment.title }));
        } else {
             console.warn(`Preselected treatment "${preselectedTreatment.title}" not found in available options.`);
             // 못 찾으면 빈 값으로 설정
             setFormData(prev => ({ ...prev, treatmentType: '' }));
        }
     } else if (!open) { // 모달 닫힐 때 실행
        // 폼 데이터 초기화
        setFormData({
            name: '', email: '', phone: '', treatmentType: '', appointmentDate: undefined,
            timeSlot: '', skinType: '', skinConcerns: '', previousTreatments: '',
            allergies: '', message: '',
        });
     }
  }, [open, preselectedTreatment, loadedOptions]);

  const requiredKeys = useMemo(
    () =>{
      // formText가 아직 로드 안됐으면 빈 배열 반환
      if (!formText) return [] 
      
      // formText.fields 객체를 순회하며 'required: true'인 키만 필터링
      return (Object.keys(formText.fields) as (keyof BookingForm)[])
        .filter(key => formText.fields[key]?.required === true)
    },
    [formText]
  )

  const handleInputChange = <K extends keyof BookingForm>(field: K, value: BookingForm[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // 날짜 포맷과 플레이스홀더 수정
  const formatDate = (date: Date | undefined) => {
    if (!date) return formText ? formText.fields.appointmentDate.placeholder : 'Select date'
    
    // BCP 47 태그로 변환 (예: 'ko' -> 'ko-KR')
    const locale = currentLang.startsWith('ko') ? 'ko-KR' : 
                   currentLang.startsWith('en') ? 'en-US' : 
                   currentLang.startsWith('zh') ? 'zh-CN' : 
                   currentLang
    
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // const handleSubmit2= async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   if (isSubmitting || !formText) return // formText 로딩 안됐으면 제출 방지
  //   setIsSubmitting(true)

  //   try {
  //     // required 필수값 확인
  //     const missing = requiredKeys.filter(k => {
  //       const v = formData[k]
  //       return v === '' || v === undefined || v === null
  //     })
  //     if (missing.length > 0) {
  //       toast.error(formText.toast.missingFields) 
  //       setIsSubmitting(false)
  //       return
  //     }

  //     // 전송 페이로드
  //     const bookingData = {
  //       name: formData.name,
  //       email: formData.email,
  //       phone: formData.phone,
  //       treatment_type: formData.treatmentType,
  //       appointment_date: formData.appointmentDate
  //         ? new Date(formData.appointmentDate).toISOString().split('T')[0]
  //         : '', // 날짜 형식 변환
  //       time_slot: formData.timeSlot,
  //       skin_type: formData.skinType,
  //       skin_concerns: formData.skinConcerns,
  //       previous_treatments: formData.previousTreatments,
  //       allergies: formData.allergies,
  //       message: formData.message,
  //     }

  //     const response = await fetch(
  //       `https://${projectId}.supabase.co/functions/v1/make-server-3336005e/bookings`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${publicAnonKey}`,
  //         },
  //         body: JSON.stringify(bookingData),
  //       }
  //     )

  //     const result = await response.json()

  //     if (response.ok && result.status === 'success') {
  //       toast.success(formText.toast.success)
  //       // Reset
  //       setFormData({
  //         name: '',
  //         email: '',
  //         phone: '',
  //         treatmentType: '',
  //         appointmentDate: undefined,
  //         timeSlot: '',
  //         skinType: '',
  //         skinConcerns: '',
  //         previousTreatments: '',
  //         allergies: '',
  //         message: '',
  //       })
  //       onOpenChange(false)
  //     } else {
  //       throw new Error(result.message || formText.toast.error)
  //     }
  //   } catch (err) {
  //     console.error('Booking submission error:', err)
  //     toast.error(formText.toast.error)
  //   } finally {
  //     setIsSubmitting(false)
  //   }
  // }

  // 오늘 이전 날짜 비활성
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || !formText) return // formText 로딩 안됐으면 제출 방지
    setIsSubmitting(true)

    try {
      // required 필수값 확인
      const missing = requiredKeys.filter(k => {
        const v = formData[k]
        return v === '' || v === undefined || v === null
      })
      if (missing.length > 0) {
        toast.error(formText.toast.missingFields)
        setIsSubmitting(false)
        return
      }

      // Supabase DB 컬럼명(snake_case)과 일치시킴
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        treatment_type: formData.treatmentType,
        appointment_date: formData.appointmentDate
          ? new Date(formData.appointmentDate).toISOString().split('T')[0]
          : '', // 날짜 형식 변환
        time_slot: formData.timeSlot,
        skin_type: formData.skinType,
        skin_concerns: formData.skinConcerns,
        previous_treatments: formData.previousTreatments,
        allergies: formData.allergies,
        message: formData.message,
      }

     
      // 'supabase' 클라이언트를 직접 사용하여 'bookings' 테이블에 삽입
      const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select() // <-- 이것을 추가해야 data에 값이 들어옵니다.

      if (error) {
        // RLS가 켜져있다면 여기서 'permission denied' 오류가 발생합니다.
        console.error('Supabase insert error:', error)
        throw error;
      }
      // --- (수정 끝) ---

    // 성공 로직 (error가 없으면 성공)
    if (data && data.length > 0) {
      // data[0]가 방금 삽입된 예약 정보입니다.
      console.log('성공적으로 삽입된 데이터:', data[0]);

      // 예시: 토스트 메시지에 예약자 이름과 ID를 함께 표시
      toast.success(`${data[0].name}님, 예약이 완료되었습니다. (예약 ID: ${data[0].id})`);
    } else {
      // data가 비어있는 비정상적인 경우 (이론상으론 error에서 걸러짐)
      toast.success(formText.toast.success);
    }
      
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
      
    } catch (err: unknown) { 
      console.error('Booking submission error:', err)
      let errorMessage = formText.toast.error;
      // 'err'가 Error 객체인지 확인하여 안전하게 message에 접근
      if (err instanceof Error) {
        // RLS 오류 메시지를 포함할 수 있음
        errorMessage = err.message;
      }
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }
  const isPast = (d: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dd = new Date(d)
    dd.setHours(0, 0, 0, 0)
    return dd < today
  }

  if (!formText || !loadedOptions) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl bg-white p-10 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <span className="h-12 w-12 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500" />
            <p className="text-gray-600">Loading form...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  
  const { treatmentTypes, timeSlots, skinTypes, skinConcernOptions } = loadedOptions;

  // 모든 UI 텍스트를 formText 객체에서 가져오도록 수정
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border border-pink-200 text-gray-800 shadow-2xl rounded-2xl overflow-hidden">
        {/* 배경 오버레이 */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink-50/30 via-white to-purple-50/20" />
        <div className="relative z-10 max-h-[90vh] overflow-y-auto p-6 pb-8">
          <DialogHeader className="mt-6 border-b border-pink-100 pb-6 text-center">
            {/* JSON 구조에 따라 title이 "SoRa 클리닉 예약" 통째로 들어감 */}
            <DialogTitle className="mb-2 text-3xl font-bold text-gray-800">
              {formText.title}
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed text-gray-600">
              {formText.description}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
             {/* Personal Info Section */}
            <section className="space-y-4 rounded-2xl border border-pink-100 bg-pink-50/30 p-6">
              <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-800">
                <svg className="mr-2 h-5 w-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {formText.sections.personal}
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium text-gray-700">
                    {formText.fields.name.label}
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    className="border-pink-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
                    placeholder={formText.fields.name.placeholder}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium text-gray-700">
                    {formText.fields.email.label}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    className="border-pink-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
                    placeholder={formText.fields.email.placeholder}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="font-medium text-gray-700">
                  {formText.fields.phone.label}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  className="border-pink-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
                  placeholder={formText.fields.phone.placeholder}
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
                {formText.sections.appointment}
              </h3>

              <div className="space-y-2">
                <Label className="font-medium text-gray-700">{formText.fields.treatmentType.label}</Label>
                <Select value={formData.treatmentType} onValueChange={v => handleInputChange('treatmentType', v)}>
                  <SelectTrigger className="bg-white text-gray-800 focus:border-purple-400 focus:ring-purple-400/20 border-purple-200">
                    <SelectValue placeholder={formText.fields.treatmentType.placeholder} />
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
                  <Label className="font-medium text-gray-700">{formText.fields.appointmentDate.label}</Label>
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
                  <Label className="font-medium text-gray-700">{formText.fields.timeSlot.label}</Label>
                  <Select value={formData.timeSlot} onValueChange={v => handleInputChange('timeSlot', v)}>
                    <SelectTrigger className="bg-white text-gray-800 focus:border-purple-400 focus:ring-purple-400/20 border-purple-200">
                      <SelectValue placeholder={formText.fields.timeSlot.placeholder} />
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
                {formText.sections.assessment}
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">{formText.fields.skinType.label}</Label>
                  <Select value={formData.skinType} onValueChange={v => handleInputChange('skinType', v)}>
                    <SelectTrigger className="bg-white text-gray-800 focus:border-teal-400 focus:ring-teal-400/20 border-teal-200">
                      <SelectValue placeholder={formText.fields.skinType.placeholder} />
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
                  <Label className="font-medium text-gray-700">{formText.fields.skinConcerns.label}</Label>
                  <Select value={formData.skinConcerns} onValueChange={v => handleInputChange('skinConcerns', v)}>
                    <SelectTrigger className="bg-white text-gray-800 focus:border-teal-400 focus:ring-teal-400/20 border-teal-200">
                      <SelectValue placeholder={formText.fields.skinConcerns.placeholder} />
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
                  {formText.fields.previousTreatments.label}
                </Label>
                <Textarea
                  id="previousTreatments"
                  value={formData.previousTreatments}
                  onChange={e => handleInputChange('previousTreatments', e.target.value)}
                  className="min-h-[80px] resize-none border-teal-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-teal-400 focus:ring-teal-400/20"
                  placeholder={formText.fields.previousTreatments.placeholder}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies" className="font-medium text-gray-700">
                  {formText.fields.allergies.label}
                </Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={e => handleInputChange('allergies', e.target.value)}
                  className="min-h-[60px] resize-none border-teal-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-teal-400 focus:ring-teal-400/20"
                  placeholder={formText.fields.allergies.placeholder}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="font-medium text-gray-700">
                  {formText.fields.message.label}
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={e => handleInputChange('message', e.target.value)}
                  className="min-h-[100px] resize-none border-teal-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-teal-400 focus:ring-teal-400/20"
                  placeholder={formText.fields.message.placeholder}
                />
              </div>
            </section>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-pink-100 pt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-gray-200 bg-white px-8 py-3 text-gray-700 hover:bg-gray-50">
                {formText.buttons.cancel}
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
                    {formText.buttons.submitting}
                  </span>
                ) : (
                  formText.buttons.submit
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}