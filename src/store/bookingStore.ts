import { create } from "zustand";

interface BookingStore {

  search: string;

  capacityFilter:
    | "all"
    | "small"
    | "medium"
    | "large";

  statusFilter:
    | "all"
    | "available"
    | "occupied"
    | "maintenance";

  selectedDate: string;

  startTime: string;

  endTime: string;

  setSearch: (
    value: string
  ) => void;

  setCapacityFilter: (
    value:
      | "all"
      | "small"
      | "medium"
      | "large"
  ) => void;

  setStatusFilter: (
    value:
      | "all"
      | "available"
      | "occupied"
      | "maintenance"
  ) => void;

  setSelectedDate: (
    value: string
  ) => void;

  setStartTime: (
    value: string
  ) => void;

  setEndTime: (
    value: string
  ) => void;
}

export const useBookingStore =
  create<BookingStore>((set) => ({

    search: "",

    capacityFilter: "all",

    statusFilter: "all",

    selectedDate: "",

    startTime: "09:00",

    endTime: "10:00",

    setSearch: (value) =>
      set({
        search: value
      }),

    setCapacityFilter: (value) =>
      set({
        capacityFilter: value
      }),

    setStatusFilter: (value) =>
      set({
        statusFilter: value
      }),

    setSelectedDate: (value) =>
      set({
        selectedDate: value
      }),

    setStartTime: (value) =>
      set({
        startTime: value
      }),

    setEndTime: (value) =>
      set({
        endTime: value
      })

  }));