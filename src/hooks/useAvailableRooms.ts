import {
  useQuery
} from "@tanstack/react-query";

import {
  getAvailableRooms
} from "../services/roomService";


export function useAvailableRooms(
  startAt?: string,
  endAt?: string
) {

  return useQuery({

    queryKey: [
      "available-rooms",
      startAt,
      endAt
    ],

    queryFn: () =>
      getAvailableRooms(
        startAt!,
        endAt!
      ),

    enabled:
      !!startAt &&
      !!endAt,

  });

}