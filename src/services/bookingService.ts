import { supabase } from "./supabase";

/**
 * PHẦN 20 — Lấy danh sách lịch đặt đã xác nhận của một phòng trong khoảng thời gian
 */
export async function getRoomBookings(
  roomId: string,
  startAt: string,
  endAt: string
) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("room_id", roomId)
    .eq("status", "confirmed")
    .lt("start_at", endAt)
    .gt("end_at", startAt);

  if (error) {
    throw error;
  }

  return data;
}

/**
 * PHẦN 21 — Hàm thực hiện tạo đơn đặt phòng (Book Room)
 */
export async function createBooking(
  roomId: string,
  userId: string,
  userName: string,
  userRole: "student" | "teacher",
  startAt: string,
  endAt: string
) {
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      room_id: roomId,
      user_id: userId,
      user_name: userName,
      user_role: userRole,
      start_at: startAt,
      end_at: endAt,
      status: "confirmed",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * BƯỚC 25 — Lấy danh sách booking của một user
 */
export async function getMyBookings(userId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      rooms (
        id,
        name,
        type,
        location,
        capacity,
        image
      )
    `)
    .eq("user_id", userId)
    .order("start_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Hủy đơn đặt phòng
 */
export async function cancelBooking(bookingId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .update({
      status: "cancelled",
    })
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
export async function isRoomBooked(
  roomId: string,
  startAt: string,
  endAt: string
) {
  const { data, error } = await supabase
    .from("bookings")
    .select("id, start_at, end_at, status")
    .eq("room_id", roomId)
    .neq("status", "cancelled")
    .lt("start_at", endAt)
    .gt("end_at", startAt);

  if (error) {
    throw error;
  }

  return data && data.length > 0 ? data[0] : null;
}