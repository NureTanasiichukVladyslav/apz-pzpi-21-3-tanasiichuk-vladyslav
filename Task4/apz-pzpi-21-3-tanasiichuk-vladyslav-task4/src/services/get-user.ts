import { UserDto } from "@/types";
import { fetchClient } from "@/utils/fetch";

export async function getUser() {
  try {
    const response = await fetchClient.get<UserDto>(`auth/user`, {
      next: { tags: ["user"] },
    });
    return response;
  } catch (error) {
    // @ts-ignore
    if (error.requestInfo.status === 401) {
      return undefined;
    }

    console.error(error);
  }
}
