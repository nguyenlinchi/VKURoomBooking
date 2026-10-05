export type RoomStatus =
  | "available"
  | "occupied"
  | "maintenance";

export type RoomType =
  | "Study Room"
  | "Computer Lab"
  | "Laboratory"
  | "Meeting Room";

export interface Room {
  id: string;

  name: string;

  type: RoomType;

  building: string;

  location: string;

  capacity: number;

  status: RoomStatus;

  image: string;

  description: string;

  facilities: string[];
}