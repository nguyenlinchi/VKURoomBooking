export type UserRole =
  | "student"
  | "teacher";

export type BookingStatus =
  | "confirmed"
  | "cancelled";

export interface Booking {

  id: string;

  roomId: string;

  userId: string;

  userName: string;

  userRole: UserRole;

  date: string;

  startTime: string;

  endTime: string;

  status: BookingStatus;

  createdAt: string;
}