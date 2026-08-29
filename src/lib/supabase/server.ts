import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function resolveSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Falls back to a syntactically-valid placeholder so client construction
  // never throws before .env.local holds a real Supabase project — callers
  // use getSafeUser() below, which treats the resulting network failure as
  // "signed out" instead of crashing the page.
  if (!url || url.includes("[PROJECT-REF]")) return "https://placeholder.supabase.co";
  return url;
}

function resolveSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key || key.includes("[anon public key]")) return "placeholder-anon-key";
  return key;
}

/** Server Component / Route Handler Supabase client, scoped to the current request's cookies. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(resolveSupabaseUrl(), resolveSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — safe to ignore because
          // middleware refreshes the session on every request.
        }
      },
    },
  });
}

/**
 * Like `supabase.auth.getUser()`, but never throws — if Supabase isn't
 * configured yet (or the network call fails), this resolves to "signed out"
 * instead of crashing the page. Prefer this over calling `.auth.getUser()`
 * directly in Server Components.
 */
export async function getSafeUser() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (err) {
    // Next's static-rendering bailout (thrown when a page that uses cookies()
    // is prerendered) must propagate so Next can correctly mark the route
    // dynamic — only genuine Supabase/network failures should be swallowed.
    if (err && typeof err === "object" && "digest" in err) throw err;
    console.error("Supabase getUser() failed:", err);
    return null;
  }
}
