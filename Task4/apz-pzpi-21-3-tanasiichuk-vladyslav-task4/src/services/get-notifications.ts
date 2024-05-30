import { NotificationDto } from "@/types";
import { fetchClient } from "@/utils/fetch";

export async function getNotifications() {
  return fetchClient.get<NotificationDto[]>(`notifications`);
}
