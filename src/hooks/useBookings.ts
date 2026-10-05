import { useQuery } from "@tanstack/react-query";
import { getMyBookings } from "../services/bookingService";

export function useBookings(userId?: string) {
  return useQuery({
    queryKey: ["my-bookings", userId],

    queryFn: () => {
      if (!userId) {
        throw new Error("User ID không tồn tại");
      }

      return getMyBookings(userId);
    },

    enabled: !!userId,
  });
}
