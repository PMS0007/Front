import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server-side guard: only hotel employees may open staff/control-board routes.
 * Complements middleware so URL access cannot bypass protection.
 */
export async function requireHotelStaff() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const isHotelStaff = cookieStore.get("is_hotel_staff")?.value === "true";

  if (!token) {
    redirect("/auth/login");
  }

  if (!isHotelStaff) {
    redirect("/dashboard");
  }
}
