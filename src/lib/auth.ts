import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSafeUser } from "@/lib/supabase/server";

/**
 * Returns the signed-in Supabase user's app Profile, creating it on first
 * request if it doesn't exist yet (avoids requiring a manual DB trigger
 * to be set up in Supabase before accounts work).
 */
export async function getCurrentProfile() {
  const user = await getSafeUser();
  if (!user) return null;

  return prisma.profile.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email ?? "",
      name: (user.user_metadata?.name as string | undefined) ?? null,
    },
  });
}

/** Redirects non-admins away. Use at the top of every /admin page. */
export async function requireAdminProfile() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/account/login?next=/admin");
  if (profile.role !== "ADMIN") redirect("/");
  return profile;
}
