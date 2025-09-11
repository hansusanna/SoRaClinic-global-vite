export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export type UserRole = "admin" | "doctor" | "staff" | "patient";