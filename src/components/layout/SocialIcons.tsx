import { BUSINESS } from "@/lib/constants";

const iconClass = "h-4.5 w-4.5 fill-current";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
      <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46h1.6V4.3C16.3 4.2 15.36 4.1 14.27 4.1c-2.28 0-3.84 1.39-3.84 3.95v2.45H8v3h2.43V21h3.07Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.5.5.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.13s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.76 4.9 4.9 0 0 1-1.76 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.13-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.76-1.15 4.9 4.9 0 0 1-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.13c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76A4.9 4.9 0 0 1 5.44.53C6.08.28 6.81.11 7.87.06 8.94.01 9.28 0 12 0Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2A3.2 3.2 0 1 1 12 6.8a3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.17 1.17 0 1 1 0-2.34 1.17 1.17 0 0 1 0 2.34Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
      <path d="M16.6 2h-3.2v13.2a2.6 2.6 0 1 1-1.84-2.49v-3.3a5.8 5.8 0 1 0 5.04 5.75V8.6a7.6 7.6 0 0 0 4.4 1.4V6.8a4.4 4.4 0 0 1-4.4-4.4V2Z" />
    </svg>
  );
}

export function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a
        href={BUSINESS.social.facebook}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Royal Eye Candy on Facebook"
        className="rounded-full p-2 transition-colors hover:bg-white/10"
      >
        <FacebookIcon />
      </a>
      <a
        href={BUSINESS.social.instagram}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Royal Eye Candy on Instagram"
        className="rounded-full p-2 transition-colors hover:bg-white/10"
      >
        <InstagramIcon />
      </a>
      <a
        href={BUSINESS.social.tiktok}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Royal Eye Candy on TikTok"
        className="rounded-full p-2 transition-colors hover:bg-white/10"
      >
        <TikTokIcon />
      </a>
    </div>
  );
}
