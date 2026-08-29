import Image from "next/image";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function Logo({
  variant = "dark",
  size = "md",
}: {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}) {
  const dims = { sm: 32, md: 40, lg: 56 }[size];
  const textSize = { sm: "text-base", md: "text-xl", lg: "text-2xl" }[size];

  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 shrink-0"
      aria-label={`${SITE_NAME} — home`}
    >
      <Image
        src="/logo/eye-mark.svg"
        alt=""
        width={dims}
        height={dims}
        priority
        className="shrink-0"
      />
      <span
        className={`font-display font-bold leading-tight tracking-tight ${textSize} ${
          variant === "light" ? "text-white" : "text-ink"
        }`}
      >
        Royal <span className="text-royal">Eye</span>{" "}
        <span className="text-accent">Candy</span>
      </span>
    </Link>
  );
}
