import { supabase } from "./supabase";


// Lấy danh sách phòng
export async function getRooms() {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}


// Lấy một phòng theo ID
export async function getRoomById(roomId: string) {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", roomId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}


// Lấy phòng còn trống theo thời gian
export async function getAvailableRooms(
  startAt: string,
  endAt: string
) {
  const { data, error } = await supabase.rpc(
    "get_available_rooms",
    {
      p_start_at: startAt,
      p_end_at: endAt,
    }
  );

  if (error) {
    throw error;
  }

  return data || [];
}