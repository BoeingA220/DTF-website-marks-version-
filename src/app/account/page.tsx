import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, FileImage } from "lucide-react";
import { AccountShell } from "@/components/account/AccountShell";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { getCurrentProfile } from "@/lib/auth";
import { getSafeUser } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function AccountPage() {
  const user = await getSafeUser();
  if (!user) redirect("/account/login");

  let profile;
  let orderCount = 0;
  let artworkCount = 0;
  let dbError = false;

  try {
    profile = await getCurrentProfile();
    orderCount = await prisma.order.count({ where: { userId: user.id } });
    artworkCount = await prisma.artworkFile.count({ where: { userId: user.id } });
  } catch (err) {
    console.error("Account dashboard DB lookup failed:", err);
    dbError = true;
  }

  return (
    <AccountShell name={profile?.name ?? user.email}>
      <h1 className="font-display text-2xl font-bold text-ink">Your Account</h1>
      <p className="mt-1 text-sm text-ink/60">{user.email}</p>

      {dbError ? (
        <div className="mt-6">
          <SetupNotice message="The database isn't connected yet, so orders and saved artwork can't load. Once DATABASE_URL is set (see README), this page will show your real order history." />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/account/orders"
            className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-royal/10 text-royal">
              <Package className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-ink">{orderCount}</p>
              <p className="text-sm text-ink/60">Orders</p>
            </div>
          </Link>
          <Link
            href="/account/artwork"
            className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan/10 text-cyan-dark">
              <FileImage className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-ink">{artworkCount}</p>
              <p className="text-sm text-ink/60">Saved Artwork Files</p>
            </div>
          </Link>
        </div>
      )}
    </AccountShell>
  );
}
