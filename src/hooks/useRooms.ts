import { useQuery } from "@tanstack/react-query";
import { getRoomById } from "../services/roomService";

export function useRoom(roomId?: string) {
  return useQuery({
    queryKey: ["room", roomId],

    queryFn: () => {
      if (!roomId) {
        throw new Error("Room ID không tồn tại");
      }

      return getRoomById(roomId);
    },

    enabled: !!roomId,
  });
}