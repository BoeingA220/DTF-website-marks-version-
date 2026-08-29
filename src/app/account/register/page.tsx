"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/account");
      router.refresh();
    } else {
      setCheckEmail(true);
      setLoading(false);
    }
  }

  if (checkEmail) {
    return (
      <section className="container-brand flex min-h-[60vh] items-center justify-center py-16">
        <div className="w-full max-w-sm rounded-2xl border border-black/10 bg-white p-7 text-center">
          <h1 className="font-display text-xl font-bold text-ink">Check your email</h1>
          <p className="mt-2 text-sm text-ink/60">
            We sent a confirmation link to <strong>{email}</strong>. Click it to
            activate your account, then sign in.
          </p>
          <Link
            href="/account/login"
            className="mt-5 inline-flex rounded-full bg-royal px-5 py-2.5 text-sm font-bold text-white"
          >
            Go to Sign In
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-brand flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-2xl border border-black/10 bg-white p-7">
        <h1 className="font-display text-2xl font-bold text-ink">Create Account</h1>
        <p className="mt-1 text-sm text-ink/60">
          Save your orders, artwork, and reorder in a click.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="reg-name" className="mb-1.5 block text-sm font-semibold text-ink">
              Name
            </label>
            <input
              id="reg-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
            />
          </div>
          <div>
            <label htmlFor="reg-email" className="mb-1.5 block text-sm font-semibold text-ink">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
            />
          </div>
          <div>
            <label htmlFor="reg-password" className="mb-1.5 block text-sm font-semibold text-ink">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-royal"
            />
          </div>

          {error && <p className="text-sm font-semibold text-accent">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-royal px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink/60">
          Already have an account?{" "}
          <Link href="/account/login" className="font-semibold text-royal hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
