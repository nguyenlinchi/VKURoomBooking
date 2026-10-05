import { useQuery } from "@tanstack/react-query";
import { isRoomBooked } from "../services/bookingService";

export function useRoomBookingStatus(
  roomId?: string,
  startAt?: string,
  endAt?: string
) {
  return useQuery({
    queryKey: [
      "room-booking-status",
      roomId,
      startAt,
      endAt,
    ],

    queryFn: () => {
      if (!roomId || !startAt || !endAt) {
        throw new Error("Thiếu thông tin kiểm tra phòng");
      }

      return isRoomBooked(
        roomId,
        startAt,
        endAt
      );
    },

    enabled:
      !!roomId &&
      !!startAt &&
      !!endAt &&
      new Date(startAt).getTime() <
        new Date(endAt).getTime(),

    staleTime: 0,
  });
}