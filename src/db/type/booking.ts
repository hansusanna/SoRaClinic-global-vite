export interface BookingOptions {
  treatmentTypes: string[]
  timeSlots: string[]
  skinTypes: string[]
  skinConcernOptions: string[]
}

export interface BookingForm {
  name: string;
  email: string;
  phone: string;
  treatmentType: string;
  appointmentDate: Date | undefined; // UI에서 Date로 관리
  timeSlot: string;
  skinType: string;
  skinConcerns: string;
  previousTreatments: string;
  allergies: string;
  message: string;
}

export type BookingFieldType = 'text' | 'email' | 'tel' | 'select' | 'date' | 'textarea';
export type BookingSection = 'personal' | 'appointment' | 'assessment';

export interface BookingField {
  id: keyof BookingForm;           // 'name' | 'email' | ...
  label: string;
  type: BookingFieldType;
  required?: boolean;
  section: BookingSection;
  optionsKey?: keyof BookingOptions; // select일 때 options 참조 키
}