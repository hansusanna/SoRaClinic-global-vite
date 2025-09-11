export interface Reservation {
  id: number;
  name: string;
  phone: string;
  department: Department;
  date: string;
  time: string;
  status: ReservationStatus;
}

export type Department =
  | "implants"
  | "pediatrics"
  | "orthodontics"
  | "whitening"
  | "cosmetic"
  | "etc";

export type ReservationStatus = "대기" | "확정" | "완료" | "취소";