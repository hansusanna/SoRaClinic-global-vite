export interface EventItem {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  thumbnail?: string;
  isActive: boolean;
}